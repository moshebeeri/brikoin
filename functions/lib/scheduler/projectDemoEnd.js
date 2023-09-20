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
const admin = require('firebase-admin');
function triggerProjectDoneCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
exports.triggerProjectDoneCondition = triggerProjectDoneCondition;
function triggerProjectDoneRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let order = yield utils_1.getPendingOrder(task.userId, task.project);
        let project = yield utils_1.getProject(task.project);
        console.log(`order: ${JSON.stringify(order)}`);
        yield updateProjectHoldings(task.userId, task.project, order.amount);
        console.log(`ORDER AMOUNT : ${order.amount} project target: ${project.target}`);
        if (parseInt(order.amount) === parseInt(project.target)) {
            console.log('close ask order');
            closeAsk(task.project);
        }
        let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(task.flowInstance);
        console.log('UPDATE FLOW STEP');
        FlowManagerUtils_1.updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
        console.log('UPDATE LEDGER');
        yield addUserLeger(task.userId, order, task.project);
        console.log('NOTIFY USER ');
        yield updateBroker(task.userId, order, task.project);
        yield utils_1.addNotificationWithParams(task.userId, 'projectDone', 'confirmBuy', {
            project: task.project,
            flowId: task.flowInstance
        });
        yield updatePendingOrderDone(order, task.project);
    });
}
exports.triggerProjectDoneRun = triggerProjectDoneRun;
function updateBroker(userId, order, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let brokerId = yield getBrokerId(userId);
        if (brokerId) {
            let account = yield utils_1.getUserActiveAccount(brokerId);
            let db = admin.database();
            yield db.ref('server').child('users').child(brokerId).child('accounts').child(account.id).update({
                stonesBalance: 1
            });
            yield db.ref('server').child('users').child(brokerId).child('ledger').push({
                amount: parseInt(order.amount) * 1000000 * 0.02,
                description: 'DEPOSIT',
                isAddd: true,
                projectAddress: '0',
                time: new Date().getTime()
            });
        }
    });
}
function getBrokerId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('brokers').once('value', function (snapshot) {
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
                    }
                    else {
                        resolve('');
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function addUserLeger(userId, order, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server').child('users').child(userId).child('ledger').push({
            amount: parseInt(order.amount) * 1000000,
            description: 'INTERNAL_BID',
            isAddd: false,
            projectAddress: project,
            time: new Date().getTime()
        });
    });
}
function updatePendingOrderDone(order, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db
            .ref('server')
            .child('projects')
            .child('pendingOrders')
            .child(project)
            .child(order.key)
            .update({ active: false });
    });
}
function updateProjectHoldings(userId, projectAddress, userHoldings) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccountAddress = yield utils_1.getUserActiveAccount(userId);
        let db = admin.database();
        console.log('USER Holdings ' + userId + '  holdings: ' + userHoldings);
        yield db
            .ref('server')
            .child('users')
            .child(userId)
            .child('myHoldings')
            .child(projectAddress)
            .set({ holdings: userHoldings });
        yield db
            .ref('server')
            .child('projects')
            .child('holders')
            .child(projectAddress)
            .orderByChild('holder')
            .equalTo(userId)
            .once('value', function (snapshot) {
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
            }
            else {
                db.ref('server').child('projects').child('holders').child(projectAddress).push({
                    holder: userId,
                    holderAccount: userAccountAddress,
                    holdings: userHoldings
                });
            }
        });
    });
}
function closeAsk(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CHNAGE ASK');
        let db = admin.database();
        let askKey = yield utils_1.getProjectInitialAskId(projectAddress);
        console.log(`askKey: ${askKey}`);
        if (askKey) {
            db.ref('server/projects/orders').child(projectAddress).child('ask').child(askKey).update({ active: false });
        }
    });
}
function sendEmail(project, email, order) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
        yield db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
    });
}
//# sourceMappingURL=projectDemoEnd.js.map