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
const admin = require('firebase-admin');
const events = [
    { event: 'addInternalAccount', trigger: 'addInternalAccountTrigger' },
    { event: 'approveFundDeposit', trigger: 'triggerApproveFundDeposit' },
    { event: 'approvePendingOrder', trigger: 'triggerApprovePendingOrder' },
    { event: 'approveRoleRequest', trigger: 'approveRoleRequestTrigger' },
    { event: 'assignUserToProject', trigger: 'assignUserToProjectTrigger' },
    { event: 'cancelAllOrder', trigger: 'cancelAllOrderTrigger' },
    { event: 'checkPhoneValidation', trigger: 'checkPhoneValidationTrigger' },
    { event: 'initialDocumentSignedBuyer', trigger: 'triggerInitialDocumentSignedBuyer' },
    { event: 'internalMortgageCondition', trigger: 'internalMortgageConditionTriggerEvent' },
    { event: 'internalMortgageeRequest', trigger: 'internalMortgageeTriggerEvent' },
    { event: 'loadProject', trigger: 'loadProjectTrigger' },
    { event: 'processOrder', trigger: 'triggerProcessOrder' },
    { event: 'receivedPayment', trigger: 'triggerPaymentsCheck' },
    { event: 'reserveAndDeposit', trigger: 'triggerReserveAndDeposit' },
    { event: 'signPdf', trigger: 'signPdfTriggerEvent' },
    { event: 'smsPhoneValidation', trigger: 'smsPhoneValidationTrigger' },
    { event: 'syncCase', trigger: 'syncCaseTrigger' },
    { event: 'syncUserLedger', trigger: 'syncUserLedgerTrigger' },
    { event: 'withdrawProjectFund', trigger: 'withdrawProjectFundTrigger' },
];
function monitorEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        let activeEventRequestReport = yield Promise.all(events.map((event) => __awaiter(this, void 0, void 0, function* () { return yield getActiveRequestReport(event); })));
        let shouldSendMail = yield shouldSendReport(activeEventRequestReport);
        if (shouldSendMail) {
            yield sendEmail(activeEventRequestReport);
        }
    });
}
exports.monitorEvents = monitorEvents;
function shouldSendReport(report) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastMailValidation = yield lastSentMailValidation();
        if (!lastMailValidation) {
            return false;
        }
        let activeRequests = report.filter(event => event.activeRequests > 0);
        if (activeRequests.length > 0) {
            let checkEventDuration = yield Promise.all(activeRequests.map((event) => __awaiter(this, void 0, void 0, function* () { return yield checkDuration(event); })));
            console.log(`checkEventDuration ${JSON.stringify(checkEventDuration)}`);
            let longDuration = checkEventDuration.filter(event => event.longDuration);
            if (longDuration.length > 0) {
                return true;
            }
        }
        let activeRequestsMoreThenOne = report.filter(event => event.activeRequests > 1);
        if (activeRequestsMoreThenOne.length > 0) {
            return true;
        }
        return false;
    });
}
function lastSentMailValidation() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield getLastEmailSent();
        if (!result) {
            return true;
        }
        if (new Date().getTime() - 120000 < result.lastSendingTime) {
            return false;
        }
        return true;
    });
}
function getActiveRequestReport(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/operations/events/${event.event}/`).orderByChild('active').equalTo(true).on('value', function (snapshot) {
                let results = snapshot.val();
                if (results) {
                    resolve({ activeRequests: Object.keys(results).length, trigger: event.trigger, event: event.event });
                    return;
                }
                resolve({ activeRequests: 0, event: event.event });
            });
        });
    });
}
function checkDuration(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastTimeStamp = yield getTriggerTime(event.trigger);
        console.log(`lastTimeStamp ${lastTimeStamp}`);
        console.log(`lastTimeStamp ${new Date().getTime()}`);
        if (lastTimeStamp.time + 300000 < new Date().getTime()) {
            return { longDuration: true };
        }
        return { longDuration: false };
    });
}
function getTriggerTime(trigger) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/operations/events/${trigger}/`).on('value', function (snapshot) {
                let results = snapshot.val();
                if (results) {
                    resolve(results);
                    return;
                }
                resolve({ time: new Date().getTime() });
            });
        });
    });
}
function getLastEmailSent() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/monitor/email/`).on('value', function (snapshot) {
                let results = snapshot.val();
                resolve(results);
            });
        });
    });
}
function sendEmail(report) {
    return __awaiter(this, void 0, void 0, function* () {
        let mail = {
            active: true,
            params: {
                report: reportToString(report)
            },
            template: 'monitor.system',
            to: 'roi@brikoin.com'
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
        yield db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
    });
}
function reportToString(report) {
    let reportMessage = report.filter(event => event.activeRequests > 0).map(row => `  Event type: ${row.event}  Number of active Task:  ${row.activeRequests}  `);
    return JSON.stringify(reportMessage);
}
//# sourceMappingURL=MonitorSystemEvents.js.map