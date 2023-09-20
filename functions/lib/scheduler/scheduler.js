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
const TrusteeAgreementTask_1 = require("./TrusteeAgreementTask");
const MonitorSystemEvents_1 = require("./MonitorSystemEvents");
const TrusteeNorificationTask_1 = require("./TrusteeNorificationTask");
const TransferFundTask_1 = require("./TransferFundTask");
const MrtgageeKycTask_1 = require("./MrtgageeKycTask");
const MortgageReqeustTask_1 = require("./MortgageReqeustTask");
const VideoCreateTask_1 = require("./VideoCreateTask");
const RemainderTask_1 = require("./RemainderTask");
const GroupInvestTriggerTask_1 = require("./GroupInvestTriggerTask");
const GroupProjectDoneTask_1 = require("./GroupProjectDoneTask");
const sendFinalDocumentTask_1 = require("./sendFinalDocumentTask");
const projectDemoEnd_1 = require("./projectDemoEnd");
const projectSingleBuyerTask_1 = require("./projectSingleBuyerTask");
const projectMultiBuyersTask_1 = require("./projectMultiBuyersTask");
const FlowManager_1 = require("./FlowManager");
const FlowManagerUtils_1 = require("./FlowManagerUtils");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
exports.triggerScheduler = functions.pubsub.schedule('* * * * *').onRun((context) => __awaiter(this, void 0, void 0, function* () {
    yield runScheduler();
}));
const runtimeOpts = {
    timeoutSeconds: 450
};
exports.triggerSchedulerNow = functions
    .runWith(runtimeOpts)
    .database.ref(`server/taskScheduler/trigger`)
    .onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    yield runScheduler();
}));
function runScheduler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let isRunning = yield schedulerIsRunning();
            if (isRunning) {
                return;
            }
            console.log('running  flow manager');
            yield runFlowManager();
            let requests = yield getCurrentRequests();
            if (requests && requests.length > 0) {
                requests.map((request) => {
                    sendRequestEvent(request);
                    removeRequest(request);
                });
            }
            MonitorSystemEvents_1.monitorEvents();
            yield taskManager();
            yield stopRunning();
        }
        catch (e) {
            yield stopRunning();
            throw e;
        }
    });
}
function runFlowManager() {
    return __awaiter(this, void 0, void 0, function* () {
        let pendingOrders = yield FlowManagerUtils_1.getPendingOrders();
        if (pendingOrders.length > 0) {
            yield Promise.all(pendingOrders.map((order) => __awaiter(this, void 0, void 0, function* () {
                console.log(`run order ${JSON.stringify(order)}`);
                yield FlowManager_1.runPendingOrderFlow(order);
            })));
        }
    });
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
                .once('value', function (snapshot) {
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
        }
        catch (error) {
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
function taskManager() {
    return __awaiter(this, void 0, void 0, function* () {
        let activeTasks = yield getActiveTasks();
        yield Promise.all(activeTasks.map((task) => __awaiter(this, void 0, void 0, function* () { return yield runTask(task); })));
    });
}
function runTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let condition = getTaskCondition(task);
        let conditionMet = yield condition(task);
        if (conditionMet) {
            let taskRun = getTaskRun(task);
            yield taskRun(task);
            yield setTaskDone(task);
        }
    });
}
function setTaskDone(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server/operationHub/taskManager').child(task.key).update({
            active: false
        });
    });
}
function getTaskCondition(task) {
    switch (task.type) {
        case 'trusteeAgrement':
            return TrusteeAgreementTask_1.trusteeAgreementCondition;
        case 'sendFinalDocumentTask':
            return sendFinalDocumentTask_1.triggerSendFinalDocCondition;
        case 'triggerGroupInvestment':
            return GroupInvestTriggerTask_1.triggerGroupInvestmentCondition;
        case 'triggerGroupDone':
            return GroupProjectDoneTask_1.triggerGroupDoneRun;
        case 'videoConference':
            return VideoCreateTask_1.videoCreateCondition;
        case 'transferFund':
            return TransferFundTask_1.transferFundCondition;
        case 'reminderTask':
            return RemainderTask_1.reminderTasktCondition;
        case 'projectDemoEnd':
            return projectDemoEnd_1.triggerProjectDoneCondition;
        case 'projectSingleBuyer':
            return projectSingleBuyerTask_1.triggerProjectSingleBuyerCondition;
        case 'projectMultiBuyers':
            return projectMultiBuyersTask_1.triggerProjectMultiBuyerCondition;
        case 'mortgageRequest':
            return MortgageReqeustTask_1.mortgageRequestCondition;
        case 'mortgageCheckKyc':
            return MrtgageeKycTask_1.mortgageeKycCondition;
        case 'notificationTrustee':
            return TrusteeNorificationTask_1.trusteeNotificationCondition;
        default:
            return noCondition;
    }
}
function getTaskRun(task) {
    switch (task.type) {
        case 'videoConference':
            return VideoCreateTask_1.videoCreateRun;
        case 'sendFinalDocumentTask':
            return sendFinalDocumentTask_1.triggerSendFinalDocRun;
        case 'trusteeAgrement':
            return TrusteeAgreementTask_1.trusteeAgreementRun;
        case 'projectDemoEnd':
            return projectDemoEnd_1.triggerProjectDoneRun;
        case 'projectSingleBuyer':
            return projectSingleBuyerTask_1.triggerProjectSingleBuyerRun;
        case 'projectMultiBuyers':
            return projectMultiBuyersTask_1.triggerProjectMultiBuyerRun;
        case 'triggerGroupInvestment':
            return GroupInvestTriggerTask_1.triggerGroupInvestmentRun;
        case 'triggerGroupDone':
            return GroupProjectDoneTask_1.triggerGroupDoneCondition;
        case 'transferFund':
            return TransferFundTask_1.transferFundRun;
        case 'mortgageRequest':
            return MortgageReqeustTask_1.montageRequestRun;
        case 'reminderTask':
            return RemainderTask_1.reminderRun;
        case 'mortgageCheckKyc':
            return MrtgageeKycTask_1.mortgageeKycRun;
        case 'notificationTrustee':
            return TrusteeNorificationTask_1.trusteeNotificationRun;
        default:
            return noCondition;
    }
}
function getActiveTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db
                .ref(`server/operationHub/taskManager`)
                .orderByChild('active')
                .equalTo(true)
                .once('value', function (snapshot) {
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
    });
}
function schedulerIsRunning() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/taskScheduler/`).child('running').transaction(function (taken) {
                if (taken) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
                return true;
            });
        });
    });
}
function stopRunning() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/taskScheduler/`).update({ running: false });
    });
}
function noCondition(task) {
    return true;
}
//# sourceMappingURL=scheduler.js.map