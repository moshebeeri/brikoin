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
const wallet_1 = require("../operations/wallet");
const FlowManagerUtils_1 = require("./FlowManagerUtils");
const admin = require('firebase-admin');
function triggerProjectSingleBuyerCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
exports.triggerProjectSingleBuyerCondition = triggerProjectSingleBuyerCondition;
function triggerProjectSingleBuyerRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let order = yield utils_1.getPendingOrder(task.userId, task.project);
        let project = yield utils_1.getProject(task.project);
        let userAccount = yield utils_1.getUserActiveAccount(task.userId);
        console.log('DEPOSIT ALL FUND');
        yield depositFunds(userAccount, order, task);
        if (parseInt(order.amount) < parseInt(project.target)) {
            console.log(`update project stone coins number ${parseInt(project.target) - parseInt(order.amount)}`);
            yield wallet_1.updateProjectTarget(task.project, false, parseInt(project.target) - parseInt(order.amount));
        }
        console.log('BID');
        let response = yield wallet_1.projectBidRequest(userAccount.accountId, order.project, order.amount, 1, 0);
        console.log(`BID: ${JSON.stringify(response)}`);
        if (response.success) {
            let adminAccount = yield utils_1.getAdminAccount('project');
            console.log('TRADE');
            response = yield wallet_1.projectTradeRequest(userAccount.accountId, adminAccount.accountId, order.amount, order.price, adminAccount.accountId, adminAccount.privateKey, order.project);
            console.log(`TRADE: ${JSON.stringify(response)}`);
            if (response.success) {
                let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(task.flowInstance);
                console.log(`updateFlowStep`);
                FlowManagerUtils_1.updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
                yield utils_1.addNotificationWithParams(task.userId, 'projectDone', 'confirmBuy', { project: task.project });
                console.log(`updatePendingOrderDone`);
                yield updatePendingOrderDone(order, task.project);
                console.log(`updateProjectHoldings`);
                yield updateProjectHoldings(task.userId, task.project, order.amount);
                console.log(`closeAsk`);
                closeAsk(task.project);
                console.log(`syncUserLedger`);
                yield utils_1.syncUserLedger(task.userId);
                console.log(`updateBroker`);
                yield updateBroker(task.userId);
            }
        }
    });
}
exports.triggerProjectSingleBuyerRun = triggerProjectSingleBuyerRun;
function depositFunds(userAccount, order, task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield wallet_1.depositCoinsProject(userAccount.accountId, order.amount, task.project);
        db.ref('server').child('projects').child('pendingOrders').child(task.project).child(order.key).update({
            cancelOrder: false,
            fullDeposit: true
        });
    });
}
function updateBroker(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let brokerId = yield getBrokerId(userId);
        if (brokerId) {
            yield utils_1.syncUserLedger(brokerId);
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
//# sourceMappingURL=projectSingleBuyerTask.js.map