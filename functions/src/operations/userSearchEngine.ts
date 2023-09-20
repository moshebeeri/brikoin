const functions = require('firebase-functions');
const admin = require('firebase-admin');

const algoliasearch = require('algoliasearch');

const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-USERS`);
export async function searchUsers(data) {
	console.log(`search ${data}`);
	let result = await index.search(data);
	console.log(`results: ${JSON.stringify(result.hits)}`);
	return result;
}

exports.updateUserIndex = functions.database.ref(`server/usersPublic`).onWrite(async (change, context) => {
	console.log('START updateUserIndex');
	let users = await getUsers();
	console.log(`users ${JSON.stringify(users)}`);
	index.saveObjects(users);
	console.log('END updateUserIndex');
});

async function getUsers() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child('/usersPublic').once('value', function(snapshot) {
				let results = snapshot.val();
				console.log(results);
				if (results) {
					let requests = Object.keys(results).map((key) => {
						let user = results[key];
						user.objectID = key;
						return user;
					});
					resolve(requests);
				}
				resolve([]);
			});
		} catch (error) {
			reject([]);
		}
	});
}
