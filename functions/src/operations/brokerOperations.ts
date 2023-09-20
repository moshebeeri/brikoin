const functions = require('firebase-functions');
const admin = require('firebase-admin');
import { getUserActiveAccount, getAdminAccountId, getActiveRequest, getConfiguration } from './utils';
import { assignNewBroker, payBroker, assignUserToBroker } from './wallet';

exports.assignBroker = functions.database
	.ref(`server/operations/events/triggerAssignBrokerCheck`)
	.onWrite(async (change, context) => {
		try {
			let brokerRequest = await getActiveRequest('assignBroker');
			await handleBrokerRequest(brokerRequest);
		} catch (error) {
			console.log('error');
		}
	});
exports.payBroker = functions.database
	.ref(`server/operations/events/triggerPayBrokerCheck`)
	.onWrite(async (change, context) => {
		try {
			let brokerPaymentRequest = await getBrokerPaymentRequest();
			await handleBrokerPaymentRequest(brokerPaymentRequest);
		} catch (error) {
			console.log('error');
		}
	});

export async function generateBrokerLink(userId) {
	let validation = validateBroker(userId);
	if (!validation) {
		return { status: 'failed' };
	}

	let configuration = <any>await getConfiguration();
	let token = await getBrokerToken(userId);
	if (token) {
		return { status: 'succsess', link: `${configuration.env}/broker/${token}` };
	}
	token = createBrokerToken(userId);
	return { status: 'succsess', link: `${configuration.env}/broker/${token}` };
}

export async function assignUserToBrokerOperation(brokerToken, userId) {
	let brokerId = await getBrokerIdByToken(brokerToken);
	console.log(`brokerId ${JSON.stringify(brokerId)}`);
	if (brokerId) {
		let userAccount = <any>await getUserActiveAccount(userId);
		let brokerAccount = <any>await getUserActiveAccount(brokerId);
		assignUserToBroker(brokerAccount.accountId, userAccount.accountId);
		let db = admin.database();
		db.ref('server').child(`brokers/${brokerId}/`).push({ user: userId, status: 'active' });
	}
}

async function getBrokerIdByToken(token) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child('/brokers').orderByChild('token').equalTo(token).once('value', function(snapshot) {
				let results = snapshot.val();
				console.log(results);
				if (results) {
					let brokers = Object.keys(results).map((key) => {
						let broker = results[key];
						broker.userId = key;
						return broker;
					});
					resolve(brokers[0].userId);
				} else {
					resolve('');
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

async function updateUserPayment(userAccount, payment) {
	let db = admin.database();
	db
		.ref('server/users/')
		.child(userAccount.user_id)
		.child('accounts')
		.child(userAccount.id)
		.update({ payedFees: payment });
}

async function handleBrokerRequest(request) {
	let db = admin.database();
	if (request) {
		console.log('ASSIGN BROKER STARTING');
		let userAccount = <any>await getUserActiveAccount(request.userId);

		let response = <any>await assignNewBroker(userAccount.accountId);
		console.log('Assign Broker Result: ' + JSON.stringify(response));
		db.ref('server').child('/operations/events/assignBroker').child(request.orderId).update({ active: false });
	}
}

async function handleBrokerPaymentRequest(request) {
	let db = admin.database();
	if (request) {
		console.log('PAY BROKER STARTING');
		let userAccount = <any>await getUserActiveAccount(request.userId);
		let response = <any>await payBroker(userAccount.accountId, request.payment);
		console.log('Pay Broker Result: ' + JSON.stringify(response));
		if (response.success) {
			await updateUserPayment(userAccount, response.payment);
		}
		db.ref('server').child('/operations/events/payBroker').child(request.orderId).update({ active: false });
	}
}

function createBrokerToken(userId) {
	let token = `${new Date().getTime()}${userId}`;
	let db = admin.database();
	db.ref('server').child(`brokers/${userId}/token`).set(token);
	return token;
}

async function getBrokerPaymentRequest() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db
				.ref('server')
				.child('/operations/events/payBroker')
				.orderByChild('active')
				.equalTo(true)
				.once('value', function(snapshot) {
					let results = snapshot.val();
					console.log(results);
					if (results) {
						let payments = Object.keys(results).map((key) => {
							let payment = results[key];
							payment.orderId = key;
							return payment;
						});
						resolve(payments[0]);
					}
				});
		} catch (error) {
			reject(error);
		}
	});
}

async function validateBroker(brokerId) {
	return true;
}

async function getBrokerToken(brokerId) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child(`brokers/${brokerId}/token`).once('value', function(snapshot) {
				let token = snapshot.val();
				resolve(token);
			});
		} catch (error) {
			reject(error);
		}
	});
}
