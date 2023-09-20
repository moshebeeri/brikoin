const functions = require('firebase-functions');
const admin = require('firebase-admin');
import {
	addNotificationWithParams,
	getActiveRequest,
	getConfiguration,
	getGroup,
	getProject,
	getUserActiveAccount
} from './utils';
import {
	addGroupRpresentive,
	addGroupVote,
	updatePaymentStatus,
	createGroup,
	inviteUserGroup,
	isGroupRepresentative,
	isVotingMember,
	joinGroup,
	vote
} from './wallet';

exports.inviteUser = functions.database
	.ref(`server/operations/events/inviteUserTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let inviteUser = <any>await getActiveRequest('inviteUser');
		if (inviteUser.userId) {
			await inviteUser(inviteUser.creator, inviteUser.userId, inviteUser.groupId);
			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('inviteUser')
				.child(inviteUser.key)
				.update({ active: false });
		}
	});

export async function inviteUser(creator, userId, groupId) {
	let group = <any>await getGroup(groupId);
	if (group.creator === creator) {
		let db = admin.database();
		let configuration = <any>await getConfiguration();
		if (configuration.useBlockchain) {
			await inviteUserGroup(group.creator, group.groupAddress, userId);
		}
		await db.ref(`server/groups/${groupId}/members/`).push({
			status: 'Invited',
			userId: userId
		});

		await db.ref(`server/groups/changed/${group.project}`).set({
			time: new Date().getTime()
		});

		await addNotificationWithParams(userId, 'groups', 'invitation', { project: group.project });
		await addNotificationWithParams(creator, 'groups', 'invitationDone', { project: group.project });
		await sendMails(userId, group);
		return { sucssess: true };
	}
	return { sucssess: false };
}
const runtimeGroupVote = {
	timeoutSeconds: 300
};
exports.createGroupVote = functions
	.runWith(runtimeGroupVote)
	.database.ref(`server/operations/events/addGroupVoteTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let groupVote = <any>await getActiveRequest('addGroupVote');
		let configuration = <any>await getConfiguration();
		if (groupVote.groupId) {
			let group = <any>await getGroup(groupVote.groupId);
			let userIsGroupRepresentation = await isGroupRepresentative(group.groupAddress, groupVote.userId);
			console.log(`userIsGroupRepresentation ${userIsGroupRepresentation}`);
			if (userIsGroupRepresentation) {
				await addGroupVote(groupVote.documentMd5, groupVote.type, group.groupAddress, group.creator);
				console.log(`vote added  ${groupVote.documentMd5}`);
				await db.ref(`server/groups/${groupVote.groupId}/votes/`).push({
					subject: groupVote.subject,
					documentMd5: groupVote.documentMd5,
					documentUrl: groupVote.documentUrl
				});

				await db.ref(`server/groups/changed/${group.project}`).set({
					time: new Date().getTime()
				});
				let members = <any>getGroupMembers(group);
				console.log(`members   ${JSON.stringify(members)}`);
				await Promise.all(
					members.map(async (member) => {
						let votingRights = await isVotingMember(group.groupAddress, member.userId);
						console.log(`votingRights   ${JSON.stringify(member)}`);
						if (votingRights) {
							await createVotingOperation(
								member.userId,
								groupVote.subject,
								groupVote.documentUrl,
								groupVote.documentMd5,
								groupVote.type,
								group.project
							);
							await addNotificationWithParams(member.userId, 'groups', 'votes', {
								project: group.project,
								subject: groupVote.subject,
								documentUrl: groupVote.documentUrl
							});
						}
					})
				);
			}
			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('addGroupVote')
				.child(groupVote.key)
				.update({ active: false });
		}
	});

