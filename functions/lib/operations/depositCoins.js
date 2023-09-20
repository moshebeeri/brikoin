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
const utils_1 = require("./utils");
const wallet_1 = require("./wallet");
exports.depositCoins = functions.database.ref(`server/operations/events/triggerPaymentsCheck`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let paymentRequest = yield getPaymentRequests();
    yield handlePaymentRequest(paymentRequest);
}));
exports.withdrawCoins = functions.database.ref(`server/operations/events/withdrawCoinTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('withdrawCoin');
    console.log('START withdraw coins');
    if (request) {
        console.log('START withdraw coins ' + JSON.stringify(request));
        db.ref('server').child('operations').child('events').child('withdrawCoin').child(request.key).update({ active: false });
        let activeAccount = yield utils_1.getUserActiveAccount(request.userId);
        yield wallet_1.withdrawCoins(activeAccount.accountId, request.amount, request.projectAddress);
        yield utils_1.syncUserLedger(request.userId);
    }
    console.log('END FEES');
}));
function handlePaymentRequest(payment) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let request = yield getPaymentRequest(payment.requestId, payment.userId);
        if (request) {
            request = Object.keys(request).map(key => request[key])[0];
            let userAccount = yield utils_1.getUserActiveAccount(payment.userId);
            // await transferEtherFromAdmin(adminAccountId.accountId, adminAccountId.privateKey,userAccount.accountId)
            yield wallet_1.depositCoins(userAccount.accountId, request.data.object.amount);
            db.ref('server').child('/operations/events/receivedPayment').child(payment.orderId).update({ active: false });
            yield utils_1.updateUserBalance(payment.userId, userAccount.accountId, userAccount.id, '', '');
            yield utils_1.syncUserLedger(payment.userId);
        }
    });
}
function getPaymentRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/receivedPayment').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let payments = Object.keys(results).map(key => {
                            let payment = results[key];
                            payment.orderId = key;
                            return payment;
                        });
                        resolve(payments[0]);
                    }
                    resolve("");
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getPaymentRequest(requestId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('users').child(userId).child('payments').orderByChild('id').equalTo(requestId).once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
//# sourceMappingURL=depositCoins.js.map