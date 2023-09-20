const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { createAccount, assignUserToBroker } from './wallet';
import { assignUserToBrokerOperation } from './brokerOperations';
import { getAdminAccountId, getUserActiveAccount } from './utils';

function updateBrokerCustomers(brokerAccount: any, account: any) {
	let db = admin.database();
	db
		.ref('server')
		.child('users')
		.child(brokerAccount.user_id)
		.child('accounts')
		.child(brokerAccount.id)
		.child('brokerCustomers')
		.push({ user_id: account.user_id, userAccount: account.accountId });
}

async function updateBroker(brokerId: any, account: any) {
	try {
		console.log('ASSIGN BROKER TO USER');
		let brokerAccount = <any>await getUserActiveAccount(brokerId);
		let response = await assignUserToBroker(brokerAccount.accountId, account.accountId);
		console.log('Assign results ' + JSON.stringify(response));
		if (response.success) {
			account.brokerAccount = updateBrokerCustomers(brokerAccount, account);
		}
		return account;
	} catch (error) {
		console.log(
			'FAILED ASSIGN BROKER ' + brokerId + ' ##  ' + JSON.stringify(account) + '  ##  ' + JSON.stringify(error)
		);
		return account;
	}
}

exports.internalAccount = functions.database
	.ref(`server/operations/events/addInternalAccountTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		try {
			let accounts = <any>await getInternalAccounts();
			console.log('ACCOUNT ' + JSON.stringify(accounts));
			if (accounts) {
				accounts.forEach(async (accountEvent) => {
					db
						.ref('server')
						.child('/operations/events/addInternalAccount')
						.child(accountEvent.key)
						.update({ active: false });
					console.log(JSON.stringify(accountEvent));
					let userId = accountEvent.userId;
					let account;
					if (accountEvent.type === 'EXTERNAL') {
						console.log('CREATING EXTERNAL WALLET ' + userId);
						account = {
							name: accountEvent.name,
							user_id: userId,
							email: accountEvent.name,
							accountId: accountEvent.accountId,
							privateKey: accountEvent.privateKey ? accountEvent.privateKey : ' ',
							stonesBalance: 0,
							type: 'EXTERNAL'
						};
					} else {
						console.log('CREATING INTERNAL ACCOUNT FOR: ' + userId);
						let blockChainAccount = <any>await createAccount();
						account = {
							name: accountEvent.name,
							email: accountEvent.name,
							user_id: userId,
							accountId: blockChainAccount.address,
							privateKey: blockChainAccount.privateKey,
							stonesBalance: 0,
							type: 'INTERNAL'
						};
					}
					console.log('push account ' + JSON.stringify(account));
					if (accountEvent.brokerId) {
						account = await updateBroker(accountEvent.brokerId, account);
					}

					db.ref('server').child('users').child(userId).child('accounts').push(account);
					db
						.ref('server')
						.child('users')
						.child(userId)
						.child('activeAccount')
						.set({ accountId: account.accountId });
					db.ref('server').child('usersPublic').child(userId).set({
						name: account.name
					});
					console.log(`brokerToken: ${accountEvent.brokerToken}`);
					if (accountEvent.brokerToken) {
						console.log('ASSIGN TO BRoker');
						account = await assignUserToBrokerOperation(accountEvent.brokerToken, userId);
					}
					sendWelcomeMail(accountEvent.name, userId);
				});
			}
		} catch (error) {
			console.log('error');
		}
	});

async function sendWelcomeMail(name, userId) {
	let db = admin.database();
	const user = await admin.auth().getUser(userId);
	console.log('SENDING EMAIL');
	console.log(
		JSON.stringify({
			template: 'project.investment.project.welcome',
			to: user.email,
			params: {
				name: name,
				thanksIssue: 'Welcome'
			},

			active: true
		})
	);

	db.ref('server/operations/events/sendEmail').push({
		template: 'project.investment.project.welcome',
		to: user.email,
		params: {
			name: name,
			thanksIssue: 'Welcome'
		},
		active: true
	});
	db.ref('server/operations/events/sendMailTrigger').update({ time: new Date().getTime() });
}

async function getInternalAccounts() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db
				.ref('server')
				.child('/operations/events/addInternalAccount')
				.orderByChild('active')
				.equalTo(true)
				.once('value', function(snapshot) {
					let accountObject = snapshot.val();
					if (accountObject) {
						console.log(JSON.stringify(accountObject));
						let accounts = Object.keys(accountObject).map((key) => {
							let userAccount = accountObject[key];
							userAccount.key = key;
							return userAccount;
						});
						resolve(accounts);
					}
					resolve([]);
				});
		} catch (error) {
			reject(error);
		}
	});
}
