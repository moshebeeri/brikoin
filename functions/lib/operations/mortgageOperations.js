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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const MIL = 1000000;
const utils_1 = require("./utils");
const calculator_1 = require("./calculator");
const wallet_1 = require("./wallet");
exports.internalMortgage = functions.database.ref(`server/operations/events/internalMortgageeTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('START Mortgagee');
    let mortgageeRequest = yield getInternalRequest('internalMortgageeRequest');
    if (mortgageeRequest) {
        try {
            console.log('update request');
            db.ref('server').child('operations').child('events').child('internalMortgageeRequest').child(mortgageeRequest.key).update({ active: false });
            let userAccount = yield utils_1.getUserActiveAccount(mortgageeRequest.user);
            console.log('user account ');
            let mortgagee = yield wallet_1.setMortgageeAmount(userAccount.accountId, mortgageeRequest);
            console.log('mortgaege was set');
            yield utils_1.updateUserBalance(mortgageeRequest.user, userAccount.accountId, userAccount.id, '', '');
            yield utils_1.updateMortgageeBalance(mortgageeRequest.user, userAccount.accountId, mortgagee.mortgageeAddress);
        }
        catch (error) {
            console.log('Failed creating mortgagee');
            console.log(error);
            db.ref('server').child('operations').child('events').child('internalMortgageeRequest').child(mortgageeRequest.key).update({ failed: true });
        }
    }
    console.log('########## Handling internalMortgagee end ############');
}));
exports.mortgagePayment = functions.database.ref(`server/operations/events/payMortgageSchedulePaymentTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('payMortgageSchedulePayment');
    if (request) {
        console.log(request);
        let response = yield wallet_1.payMortgageNextPayment(request.mortgageAddress, 1000000);
        console.log(response);
        if (response.success) {
            db.ref('server').child('/operations/events/payMortgageSchedulePayment').child(request.key).update({ active: false });
            yield updatePayment(request.mortgageConditionId, request.mortgageRequestKey, response.lastPayedIndex);
            let mortgageRequest = yield getMortgageRequestByKeys(request.mortgageConditionId, request.mortgageRequestKey);
            console.log(mortgageRequest);
            let mortgageeAccount = yield utils_1.getUserActiveAccount(request.userId);
            let userAccount = yield utils_1.getUserActiveAccount(mortgageRequest.user);
            console.log(userAccount);
            console.log(mortgageeAccount);
            yield utils_1.updateUserBalance(mortgageRequest.user, userAccount.accountId, userAccount.id, '', '');
            yield utils_1.updateUserBalance(request.userId, mortgageeAccount.accountId, mortgageeAccount.id, '', '');
            yield refinanceMortgage(request.mortgageAddress, mortgageRequest, request.mortgageConditionId, request.mortgageRequestKey);
            yield utils_1.updateUserClearances(userAccount, 0, request.mortgageAddress, 0, 0, true, mortgageRequest.project);
        }
    }
}));
exports.refinanceMortgage = functions.database.ref(`server/operations/events/refinanceMortgageTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('refinanceMortgage');
    console.log("START REFINANCE");
    console.log(JSON.stringify(request));
    db.ref('server').child('/operations/events/refinanceMortgageTrigger').child(request.key).update({ active: false });
    let mortgageRequest = yield getMortgageRequestByKeys(request.mortgageConditionId, request.mortgageRequestKey);
    console.log(JSON.stringify(mortgageRequest));
    yield refinanceMortgage(request.mortgageAddress, mortgageRequest, request.mortgageConditionId, request.mortgageRequestKey);
}));
function refinanceMortgage(mortgageAddress, mortgageRequest, mortgageConditionId, mortgageRequestKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let userAccount = yield utils_1.getUserActiveAccount(mortgageRequest.user);
        let shouldRefinance = yield wallet_1.mortgageShouldRefinance(mortgageAddress, userAccount.accountId);
        console.log("shouldRefinance: " + shouldRefinance);
        if (shouldRefinance) {
            let remainingBalance = yield wallet_1.mortgageRemainingBalance(mortgageAddress, userAccount.accountId);
            console.log("remainingBalance: " + remainingBalance);
            let nextPaymentIndex = yield wallet_1.getMortgageNextPaymentIndex(mortgageAddress, userAccount.accountId);
            let payments = Object.keys(mortgageRequest.scheduledPayments).map(key => mortgageRequest.scheduledPayments[key]);
            let numberOfMonth = payments.length;
            let remainingMonth = numberOfMonth - nextPaymentIndex;
            console.log("nextPaymentIndex: " + nextPaymentIndex);
            console.log("condition: " + mortgageRequest.mortgageType + " " + remainingMonth, parseFloat(remainingBalance) / MIL + " " + mortgageRequest.armInterestRate + " " + mortgageRequest.interestRateFixed);
            let condition = calculator_1.getCondition(mortgageRequest.mortgageType, remainingMonth, parseFloat(remainingBalance) / MIL, mortgageRequest.armInterestRate, mortgageRequest.interestRateFixed);
            let newPayments = calculator_1.calculateMortgagePayments(condition);
            let paymentSchedule = newPayments.paymentSchedule;
            paymentSchedule.forEach((payment, index) => __awaiter(this, void 0, void 0, function* () {
                payment.active = true;
                payment.mortgageAddress = mortgageRequest.mortgageAddress;
                payment.index = index + parseInt(nextPaymentIndex);
                payment.buyerMortgageRequestId = mortgageRequestKey;
                payment.buyerMortgageId = mortgageConditionId;
                payment.refinance = true;
                yield db.ref('server').child('/operations/events/singlePayment').push(payment);
            }));
            yield updateRefincanceLoan(parseFloat(remainingBalance) / MIL, mortgageConditionId, mortgageRequestKey);
            setTimeout(function () {
                db.ref('server').child('/operations/events/singlePaymentTrigger').set({ time: new Date().getTime() });
            }, 1000);
        }
        return shouldRefinance;
    });
}
function updateRefincanceLoan(newLoan, mortgageConditionId, mortgageRequestKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child('/mortgages').child(mortgageConditionId).child('mortgagesRequests').child(mortgageRequestKey).update({ refinancedLoan: newLoan });
    });
}
exports.mortgageWritePayments = functions.database.ref(`server/operations/events/mortgagesPaymentTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('START paymennt');
    let mortgagePayment = yield getInternalRequest('mortgagesPayment');
    if (mortgagePayment) {
        db.ref('server/operations/events/mortgagesPayment').child(mortgagePayment.key).update({ active: false });
        let mortgageRequest = yield getMortgageRequest(mortgagePayment);
        let condition = calculator_1.getCondition(mortgageRequest.mortgageType, mortgageRequest.years * 12, mortgageRequest.amount, mortgageRequest.armInterestRate, mortgageRequest.interestRateFixed);
        let payments = calculator_1.calculateMortgagePayments(condition);
        let paymentSchedule = payments.paymentSchedule;
        paymentSchedule.forEach((payment, index) => __awaiter(this, void 0, void 0, function* () {
            payment.active = true;
            payment.mortgageAddress = mortgageRequest.mortgageAddress;
            payment.index = index;
            payment.buyerMortgageRequestId = mortgagePayment.buyerMortgageRequestId;
            payment.buyerMortgageId = mortgagePayment.buyerMortgageId;
            yield db.ref('server').child('/operations/events/singlePayment').push(payment);
        }));
        setTimeout(function () {
            db.ref('server').child('/operations/events/singlePaymentTrigger').set({ time: new Date().getTime() });
        }, 1000);
    }
}));
exports.writeSinglePayment = functions.database.ref(`server/operations/events/singlePaymentTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let payment = yield getInternalRequest('singlePayment');
    console.log('START SINGLE PAYMET');
    console.log(payment);
    if (payment) {
        let year = new Date().getFullYear() + payment.loanYear - 1;
        let dateYear = new Date(year, payment.loanMonth, 1, 0, 0, 0, 0).getTime();
        payment.paymentDate = dateYear;
        let response = yield wallet_1.setMortgagePayment(payment.mortgageAddress, payment.index, payment);
        console.log("response: " + response);
        if (response) {
            if (payment.refinance) {
                console.log('index: ' + payment.index);
                let paymentId = yield getPaymentIdByIndex(payment.buyerMortgageId, payment.buyerMortgageRequestId, payment.index);
                console.log('paymentId: ' + paymentId);
                db.ref('server').child('/mortgages/').child(payment.buyerMortgageId).child('mortgagesRequests').child(payment.buyerMortgageRequestId).child('scheduledPayments').child(paymentId).update(payment);
            }
            else {
                db.ref('server').child('/mortgages/').child(payment.buyerMortgageId).child('mortgagesRequests').child(payment.buyerMortgageRequestId).child('scheduledPayments').push(payment);
            }
            db.ref('server').child('/operations/events/singlePayment').child(payment.key).update({ active: false });
            db.ref('server').child('/operations/events/singlePaymentTrigger').set({ time: new Date().getTime() });
        }
    }
}));
exports.clearMortgage = functions.database.ref(`server/operations/events/clearMortgageTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('clearMortgage');
    // TODO do payment
    db.ref('server').child('/operations/events/clearMortgage').child(request.key).update({ active: false });
    db.ref('server').child('/mortgagesPayment').child(request.mortgageId).update({ payed: true });
}));
exports.addMortgageCondition = functions.database.ref(`server/operations/events/internalMortgageConditionTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('internalMortgageCondition');
    let userAccount = yield utils_1.getUserActiveAccount(request.user);
    let response = yield wallet_1.addMortgageCondition(request, userAccount);
    console.log(response);
    request.mortgageConditionAddress = response.conditionAddress;
    request.avalibaleFounds = response.mortgageeAveFunds;
    db.ref('server').child('/operations/events/internalMortgageCondition').child(request.key).update({ active: false });
    //Todo handle update request
    db.ref('server/').child('mortgages').push(request);
}));
exports.mortgageReqeust = functions.database.ref(`server/operations/events/internalMortgageTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('internalMortgageRequest');
    let userAccount = yield utils_1.getUserActiveAccount(request.user);
    request.approved = false;
    let response = yield wallet_1.addMortgageRequest(request, userAccount);
    request.mortgageRequestAddress = response;
    let mortgageCondition = yield getMortgageConndition(request.mortgageId);
    let mortgageRequest = yield db.ref('server').child('/mortgages').child(request.mortgageId).child('mortgagesRequests').push(request);
    let mortgageRequestKey = mortgageRequest.key;
    console.log(`mortgageRequestKey: ${mortgageRequestKey}`);
    yield createMortgageRequestTask(request, mortgageCondition, mortgageRequestKey);
    console.log('Sync user Data');
    syncUserMortgageData(request.user, mortgageCondition.user);
    db.ref('server').child('/operations/events/internalMortgageRequest').child(request.key).update({ active: false });
}));
exports.handleMortgageRequest = functions.database.ref(`server/operations/events/internalMortgageOprTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequest('internalMortgageRequestOpr');
    let userAccount = yield utils_1.getUserActiveAccount(request.user);
    db.ref('server').child('/operations/events/internalMortgageRequestOpr').child(request.key).update({ active: false });
    if (request.approve) {
        console.log('new mortgage approvment');
        let response = yield wallet_1.approveMortgageRequest(request, userAccount.accountId, userAccount.privateKey);
        if (response.success) {
            db.ref('server').child('mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.mortgageRequestId).update({
                approved: true,
                mortgageAddress: response.mortgageAddress
            });
            let mortgageRequest = yield getMortgageRequestByKeys(request.mortgageId, request.mortgageRequestId);
            syncUserMortgageData(request.user, mortgageRequest.user);
            yield utils_1.addProjectNotification(mortgageRequest.user, 'mortgage', 'mortgageApproved', request.projectId);
        }
    }
    else {
        db.ref('server').child('mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.mortgageRequestId).remove();
        yield utils_1.addProjectNotification(request.user, 'mortgage', 'mortgageRejected', request.projectId);
    }
}));
exports.cancelMortgageReqeust = functions.database.ref(`server/operations/events/cancelMortgageRequestTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield getInternalRequestWithId('cancelMortgageRequest');
    console.log('request: ' + JSON.stringify(request));
    db.ref('server').child('/operations/events/cancelMortgageRequest').child(request.id).update({ active: false });
    db.ref('server').child('/mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.key).remove();
}));
function createMortgageRequestTask(request, mortgageCondition, requestKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let newTask = {
            active: true,
            mortgagee: mortgageCondition.user,
            project: mortgageCondition.project,
            userId: request.user,
            mortgageConditionAddress: request.mortgageConditionAddress,
            mortgageRequestAddress: request.mortgageRequestAddress,
            mortgageId: request.mortgageId,
            mortgageRequestId: requestKey,
            type: 'mortgageRequest'
        };
        console.log(JSON.stringify(newTask));
        yield db.ref(`server/operationHub/taskManager`).push(newTask);
    });
}
function getPaymentIdByIndex(mortgageId, requestId, paymentIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/mortgages/').child(mortgageId).child('mortgagesRequests').child(requestId).child('scheduledPayments').orderByChild('index').equalTo(parseInt(paymentIndex)).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log('getPaymentIdByIndex ' + JSON.stringify(results));
                    if (results) {
                        let mortgageeRequests = Object.keys(results).map(key => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(mortgageeRequests[0].key);
                    }
                    resolve('');
                });
            }
            catch (error) {
                console.log('failed ' + JSON.stringify(error));
                reject(error);
            }
        });
    });
}
function updatePayment(mortgageId, requestId, paymentIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log('UPDATE PAYMENT');
        console.log('mortgageId ' + mortgageId + 'requestId ' + requestId + 'paymentIndex ' + paymentIndex);
        let paymentRequest = yield getPaymentIdByIndex(mortgageId, requestId, paymentIndex);
        console.log('paymentRequest ' + JSON.stringify(paymentRequest));
        db.ref('server').child('/mortgages').child(mortgageId).child('mortgagesRequests').child(requestId)
            .child('scheduledPayments').child(paymentRequest).update({ payed: true, active: false });
    });
}
function getInternalRequest(requestPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/').child(requestPath).orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let mortgageeRequests = Object.keys(results).map(key => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(mortgageeRequests[0]);
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
function getInternalRequestWithId(requestPath) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/').child(requestPath).orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let mortgageeRequests = Object.keys(results).map(key => {
                            let request = results[key];
                            request.id = key;
                            return request;
                        });
                        resolve(mortgageeRequests[0]);
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
function getMortgageRequest(mortgagePayment) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                console.log('Handle Mortgage request getter');
                db.ref('server').child('/mortgages/').child(mortgagePayment.buyerMortgageId).child('mortgagesRequests').child(mortgagePayment.buyerMortgageRequestId).once('value', function (snapshot) {
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
function getMortgageConndition(conditionId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                console.log('Handle Mortgage request getter');
                db.ref('server').child('/mortgages/').child(conditionId).once('value', function (snapshot) {
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
function getMortgageRequestByKeys(conditionId, requestKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                console.log('Handle Mortgage request getter');
                db.ref('server').child('/mortgages/').child(conditionId).child('mortgagesRequests').child(requestKey).once('value', function (snapshot) {
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
function syncUserMortgageData(mortgageeUser, mortgageeRequestUser) {
    let db = admin.database();
    // sync mortgage change
    console.log('update user ' + mortgageeUser + ' update mortgage user' + mortgageeRequestUser);
    db.ref('server').child('users').child(mortgageeRequestUser).child('mortgage').set({
        time: new Date().getTime(),
    });
    db.ref('server').child('users').child(mortgageeUser).child('mortgage').set({
        time: new Date().getTime(),
    });
}
function getActivePaymentReqeusts() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('/operations/events/payMortgageSchedulePayment').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let payments = Object.keys(results).map(key => {
                            let payment = results[key];
                            payment.key = key;
                            return payment[0];
                        });
                        resolve(payments);
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
//# sourceMappingURL=mortgageOperations.js.map