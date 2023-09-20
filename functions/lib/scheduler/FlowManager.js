"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../operations/utils");
const FlowManagerUtils_1 = require("./FlowManagerUtils");
const validateKycWorker_1 = require("./validateKycWorker");
const trusteeScheduleValidation_1 = require("./trusteeScheduleValidation");
const phoneNumberValidation_1 = require("./phoneNumberValidation");
const jp = require('jsonpath');
function runPendingOrderFlow(order) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!order.flowType || order.flowtype == 'NONE') {
            return;
        }
        if (!order.active) {
            return;
        }
        let flow = yield getFlow(order);
        console.log(`FLOWINSTANCE   ${JSON.stringify(flow)}`);
        yield nextStep(flow);
    });
}
exports.runPendingOrderFlow = runPendingOrderFlow;
function getFlow(order) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield utils_1.getProject(order.project);
        let flowInstance = yield getFlowInstance(order.flowType, order.flowId, order);
        if (!order.flowId) {
            FlowManagerUtils_1.updatePendingOrder(flowInstance, order.id, order.project);
            order.flowId = flowInstance.id;
        }
        return { order: order, flowInstance: flowInstance, project: project };
    });
}
function nextStep(flow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!flow) {
            return;
        }
        if (!flow.flowInstance) {
            return;
        }
        let steps = yield getInitializeSteps(flow.flowInstance.operations, flow);
        if (steps.length > 0) {
            steps = steps.sort(function (a, b) {
                if (a.order && b.order) {
                    return parseInt(a.order) - parseInt(b.order);
                }
                return parseInt(a.operationId) - parseInt(b.operationId);
            });
            FlowManagerUtils_1.updateNewFlowSteps(flow.flowInstance, steps, 'PROCESS', flow.order.flowId);
            yield Promise.all(steps.map((step) => __awaiter(this, void 0, void 0, function* () {
                if (step.status === 'PROCESS') {
                    let userId = yield FlowManagerUtils_1.getUserIdByRole(step.userRole, flow.order, flow.project);
                    if (userId) {
                        console.log(`operation user id = "${userId}"`);
                        let operationKey = yield createUserOperation(userId, step, flow.order, flow.project, flow.flowInstance);
                        createFlowTasks(operationKey, step, flow.order, flow.project, flow.flowInstance);
                    }
                    else {
                        FlowManagerUtils_1.updateNewFlowSteps(flow.flowInstance, [step], 'new', flow.order.flowId);
                    }
                }
            })));
        }
    });
}
function getInitializeSteps(flowInstance, flow) {
    return __awaiter(this, void 0, void 0, function* () {
        let steps = getCurrentSteps(flowInstance);
        steps = (yield validateSteps(steps, flow));
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
    });
}
function validateSteps(steps, flow) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield Promise.all(steps.map((step) => validateStep(step, flow)));
    });
}
function validateStep(step, flow) {
    return __awaiter(this, void 0, void 0, function* () {
        if (step.operationValidation && step.operationValidation.validationTask) {
            let worker = getValidationTask(step.operationValidation.validationTask);
            if (worker) {
                let result = yield worker(step, flow);
                if (result.done) {
                    step.status = 'DONE';
                }
            }
        }
        return step;
    });
}
function getValidationTask(task) {
    switch (task) {
        case 'signKycValidation':
            return validateKycWorker_1.validateKycWorker;
        case 'validateTrusteeScheduler':
            return trusteeScheduleValidation_1.validateTrusteeScheduler;
        case 'phoneNumberValidation':
            return phoneNumberValidation_1.validatePhoneNumber;
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
function createUserOperation(user, flowOperation, order, project, flowInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (flowOperation.type) {
            case 'signDocument':
                return yield createSignDocument(user, flowOperation, order, project, flowInstance);
            default:
                let params = yield FlowManagerUtils_1.populateValues({ flowInstance: flowInstance, operation: flowOperation, order: order, project: project }, flowOperation.params);
                return yield FlowManagerUtils_1.createOperation(flowOperation.name, flowOperation.type, params, user, flowInstance.id);
        }
    });
}
function createSignDocument(user, flowOperation, order, project, flowInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        let params = yield FlowManagerUtils_1.populateValues({ flowInstance: flowInstance, operation: flowOperation, order: order, project: project }, flowOperation.params);
        let doucmentKey = yield FlowManagerUtils_1.createLegalDocument(flowOperation.type, user, params);
        params['document'] = doucmentKey;
        return yield FlowManagerUtils_1.createOperation(flowOperation.name, flowOperation.type, params, user, flowInstance.id);
    });
}
function createFlowTasks(operationKey, flowOperation, order, project, flowInstance) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!flowOperation.task) {
            return;
        }
        console.log(`operationKey ${operationKey}`);
        flowOperation['operationKey'] = operationKey;
        let taskParams = yield FlowManagerUtils_1.populateValues({ flowInstance: flowInstance, operation: flowOperation, order: order, project: project }, flowOperation.task.params);
        yield FlowManagerUtils_1.createOperationTask(flowOperation.task.type, taskParams);
    });
}
function getFlowInstance(flowType, flowId, order) {
    return __awaiter(this, void 0, void 0, function* () {
        if (flowId) {
            let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(flowId);
            return flowInstance;
        }
        let newFlowInstance = yield createFlowInstance(flowType, order);
        return newFlowInstance;
    });
}
function createFlowInstance(flowType, order) {
    return __awaiter(this, void 0, void 0, function* () {
        let flow = yield FlowManagerUtils_1.getFlowByType(flowType);
        let flowId = yield FlowManagerUtils_1.createFlow(flow);
        flow.id = flowId;
        flow.orderId = order.id;
        flow.project = order.project;
        flow.buyerId = order.userId;
        flow.sellerId = order.sellerId || '';
        flow.lawyerBuyerId = order.lawyerBuyerId || '';
        flow.lawyerSellerId = order.lawyerSellerId || '';
        return flow;
    });
}
//# sourceMappingURL=FlowManager.js.map