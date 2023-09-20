const jp = require('jsonpath');
const admin = require('firebase-admin');
import {
	addNotification,
	getAdminUser,
	getDocument,
	getOperationByid,
	addNotificationWithParams
} from '../operations/utils';
import { makeCopy } from './storageUtils';
export async function getFlowByType(flowType) {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('Flows').child(flowType).once('value', function(snapshot) {
				let results = snapshot.val();
				resolve(results);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function updatePendingOrder(flowInstance, orderId, projectAddress) {
	let db = admin.database();
	db.ref('server').child('projects').child('pendingOrders').child(projectAddress).child(orderId).update({
		flowId: flowInstance.id
	});
}

export async function getFlowInstanceById(flowId) {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('FlowInstance').child(flowId).once('value', function(snapshot) {
				let results = snapshot.val();
				resolve(results);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function getUserWizardSteps(pendingOrder, userId) {
	let flowInstance = <any>await getFlowInstanceById(pendingOrder.flowId);
	if (flowInstance && flowInstance.operations) {
		let flowSteps = await getUserFlowSteps(pendingOrder, flowInstance.operations, userId);
		return flowSteps;
	}
	return [];
}

export async function getUserWizardStepsByInstance(flowInstance, userId) {
	if (flowInstance && flowInstance.operations) {
		let flowSteps = await getUserFlowSteps(flowInstance, flowInstance.operations, userId);
		console.log(` userId ${JSON.stringify(userId)} instance steps ${JSON.stringify(flowSteps)}`);
		return flowSteps;
	}
	return [];
}

async function getUserFlowSteps(pendingOrder, flowOperations, userId) {
	let steps = [];
	let currentSteps = [];
	let nextSteps = flowOperations;
	while (nextSteps) {
		currentSteps = nextSteps.current;
		let userSteps = await getUserSteps(currentSteps, pendingOrder, userId);
		steps = steps.concat(userSteps);
		nextSteps = nextSteps.next;
	}
	return steps;
}

async function getUserSteps(steps, pendingOrder, userId) {
	let currentSteps = Object.keys(steps).map((key) => steps[key]);

	const result = await filter(currentSteps, async (step) => {
		let filter = await isUserOperation(userId, step, pendingOrder);
		return filter;
	});

	return result;
}

async function filter(arr, callback) {
	const fail = Symbol();
	return (await Promise.all(arr.map(async (item) => ((await callback(item)) ? item : fail)))).filter(
		(i) => i !== fail
	);
}

async function isUserOperation(userId, step, pendingOrder) {
	let operaitonUserId = await getUserIdByRole(step.userRole, pendingOrder, '');
	if (userId === operaitonUserId) {
		return true;
	}
	return false;
}
export async function populateValues(step, params) {
	if (!params) {
		return {};
	}
	if (Object.keys(params).length === 0) {
		return {};
	}
	let parmsToType = {};
	let parmeters = Object.keys(params).map((key) => {
		let jsonParam = {};
		jsonParam[params[key]['name']] = params[key]['value'];
		parmsToType[params[key]['name']] = params[key]['type'];
		return jsonParam;
	});
	let parmeterJson = {};
	parmeters.forEach((param) => {
		parmeterJson = { ...parmeterJson, ...param };
	});
	let banks = await getBankAccounts();
	await asyncForEach(Object.keys(parmeterJson), async (key) => {
		if (parmsToType[key] === 'json') {
			return;
		}

		if (parmsToType[key] === 'filesCopy') {
			let newFile = await makeCopy(parmeterJson[key]);
			parmeterJson[key] = newFile;
			return;
		}
		if (parmsToType[key] === 'files') {
			return;
		}

		if (parmsToType[key] === 'userRole') {
			parmeterJson[key] = await getUserIdByRole(parmeterJson[key], step.order, step.order.project);
			return;
		}

		if (parmsToType[key] === 'operationHtmlDocument') {
			let path = <any>findStepPath(step.flowInstance.operations, parmeterJson[key], '');
			console.log(` path ${JSON.stringify(path)}`);
			let operation = <any>jp.query(step.flowInstance.operations, `$.${path}`);
			console.log(` operation ${JSON.stringify(operation)}`);
			let operationHub = <any>await getOperationHubByOperation(operation[0], step.order);
			console.log(` operationHub ${JSON.stringify(operationHub)}`);
			let document = <any>await getDocument(operationHub);
			console.log(` document ${JSON.stringify(document)}`);
			let documentName = document.fileName.substring(0, document.fileName.lastIndexOf('.'));
			parmeterJson[key] = `${document.documentPath}/${documentName}.html`;
			return;
		}
		if (parmsToType[key] === 'bankAccount') {
			parmeterJson[key] = banks[parmeterJson[key]];
			return;
		}
		let value = <any>jp.query(step, `$.${parmeterJson[key]}`);
		if (value && value.length > 0) {
			parmeterJson[key] = value[0];
		}
	});
	return parmeterJson;
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

async function getBankAccounts() {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('bankAccounts').once('value', function(snapshot) {
				let results = snapshot.val();
				resolve(results);
			});
		} catch (error) {
			reject(error);
		}
	});
}

async function getOperationHubByOperation(operation, order) {
	let userId = await getUserIdByRole(operation.userRole, order, order.project);
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db
				.ref('server')
				.child('operationHub')
				.child(userId)
				.child('operations')
				.orderByChild('operationId')
				.equalTo(operation.operationId)
				.once('value', function(snapshot) {
					let results = snapshot.val();
					console.log('getOperationHubByOperation' + JSON.stringify(results));
					if (results) {
						let operations = Object.keys(results).map((key) => {
							let operation = results[key];
							operation.owner = userId;
							operation.key = key;
							return operation;
						});
						resolve(operations[0]);
						return;
					}
					resolve('');
				});
		} catch (error) {
			reject(error);
		}
	});
}
export async function updateFlowInstance(flowInstance, flowId) {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('FlowInstance').child(flowId).set(flowInstance);
			resolve(true);
		} catch (error) {
			reject(error);
		}
	});
}

