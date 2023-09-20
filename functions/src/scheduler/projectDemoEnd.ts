import {
	addNotificationWithParams,
	getProject,
	getPendingOrder,
	getUserActiveAccount,
	getProjectInitialAskId,
	updateBrokerFees
} from '../operations/utils';

import { updateFlowStep, getFlowInstanceById } from './FlowManagerUtils';
const admin = require('firebase-admin');

export async function triggerProjectDoneCondition(task) {
	return true;
}

export async function triggerProjectDoneRun(task) {
	let order = <any>await getPendingOrder(task.userId, task.project);
	let project = <any>await getProject(task.project);
	console.log(`order: ${JSON.stringify(order)}`);
	await updateProjectHoldings(task.userId, task.project, order.amount);
	console.log(`ORDER AMOUNT : ${order.amount} project target: ${project.target}`);
	if (parseInt(order.amount) === parseInt(project.target)) {
		console.log('close ask order');
		closeAsk(task.project);
	}
	let flowInstance = await getFlowInstanceById(task.flowInstance);
	console.log('UPDATE FLOW STEP');
	updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
	console.log('UPDATE LEDGER');
	await addUserLeger(task.userId, order, task.project);
	console.log('NOTIFY USER ');
	await updateBroker(task.userId, order, task.project);
	await addNotificationWithParams(task.userId, 'projectDone', 'confirmBuy', {
		project: task.project,
		flowId: task.flowInstance
	});
	await updatePendingOrderDone(order, task.project);
}

async function updateBroker(userId, order, project) {
	let brokerId = await getBrokerId(userId);
	if (brokerId) {
		let account = <any>await getUserActiveAccount(brokerId);
		let db = admin.database();

		await db.ref('server').child('users').child(brokerId).child('accounts').child(account.id).update({
			stonesBalance: 1
		});
		await db.ref('server').child('users').child(brokerId).child('ledger').push({
			amount: parseInt(order.amount) * 1000000 * 0.02,
			description: 'DEPOSIT',
			isAddd: true,
			projectAddress: '0',
			time: new Date().getTime()
		});
	}
}

async function getBrokerId(userId) {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('brokers').once('value', function(snapshot) {
				let results = snapshot.val();
				if (results) {
					let brokerUser = Object.keys(results)
						.map((newUser) => {
							let result = results[newUser];
							let users = Object.keys(result).filter((key) => result[key].user === userId);
							if (users.length > 0) {
								return newUser;
							}
							return '';
						})
						.filter((user) => user);
					console.log(`Broker Users ${JSON.stringify(brokerUser)}`);
					if (brokerUser.length > 0) {
						resolve(brokerUser[0]);
						return;
					}

					resolve('');
				} else {
					resolve('');
				}
			});
		} catch (error) {
			reject(error);
		}
	});
}

async function addUserLeger(userId, order, project) {
	let db = admin.database();
	await db.ref('server').child('users').child(userId).child('ledger').push({
		amount: parseInt(order.amount) * 1000000,
		description: 'INTERNAL_BID',
		isAddd: false,
		projectAddress: project,
		time: new Date().getTime()
	});
}
async function updatePendingOrderDone(order, project) {
	let db = admin.database();
	await db
		.ref('server')
		.child('projects')
		.child('pendingOrders')
		.child(project)
		.child(order.key)
		.update({ active: false });
}
async function updateProjectHoldings(userId, projectAddress, userHoldings) {
	let userAccountAddress = await getUserActiveAccount(userId);
	let db = admin.database();
	console.log('USER Holdings ' + userId + '  holdings: ' + userHoldings);
	await db
		.ref('server')
		.child('users')
		.child(userId)
		.child('myHoldings')
		.child(projectAddress)
		.set({ holdings: userHoldings });
	await db
		.ref('server')
		.child('projects')
		.child('holders')
		.child(projectAddress)
		.orderByChild('holder')
		.equalTo(userId)
		.once('value', function(snapshot) {
			let result = snapshot.val();
			console.log(JSON.stringify(result));
			if (result && Object.keys(result).length > 0) {
				db
					.ref('server')
					.child('projects')
					.child('holders')
					.child(projectAddress)
					.child(Object.keys(result)[0])
					.update({ holdings: userHoldings });
			} else {
				db.ref('server').child('projects').child('holders').child(projectAddress).push({
					holder: userId,
					holderAccount: userAccountAddress,
					holdings: userHoldings
				});
			}
		});
}

async function closeAsk(projectAddress) {
	console.log('CHNAGE ASK');
	let db = admin.database();
	let askKey = await getProjectInitialAskId(projectAddress);
	console.log(`askKey: ${askKey}`);
	if (askKey) {
		db.ref('server/projects/orders').child(projectAddress).child('ask').child(askKey).update({ active: false });
	}
}

async function sendEmail(project, email, order) {
	let mail = {
		active: true,
		params: {
			projectName: project.name,
			investment: parseInt(order.amount) * parseInt(order.price),
			reason: 'PROJECT SOLD'
		},
		template: 'investment.order.canceled',
		to: email
	};
	let db = admin.database();
	await db.ref(`server/operations/events/sendEmail/`).push(mail);
	await db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
	await db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
}