exports.addGroupRepresentor = functions.database
	.ref(`server/operations/events/groupRepresentedTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let groupRepresented = <any>await getActiveRequest('groupRepresented');
		let configuration = <any>await getConfiguration();
		if (groupRepresented.groupId) {
			let group = <any>await getGroup(groupRepresented.groupId);
			if (group.creator === groupRepresented.creator) {
				if (configuration.useBlockchain) {
					await addGroupRpresentive(group.groupAddress, group.creator, groupRepresented.userId);
				}
				await db.ref(`server/groups/${groupRepresented.groupId}/representatives/`).push({
					userId: groupRepresented.userId
				});
			}

			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('groupRepresented')
				.child(groupRepresented.key)
				.update({ active: false });
		}
	});

exports.groupVote = functions.database
	.ref(`server/operations/events/groupVoteTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let groupVote = <any>await getActiveRequest('groupVote');
		if (groupVote.groupId) {
			console.log('start group voting');
			let group = <any>await getGroup(groupVote.groupId);
			console.log('voting');
			let votingResults = <any>await vote(
				groupVote.userId,
				groupVote.documentMd5,
				groupVote.vote,
				group.groupAddress
			);
			await db.ref(`server/groups/${groupVote.groupId}/votes/${groupVote.voteId}/results`).push({
				result: groupVote.vote
			});
			console.log('voting done');
			await db.ref(`server/groups/${groupVote.groupId}/votes/${groupVote.voteId}`).update(votingResults);

			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('groupVote')
				.child(groupVote.key)
				.update({ active: false });
		}
	});

exports.groupPaymentStatus = functions.database
	.ref(`server/operations/events/groupPaymentStatusTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let groupPaymentStatus = <any>await getActiveRequest('groupPaymentStatus');
		let configuration = <any>await getConfiguration();
		if (groupPaymentStatus.groupId) {
			let group = <any>await getGroup(groupPaymentStatus.groupId);

			let isVotingMember = configuration.useBlockchain
				? await updatePaymentStatus(
						group.groupAddress,
						groupPaymentStatus.userId,
						groupPaymentStatus.trustee,
						groupPaymentStatus.amount,
						groupPaymentStatus.addOperation
					)
				: true;
			await db.ref(`server/groups/${groupPaymentStatus.groupId}/members/${groupPaymentStatus.memberId}`).update({
				votingRights: isVotingMember
			});

			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('groupPaymentStatus')
				.child(groupPaymentStatus.key)
				.update({ active: false });
		}
	});

exports.acceptInvatation = functions.database
	.ref(`server/operations/events/acceptInvitationTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let configuration = <any>await getConfiguration();
		let acceptInvitation = <any>await getActiveRequest('acceptInvitation');
		if (acceptInvitation.userId) {
			await db.ref(`server/groups/${acceptInvitation.groupId}/members/${acceptInvitation.memberId}`).update({
				status: 'Active'
			});
			let group = <any>await getGroup(acceptInvitation.groupId);
			if (configuration.useBlockchain) {
				await joinGroup(group.groupAddress, acceptInvitation.userId);
			}
			await db.ref(`server/groups/changed/${group.project}`).set({
				time: new Date().getTime()
			});
			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('acceptInvitation')
				.child(acceptInvitation.key)
				.update({ active: false });
		}
		console.log('END acceptInvitation');
	});

const runtimeOpts = {
	timeoutSeconds: 120
};

