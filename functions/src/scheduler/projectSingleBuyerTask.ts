import {
	addNotificationWithParams,
	getProject,
	getPendingOrder,
	getUserActiveAccount,
	getProjectInitialAskId,
	updateBrokerFees,
	getAdminAccount,
	syncUserLedger
} from '../operations/utils';

import { depositCoinsProject, projectBidRequest, projectTradeRequest, updateProjectTarget } from '../operations/wallet';

import { updateFlowStep, getFlowInstanceById } from './FlowManagerUtils';
const admin = require('firebase-admin');

export async function triggerProjectSingleBuyerCondition(task) {
	return true;
}

export async function triggerProjectSingleBuyerRun(task) {
	let order = <any>await getPendingOrder(task.userId, task.project);
	let project = <any>await getProject(task.project);
	let userAccount = <any>await getUserActiveAccount(task.userId);

	console.log('DEPOSIT ALL FUND');
	await depositFunds(userAccount, order, task);

	if (parseInt(order.amount) < parseInt(project.target)) {
		console.log(`update project stone coins number ${parseInt(project.target) - parseInt(order.amount)}`);
		await updateProjectTarget(task.project, false, parseInt(project.target) - parseInt(order.amount));
	}
	console.log('BID');
	let response = <any>await projectBidRequest(userAccount.accountId, order.project, order.amount, 1, 0);
	console.log(`BID: ${JSON.stringify(response)}`);
	if (response.success) {
		let adminAccount = <any>await getAdminAccount('project');
		console.log('TRADE');
		response = await projectTradeRequest(
			userAccount.accountId,
			adminAccount.accountId,
			order.amount,
			order.price,
			adminAccount.accountId,
			adminAccount.privateKey,
			order.project
		);
		console.log(`TRADE: ${JSON.stringify(response)}`);
		if (response.success) {
			let flowInstance = await getFlowInstanceById(task.flowInstance);
			console.log(`updateFlowStep`);
			updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
			await addNotificationWithParams(task.userId, 'projectDone', 'confirmBuy', { project: task.project });
			console.log(`updatePendingOrderDone`);
			await updatePendingOrderDone(order, task.project);
			console.log(`updateProjectHoldings`);
			await updateProjectHoldings(task.userId, task.project, order.amount);

			console.log(`closeAsk`);
			closeAsk(task.project);
			console.log(`syncUserLedger`);
			await syncUserLedger(task.userId);
			console.log(`updateBroker`);
			await updateBroker(task.userId);
		}
	}
}

async function depositFunds(userAccount, order, task) {
	let db = admin.database();
	await depositCoinsProject(userAccount.accountId, order.amount, task.project);
	db.ref('server').child('projects').child('pendingOrders').child(task.project).child(order.key).update({
		cancelOrder: false,
		fullDeposit: true
	});
}

async function updateBroker(userId) {
	let brokerId = await getBrokerId(userId);
	if (brokerId) {
		await syncUserLedger(brokerId);
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