export async function createFlow(flow) {
	let db = admin.database();
	let key = await db.ref('server').child('FlowInstance').push(flow).getKey();
	return key;
}
export async function createOperation(name, type, params, userId, flowInstanceId) {
	let db = admin.database();
	let operation = {
		type: type,
		status: 'waiting',
		name: name,
		time: new Date().getTime()
	};
	if (Object.keys(params).length > 0) {
		operation = { ...operation, ...params };
	}
	let key = await db.ref('server').child(`operationHub/${userId}`).child('operations').push(operation).getKey();
	await addNotificationWithParams(userId, 'operation', name, {
		flowId: flowInstanceId
	});

	return key;
}
export async function createLegalDocument(type, owner, params) {
	let db = admin.database();
	let legalDocumet = {
		type: type,
		owner: owner,
		documentPath: type
	};
	if (Object.keys(params).length > 0) {
		legalDocumet = { ...legalDocumet, ...params };
	}
	let key = await db.ref('server').child('legalDocuments').push(legalDocumet).getKey();
	return key;
}

export async function createOperationTask(type, params) {
	let db = admin.database();
	let task = {
		type: type,
		active: true,
		time: new Date().getTime()
	};
	if (Object.keys(params).length > 0) {
		task = { ...task, ...params };
	}
	let key = await db.ref('server').child(`operationHub/taskManager`).push(task).getKey();

	return key;
}
export async function getUserIdByRole(role, order, project) {
	switch (role) {
		case 'ADMIN':
			return await getAdminUser();
		case 'LAWYERSELLER':
			return order.lawyerSellerId;
		case 'LAWYERBUYER':
			return order.lawyerBuyerId;
		case 'SELLER':
			return order.sellerId;
		case 'CUSTOMER':
			return order.userId || order.buyerId;
		case 'TRUSTEE':
			return project.trustee ? (project.trustee.user ? project.trustee.user : project.trustee) : '';
	}
	return '';
}

export async function getPendingOrders() {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('projects').child('pendingOrders').once('value', function(snapshot) {
				let results = snapshot.val();
				if (!results) {
					resolve([]);
					return;
				}

				if (Object.keys(results).length > 0) {
					let orders = <any>Object.keys(results).map((projectAddress) => {
						return Object.keys(results[projectAddress]).map((orderId) => {
							let order = results[projectAddress][orderId];
							order.id = orderId;
							return order;
						});
					});

					resolve([].concat(...orders));
					return;
				}
				resolve([]);
			});
		} catch (error) {
			reject(error);
		}
	});
}

function updateStepStatusById(flowInstance, id, status) {
	let path = <any>findStepPath(flowInstance.operations, id, '');
	jp.value(flowInstance, `$.operations.${path}.status`, status);
	return flowInstance;
}

export function updateNewFlowSteps(flowInstance, currentSteps, status, flowId) {
	currentSteps.forEach((step) => {
		updateStepStatusById(flowInstance, step.operationId, step.status === 'new' ? status : step.status);
	});
	updateFlowInstance(flowInstance, flowId);
}

export async function updateFlowStep(flowInstance, stepId, status, flowId) {
	updateStepStatusById(flowInstance, stepId, status);
	await updateFlowInstance(flowInstance, flowId);
	return 'done';
}
function findStepPath(steps, id, path) {
	let stepKey = Object.keys(steps.current).filter((key) => {
		return steps.current[key].operationId === id;
	});
	if (stepKey.length > 0) {
		return path + 'current.' + stepKey[0];
	}

	if (!steps.next) {
		return '';
	}

	return findStepPath(steps.next, id, path + 'next.');
}
