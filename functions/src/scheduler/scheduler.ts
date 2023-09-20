import { trusteeAgreementCondition, trusteeAgreementRun } from './TrusteeAgreementTask';
import { monitorEvents } from './MonitorSystemEvents';
import { trusteeNotificationCondition, trusteeNotificationRun } from './TrusteeNorificationTask';
import { transferFundCondition, transferFundRun } from './TransferFundTask';
import { mortgageeKycCondition, mortgageeKycRun } from './MrtgageeKycTask';
import { montageRequestRun, mortgageRequestCondition } from './MortgageReqeustTask';
import { videoCreateCondition, videoCreateRun } from './VideoCreateTask';
import { reminderRun, reminderTasktCondition } from './RemainderTask';
import { triggerGroupInvestmentCondition, triggerGroupInvestmentRun } from './GroupInvestTriggerTask';
import { triggerGroupDoneCondition, triggerGroupDoneRun } from './GroupProjectDoneTask';
import { triggerSendFinalDocCondition, triggerSendFinalDocRun } from './sendFinalDocumentTask';
import { triggerProjectDoneCondition, triggerProjectDoneRun } from './projectDemoEnd';
import { triggerProjectSingleBuyerCondition, triggerProjectSingleBuyerRun } from './projectSingleBuyerTask';
import { triggerProjectMultiBuyerCondition, triggerProjectMultiBuyerRun } from './projectMultiBuyersTask';
import { runPendingOrderFlow } from './FlowManager';
import { getPendingOrders } from './FlowManagerUtils';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.triggerScheduler = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
	await runScheduler();
});

const runtimeOpts = {
	timeoutSeconds: 450
};

exports.triggerSchedulerNow = functions
	.runWith(runtimeOpts)
	.database.ref(`server/taskScheduler/trigger`)
	.onWrite(async (change) => {
		await runScheduler();
	});

async function runScheduler() {
	try {
		let isRunning = await schedulerIsRunning();
		if (isRunning) {
			return;
		}
		console.log('running  flow manager');
		await runFlowManager();
		let requests = <any>await getCurrentRequests();
		if (requests && requests.length > 0) {
			requests.map((request) => {
				sendRequestEvent(request);
				removeRequest(request);
			});
		}
		monitorEvents();
		await taskManager();
		await stopRunning();
	} catch (e) {
		await stopRunning();
		throw e;
	}
}

async function runFlowManager() {
	let pendingOrders = <any>await getPendingOrders();
	if (pendingOrders.length > 0) {
		await Promise.all(
			pendingOrders.map(async (order) => {
				console.log(`run order ${JSON.stringify(order)}`);
				await runPendingOrderFlow(order);
			})
		);
	}
}

function getCurrentRequests() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db
				.ref('server')
				.child('/scheduler/')
				.orderByChild('time')
				.endAt(new Date().getTime())
				.once('value', function(snapshot) {
					let results = snapshot.val();
					console.log(results);
					if (results) {
						let requests = Object.keys(results).map((key) => {
							let request = results[key];
							request.key = key;
							return request;
						});
						resolve(requests);
					}
					resolve([]);
				});
		} catch (error) {
			reject(error);
		}
	});
}

function sendRequestEvent(request) {
	let db = admin.database();
	let params = request.params;
	params.active = true;
	db.ref('server').child('/operations/events').child(request.event).push(params);
	db.ref('server').child('/operations/events').child(request.eventTrigger).set({ time: new Date().getTime() });
}

function removeRequest(request) {
	let db = admin.database();
	db.ref('server').child('/scheduler/').child(request.key).remove();
}

async function taskManager() {
	let activeTasks = <any>await getActiveTasks();
	await Promise.all(activeTasks.map(async (task) => await runTask(task)));
}

async function runTask(task) {
	let condition = <any>getTaskCondition(task);
	let conditionMet = await condition(task);
	if (conditionMet) {
		let taskRun = <any>getTaskRun(task);
		await taskRun(task);

		await setTaskDone(task);
	}
}

async function setTaskDone(task) {
	let db = admin.database();
	await db.ref('server/operationHub/taskManager').child(task.key).update({
		active: false
	});
}

function getTaskCondition(task) {
	switch (task.type) {
		case 'trusteeAgrement':
			return trusteeAgreementCondition;
		case 'sendFinalDocumentTask':
			return triggerSendFinalDocCondition;
		case 'triggerGroupInvestment':
			return triggerGroupInvestmentCondition;
		case 'triggerGroupDone':
			return triggerGroupDoneRun;
		case 'videoConference':
			return videoCreateCondition;
		case 'transferFund':
			return transferFundCondition;
		case 'reminderTask':
			return reminderTasktCondition;
		case 'projectDemoEnd':
			return triggerProjectDoneCondition;
		case 'projectSingleBuyer':
			return triggerProjectSingleBuyerCondition;
		case 'projectMultiBuyers':
			return triggerProjectMultiBuyerCondition;
		case 'mortgageRequest':
			return mortgageRequestCondition;
		case 'mortgageCheckKyc':
			return mortgageeKycCondition;
		case 'notificationTrustee':
			return trusteeNotificationCondition;
		default:
			return noCondition;
	}
}

function getTaskRun(task) {
	switch (task.type) {
		case 'videoConference':
			return videoCreateRun;
		case 'sendFinalDocumentTask':
			return triggerSendFinalDocRun;
		case 'trusteeAgrement':
			return trusteeAgreementRun;
		case 'projectDemoEnd':
			return triggerProjectDoneRun;
		case 'projectSingleBuyer':
			return triggerProjectSingleBuyerRun;
		case 'projectMultiBuyers':
			return triggerProjectMultiBuyerRun;

		case 'triggerGroupInvestment':
			return triggerGroupInvestmentRun;
		case 'triggerGroupDone':
			return triggerGroupDoneCondition;
		case 'transferFund':
			return transferFundRun;
		case 'mortgageRequest':
			return montageRequestRun;
		case 'reminderTask':
			return reminderRun;
		case 'mortgageCheckKyc':
			return mortgageeKycRun;
		case 'notificationTrustee':
			return trusteeNotificationRun;
		default:
			return noCondition;
	}
}

async function getActiveTasks() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		db
			.ref(`server/operationHub/taskManager`)
			.orderByChild('active')
			.equalTo(true)
			.once('value', function(snapshot) {
				let result = snapshot.val();
				if (result) {
					let tasks = Object.keys(result).map((key) => {
						let task = result[key];
						task.key = key;
						return task;
					});
					resolve(tasks);
				}
				resolve([]);
			});
	});
}

async function schedulerIsRunning() {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		db.ref(`server/taskScheduler/`).child('running').transaction(function(taken) {
			if (taken) {
				resolve(true);
			} else {
				resolve(false);
			}
			return true;
		});
	});
}

async function stopRunning() {
	let db = admin.database();
	await db.ref(`server/taskScheduler/`).update({ running: false });
}

function noCondition(task) {
	return true;
}