export async function acceptInvatation(userId, memberId, groupId) {
	let group = <any>await getGroup(groupId);
	let configuration = <any>await getConfiguration();
	let db = admin.database();
	await db.ref(`server/groups/${groupId}/members/${memberId}`).update({
		status: 'Active'
	});
	if (configuration.useBlockchain) {
		await joinGroup(group.groupAddress, userId);
	}
	await db.ref(`server/groups/changed/${group.project}`).set({
		time: new Date().getTime()
	});
	return { sucssess: true };
}
exports.createGroup = functions
	.runWith(runtimeOpts)
	.database.ref(`server/operations/events/createGroupTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let groupRequest = <any>await getActiveRequest('createGroup');
		let configuration = <any>await getConfiguration();
		if (groupRequest.userId) {
			let groupAddress = { groupAddress: new Date().getTime() };
			console.log(`configuration : ${configuration} configuration.useBlockChain ${configuration.useBlockchain}`);
			if (configuration.useBlockchain) {
				console.log('creating group with BC');
				groupAddress = <any>await createGroup(
					groupRequest.userId,
					groupRequest.project,
					groupRequest.type === 'OPEN'
				);
			}
			console.log(`groupAddress : ${JSON.stringify(groupAddress)}`);

			await db.ref(`server/groups/`).child(groupRequest.groupKey).update({
				groupAddress: groupAddress.groupAddress
			});

			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('createGroup')
				.child(groupRequest.key)
				.update({ active: false });
			await db.ref(`server/operations/events/createGroupTrigger`).update({ time: new Date().getTime() });
		}
		console.log('END createGroup');
	});

function getGroupMembers(group) {
	return Object.keys(group.members).map((key) => group.members[key]);
}

export async function createNewGroup(groupRequest, userId) {
	let db = admin.database();
	if (groupRequest.userId) {
		let groupKey = await db.ref(`server/groups/`).push({
			type: groupRequest.type,
			creator: userId,
			project: groupRequest.project,
			name: groupRequest.name,
			active: true
		}).key;

		await db.ref(`server/groups/${groupKey}/members`).push({
			status: 'Active',
			userId: userId
		});
		groupRequest.groupKey = groupKey;
		groupRequest.userId = userId;
		groupRequest.active = true;
		await db.ref(`server/operations/events/createGroup`).push(groupRequest);
		await db.ref(`server/operations/events/createGroupTrigger`).update({ time: new Date().getTime() });

		await db.ref(`server/groups/changed/${groupRequest.project}`).set({
			time: new Date().getTime()
		});
		await createGroupInvestmentTask(groupKey);

		return { groupKey: groupKey };
	}
	console.log('END createGroup');
	return { groupKey: '', status: 'failed' };
}

async function createGroupInvestmentTask(groupId) {
	const db = admin.database();
	console.log(`createGroupInvestmentTask creation`);

	let scheduleTask = {
		active: true,
		groupId: groupId,
		type: 'triggerGroupInvestment',
		time: new Date().getTime()
	};

	console.log(`createGroupInvestmentTask Task : ${JSON.stringify(scheduleTask)}`);
	db.ref('server').child(`/operationHub/taskManager`).push(scheduleTask);
}

exports.joinGroup = functions.database
	.ref(`server/operations/events/joinGroupTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let joinRequest = <any>await getActiveRequest('joinGroup');
		let configuration = <any>await getConfiguration();
		if (joinRequest.userId) {
			let group = <any>await getGroup(joinRequest.groupId);
			if (group.type === 'OPEN') {
				if (configuration.useBlockchain) {
					await joinGroup(group.groupAddress, joinRequest.userId);
				}

				await db.ref(`server/groups/${joinRequest.groupId}/members`).push({
					status: 'Active',
					userId: joinRequest.userId
				});
				await db.ref(`server/groups/changed/${group.project}`).set({
					time: new Date().getTime()
				});
			}
			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('joinGroup')
				.child(joinRequest.key)
				.update({ active: false });
		}
		console.log('END joinRequest');
	});
export async function userJoinGroup(userId, groupId) {
	let db = admin.database();
	let configuration = <any>await getConfiguration();
	let group = <any>await getGroup(groupId);
	if (group.type === 'OPEN') {
		if (configuration.useBlockchain) {
			await joinGroup(group.groupAddress, userId);
		}

		await db.ref(`server/groups/${groupId}/members`).push({
			status: 'Active',
			userId: userId
		});
		await db.ref(`server/groups/changed/${group.project}`).set({
			time: new Date().getTime()
		});
	}
	return { sucssess: true };
}
async function createVotingOperation(userId, subject, documentUrl, documentMd5, type, project) {
	let db = admin.database();
	await db.ref(`server/operationHub/${userId}/operations/`).push({
		type: 'groupVote',
		status: 'waiting',
		subject: subject,
		project: project,
		documentUrl: documentUrl,
		documentMd5: documentMd5,
		name: 'vote',
		time: new Date().getTime(),
		voteType: type
	});
}

async function sendMails(user, group) {
	let userAccount = <any>await getUserActiveAccount(user);
	let userCreator = <any>await getUserActiveAccount(group.creator);
	let project = <any>await getProject(group.project);
	let mail = {
		active: true,
		params: {
			project: group.project,
			groupName: group.name,
			projectName: project.name,
			inventor: userCreator.name,
			time: new Date().getTime()
		},
		template: 'project.group.invite.user',
		to: userAccount.email
	};
	let db = admin.database();
	await db.ref(`server/operations/events/sendEmail/`).push(mail);
	await db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
}
