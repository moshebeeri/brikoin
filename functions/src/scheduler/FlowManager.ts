import { getProject } from '../operations/utils';
import {
	getFlowByType,
	createFlow,
	getFlowInstanceById,
	updatePendingOrder,
	getUserIdByRole,
	createLegalDocument,
	createOperationTask,
	populateValues,
	createOperation,
	updateNewFlowSteps
} from './FlowManagerUtils';
import { validateKycWorker } from './validateKycWorker';
import { validateTrusteeScheduler } from './trusteeScheduleValidation';
import { validatePhoneNumber } from './phoneNumberValidation';
const jp = require('jsonpath');
export async function runPendingOrderFlow(order) {
	if (!order.flowType || order.flowtype == 'NONE') {
		return;
	}
	if (!order.active) {
		return;
	}
	let flow = <any>await getFlow(order);
	console.log(`FLOWINSTANCE   ${JSON.stringify(flow)}`);
	await nextStep(flow);
}

async function getFlow(order) {
	let project = <any>await getProject(order.project);
	let flowInstance = <any>await getFlowInstance(order.flowType, order.flowId, order);
	if (!order.flowId) {
		updatePendingOrder(flowInstance, order.id, order.project);
		order.flowId = flowInstance.id;
	}
	return { order: order, flowInstance: flowInstance, project: project };
}

async function nextStep(flow) {
	if (!flow) {
		return;
	}
	if (!flow.flowInstance) {
		return;
	}
	let steps = <any>await getInitializeSteps(flow.flowInstance.operations, flow);
	if (steps.length > 0) {
		steps = steps.sort(function(a, b) {
			if (a.order && b.order) {
				return parseInt(a.order) - parseInt(b.order);
			}

			return parseInt(a.operationId) - parseInt(b.operationId);
		});
		updateNewFlowSteps(flow.flowInstance, steps, 'PROCESS', flow.order.flowId);
		await Promise.all(
			steps.map(async (step) => {
				if (step.status === 'PROCESS') {
					let userId = await getUserIdByRole(step.userRole, flow.order, flow.project);
					if (userId) {
						console.log(`operation user id = "${userId}"`);
						let operationKey = await createUserOperation(
							userId,
							step,
							flow.order,
							flow.project,
							flow.flowInstance
						);
						createFlowTasks(operationKey, step, flow.order, flow.project, flow.flowInstance);
					} else {
						updateNewFlowSteps(flow.flowInstance, [ step ], 'new', flow.order.flowId);
					}
				}
			})
		);
	}
}

async function getInitializeSteps(flowInstance, flow) {
	let steps = getCurrentSteps(flowInstance);

	steps = <any>await validateSteps(steps, flow);
	console.log(`CURRENT STEP ${JSON.stringify(steps)}`);
	let stepsInProcess = inProcess(steps);
	console.log(`stepsInProcess ${JSON.stringify(stepsInProcess)}`);
	if (stepsInProcess) {
		return [];
	}

	let stepsDone = currentStepDone(steps);
	console.log(`stepsDone ${JSON.stringify(stepsDone)}`);
	if (stepsDone) {
		console.log(`flowInstance.next ${JSON.stringify(flowInstance.next)}`);
		if (flowInstance.next) {
			console.log(`flowInstance.next getInitializeSteps`);
			return getInitializeSteps(flowInstance.next, flow);
		}
		return [];
	}

	return steps;
}

async function validateSteps(steps, flow) {
	return await Promise.all(steps.map((step) => validateStep(step, flow)));
}

async function validateStep(step, flow) {
	if (step.operationValidation && step.operationValidation.validationTask) {
		let worker = <any>getValidationTask(step.operationValidation.validationTask);
		if (worker) {
			let result = await worker(step, flow);
			if (result.done) {
				step.status = 'DONE';
			}
		}
	}
	return step;
}

function getValidationTask(task) {
	switch (task) {
		case 'signKycValidation':
			return validateKycWorker;
		case 'validateTrusteeScheduler':
			return validateTrusteeScheduler;
		case 'phoneNumberValidation':
			return validatePhoneNumber;

		default:
			return '';
	}
}
function getCurrentSteps(flowInstance) {
	return Object.keys(flowInstance.current).map((key) => flowInstance.current[key]);
}

function currentStepDone(currentSteps) {
	if (currentSteps.length === 0) {
		return true;
	}
	let operationsDone = currentSteps.filter((step) => step.status === 'DONE');
	if (operationsDone.length === currentSteps.length) {
		return true;
	}
	return false;
}

function inProcess(currentSteps) {
	if (currentSteps.length === 0) {
		return false;
	}
	let steps = currentSteps.filter((step) => step.status === 'PROCESS');
	if (steps.length > 0) {
		return true;
	}
	return false;
}

async function createUserOperation(user, flowOperation, order, project, flowInstance) {
	switch (flowOperation.type) {
		case 'signDocument':
			return await createSignDocument(user, flowOperation, order, project, flowInstance);
		default:
			let params = await populateValues(
				{ flowInstance: flowInstance, operation: flowOperation, order: order, project: project },
				flowOperation.params
			);
			return await createOperation(flowOperation.name, flowOperation.type, params, user, flowInstance.id);
	}
}

async function createSignDocument(user, flowOperation, order, project, flowInstance) {
	let params = await populateValues(
		{ flowInstance: flowInstance, operation: flowOperation, order: order, project: project },
		flowOperation.params
	);
	let doucmentKey = await createLegalDocument(flowOperation.type, user, params);
	params['document'] = doucmentKey;
	return await createOperation(flowOperation.name, flowOperation.type, params, user, flowInstance.id);
}

async function createFlowTasks(operationKey, flowOperation, order, project, flowInstance) {
	if (!flowOperation.task) {
		return;
	}

	console.log(`operationKey ${operationKey}`);
	flowOperation['operationKey'] = operationKey;
	let taskParams = await populateValues(
		{ flowInstance: flowInstance, operation: flowOperation, order: order, project: project },
		flowOperation.task.params
	);
	await createOperationTask(flowOperation.task.type, taskParams);
}

async function getFlowInstance(flowType, flowId, order) {
	if (flowId) {
		let flowInstance = await getFlowInstanceById(flowId);
		return flowInstance;
	}

	let newFlowInstance = await createFlowInstance(flowType, order);
	return newFlowInstance;
}

async function createFlowInstance(flowType, order) {
	let flow = <any>await getFlowByType(flowType);
	let flowId = <any>await createFlow(flow);
	flow.id = flowId;
	flow.orderId = order.id;
	flow.project = order.project;
	flow.buyerId = order.userId;
	flow.sellerId = order.sellerId || '';
	flow.lawyerBuyerId = order.lawyerBuyerId || '';
	flow.lawyerSellerId = order.lawyerSellerId || '';
	return flow;
}
