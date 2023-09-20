const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { getMemberOrder } from './utils';
const algoliasearch = require('algoliasearch');
const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-GROUPS`);
const statsIndex = client.initIndex(`${functions.config().index.env}-GROUPS-STATS`);

export async function findGroupsByProject(projectAddress) {
	console.log(`search   index ${projectAddress}`);
	let result = await index.search(projectAddress);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits;
}

export async function findMyGroups(userId) {
	console.log(`search  userId ${userId}`);

	let result = await index.search(userId);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits;
}

export async function findGroupStats(groupId) {
	console.log(`search ${groupId}`);

	let result = await statsIndex.search(groupId);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result.hits && result.hits.length > 0 ? result.hits[0] : '';
}

exports.updateGroupsIndex = functions.database.ref(`server/groups`).onWrite(async (change, context) => {
	console.log('START  updateGroups');
	let groups = <any>await getGroups();
	groups = groups.filter((group) => group.id !== 'changed');
	index.saveObjects(groups);

	let statsIndexObjects = <any>await Promise.all(
		groups.map((group) => group.id).filter((id) => id !== 'changed').map((id) => getGroupStats(id))
	);

	statsIndex.saveObjects(statsIndexObjects);
	console.log('END updateGroupsIndex');
});

async function getGroups() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child('groups').once('value', function(snapshot) {
				let results = snapshot.val();
				if (results && Object.keys(results).length > 0) {
					let groups = Object.keys(results).map((key) => {
						let group = results[key];
						group.id = key;
						group.objectID = key;
						return group;
					});

					resolve(groups);
				} else {
					resolve([]);
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

const reducer = (accumulator, currentValue) => accumulator + currentValue;

export async function getGroupStats(groupId) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child('groups').child(groupId).once('value', async function(snapshot) {
				let group = snapshot.val();

				if (group) {
					let detailedMembers = await Promise.all(
						Object.keys(group.members).map((key) =>
							getMemberOrder(group.project, group.members[key], groupId)
						)
					);
					console.log(`detailedMembers: ${JSON.stringify(detailedMembers)}`);
					resolve({
						sum: detailedMembers
							.map(
								(member) =>
									member.order ? parseInt(member.order.amount) * parseInt(member.order.price) : 0
							)
							.reduce(reducer),
						sumTransferred: detailedMembers
							.map(
								(member) =>
									member.order && member.order.fullDeposit
										? parseInt(member.order.amount) * parseInt(member.order.price)
										: 0
							)
							.reduce(reducer),
						activeMembers: Object.keys(group.members)
							.map((key) => (group.members[key].status === 'Active' ? 1 : 0))
							.reduce(reducer),
						members: Object.keys(group.members).length,
						detailedMember: detailedMembers,
						reservedPercentage:
							detailedMembers
								.map((member) => (member.order ? (member.order.reserved ? 1 : 0) : 0))
								.reduce(reducer) /
							detailedMembers.length *
							100,
						signedAgreementPercentage:
							detailedMembers
								.map((member) => (member.order ? (member.order.signedAgreement ? 1 : 0) : 0))
								.reduce(reducer) /
							detailedMembers.length *
							100,
						orderApprovedPercentage:
							detailedMembers
								.map((member) => (member.order ? (member.order.orderApproved ? 1 : 0) : 0))
								.reduce(reducer) /
							detailedMembers.length *
							100,
						objectID: groupId,
						groupId: groupId
					});
				} else {
					resolve({});
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}
