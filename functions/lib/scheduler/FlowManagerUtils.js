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
const jp = require('jsonpath');
const admin = require('firebase-admin');
const utils_1 = require("../operations/utils");
const storageUtils_1 = require("./storageUtils");
function getFlowByType(flowType) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('Flows').child(flowType).once('value', function (snapshot) {
                    let results = snapshot.val();
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getFlowByType = getFlowByType;
function updatePendingOrder(flowInstance, orderId, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child('projects').child('pendingOrders').child(projectAddress).child(orderId).update({
            flowId: flowInstance.id
        });
    });
}
exports.updatePendingOrder = updatePendingOrder;
function getFlowInstanceById(flowId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('FlowInstance').child(flowId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getFlowInstanceById = getFlowInstanceById;
function getUserWizardSteps(pendingOrder, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let flowInstance = yield getFlowInstanceById(pendingOrder.flowId);
        if (flowInstance && flowInstance.operations) {
            let flowSteps = yield getUserFlowSteps(pendingOrder, flowInstance.operations, userId);
            return flowSteps;
        }
        return [];
    });
}
exports.getUserWizardSteps = getUserWizardSteps;
function getUserWizardStepsByInstance(flowInstance, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (flowInstance && flowInstance.operations) {
            let flowSteps = yield getUserFlowSteps(flowInstance, flowInstance.operations, userId);
            console.log(` userId ${JSON.stringify(userId)} instance steps ${JSON.stringify(flowSteps)}`);
            return flowSteps;
        }
        return [];
    });
}
exports.getUserWizardStepsByInstance = getUserWizardStepsByInstance;
function getUserFlowSteps(pendingOrder, flowOperations, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let steps = [];
        let currentSteps = [];
        let nextSteps = flowOperations;
        while (nextSteps) {
            currentSteps = nextSteps.current;
            let userSteps = yield getUserSteps(currentSteps, pendingOrder, userId);
            steps = steps.concat(userSteps);
            nextSteps = nextSteps.next;
        }
        return steps;
    });
}
function getUserSteps(steps, pendingOrder, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentSteps = Object.keys(steps).map((key) => steps[key]);
        const result = yield filter(currentSteps, (step) => __awaiter(this, void 0, void 0, function* () {
            let filter = yield isUserOperation(userId, step, pendingOrder);
            return filter;
        }));
        return result;
    });
}
function filter(arr, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const fail = Symbol();
        return (yield Promise.all(arr.map((item) => __awaiter(this, void 0, void 0, function* () { return ((yield callback(item)) ? item : fail); })))).filter((i) => i !== fail);
    });
}
function isUserOperation(userId, step, pendingOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        let operaitonUserId = yield getUserIdByRole(step.userRole, pendingOrder, '');
        if (userId === operaitonUserId) {
            return true;
        }
        return false;
    });
}
function populateValues(step, params) {
    return __awaiter(this, void 0, void 0, function* () {
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
            parmeterJson = Object.assign({}, parmeterJson, param);
        });
        let banks = yield getBankAccounts();
        yield asyncForEach(Object.keys(parmeterJson), (key) => __awaiter(this, void 0, void 0, function* () {
            if (parmsToType[key] === 'json') {
                return;
            }
            if (parmsToType[key] === 'filesCopy') {
                let newFile = yield storageUtils_1.makeCopy(parmeterJson[key]);
                parmeterJson[key] = newFile;
                return;
            }
            if (parmsToType[key] === 'files') {
                return;
            }
            if (parmsToType[key] === 'userRole') {
                parmeterJson[key] = yield getUserIdByRole(parmeterJson[key], step.order, step.order.project);
                return;
            }
            if (parmsToType[key] === 'operationHtmlDocument') {
                let path = findStepPath(step.flowInstance.operations, parmeterJson[key], '');
                console.log(` path ${JSON.stringify(path)}`);
                let operation = jp.query(step.flowInstance.operations, `$.${path}`);
                console.log(` operation ${JSON.stringify(operation)}`);
                let operationHub = yield getOperationHubByOperation(operation[0], step.order);
                console.log(` operationHub ${JSON.stringify(operationHub)}`);
                let document = yield utils_1.getDocument(operationHub);
                console.log(` document ${JSON.stringify(document)}`);
                let documentName = document.fileName.substring(0, document.fileName.lastIndexOf('.'));
                parmeterJson[key] = `${document.documentPath}/${documentName}.html`;
                return;
            }
            if (parmsToType[key] === 'bankAccount') {
                parmeterJson[key] = banks[parmeterJson[key]];
                return;
            }
            let value = jp.query(step, `$.${parmeterJson[key]}`);
            if (value && value.length > 0) {
                parmeterJson[key] = value[0];
            }
        }));
        return parmeterJson;
    });
}
exports.populateValues = populateValues;
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
function getBankAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('bankAccounts').once('value', function (snapshot) {
                    let results = snapshot.val();
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getOperationHubByOperation(operation, order) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = yield getUserIdByRole(operation.userRole, order, order.project);
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
                    .once('value', function (snapshot) {
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
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function updateFlowInstance(flowInstance, flowId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('FlowInstance').child(flowId).set(flowInstance);
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.updateFlowInstance = updateFlowInstance;
function createFlow(flow) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let key = yield db.ref('server').child('FlowInstance').push(flow).getKey();
        return key;
    });
}
exports.createFlow = createFlow;
function createOperation(name, type, params, userId, flowInstanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let operation = {
            type: type,
            status: 'waiting',
            name: name,
            time: new Date().getTime()
        };
        if (Object.keys(params).length > 0) {
            operation = Object.assign({}, operation, params);
        }
        let key = yield db.ref('server').child(`operationHub/${userId}`).child('operations').push(operation).getKey();
        yield utils_1.addNotificationWithParams(userId, 'operation', name, {
            flowId: flowInstanceId
        });
        return key;
    });
}
exports.createOperation = createOperation;
function createLegalDocument(type, owner, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let legalDocumet = {
            type: type,
            owner: owner,
            documentPath: type
        };
        if (Object.keys(params).length > 0) {
            legalDocumet = Object.assign({}, legalDocumet, params);
        }
        let key = yield db.ref('server').child('legalDocuments').push(legalDocumet).getKey();
        return key;
    });
}
exports.createLegalDocument = createLegalDocument;
function createOperationTask(type, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let task = {
            type: type,
            active: true,
            time: new Date().getTime()
        };
        if (Object.keys(params).length > 0) {
            task = Object.assign({}, task, params);
        }
        let key = yield db.ref('server').child(`operationHub/taskManager`).push(task).getKey();
        return key;
    });
}
exports.createOperationTask = createOperationTask;
function getUserIdByRole(role, order, project) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (role) {
            case 'ADMIN':
                return yield utils_1.getAdminUser();
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
    });
}
exports.getUserIdByRole = getUserIdByRole;
function getPendingOrders() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('projects').child('pendingOrders').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (!results) {
                        resolve([]);
                        return;
                    }
                    if (Object.keys(results).length > 0) {
                        let orders = Object.keys(results).map((projectAddress) => {
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
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getPendingOrders = getPendingOrders;
function updateStepStatusById(flowInstance, id, status) {
    let path = findStepPath(flowInstance.operations, id, '');
    jp.value(flowInstance, `$.operations.${path}.status`, status);
    return flowInstance;
}
function updateNewFlowSteps(flowInstance, currentSteps, status, flowId) {
    currentSteps.forEach((step) => {
        updateStepStatusById(flowInstance, step.operationId, step.status === 'new' ? status : step.status);
    });
    updateFlowInstance(flowInstance, flowId);
}
exports.updateNewFlowSteps = updateNewFlowSteps;
function updateFlowStep(flowInstance, stepId, status, flowId) {
    return __awaiter(this, void 0, void 0, function* () {
        updateStepStatusById(flowInstance, stepId, status);
        yield updateFlowInstance(flowInstance, flowId);
        return 'done';
    });
}
exports.updateFlowStep = updateFlowStep;
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
//# sourceMappingURL=FlowManagerUtils.js.map