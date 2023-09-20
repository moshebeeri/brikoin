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
exports.assignBroker = functions.database
    .ref(`server/operations/events/triggerAssignBrokerCheck`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        let brokerRequest = yield utils_1.getActiveRequest('assignBroker');
        yield handleBrokerRequest(brokerRequest);
    }
    catch (error) {
        console.log('error');
    }
}));
exports.payBroker = functions.database
    .ref(`server/operations/events/triggerPayBrokerCheck`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    try {
        let brokerPaymentRequest = yield getBrokerPaymentRequest();
        yield handleBrokerPaymentRequest(brokerPaymentRequest);
    }
    catch (error) {
        console.log('error');
    }
}));
function generateBrokerLink(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let validation = validateBroker(userId);
        if (!validation) {
            return { status: 'failed' };
        }
        let configuration = yield utils_1.getConfiguration();
        let token = yield getBrokerToken(userId);
        if (token) {
            return { status: 'succsess', link: `${configuration.env}/broker/${token}` };
        }
        token = createBrokerToken(userId);
        return { status: 'succsess', link: `${configuration.env}/broker/${token}` };
    });
}
exports.generateBrokerLink = generateBrokerLink;
function assignUserToBrokerOperation(brokerToken, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let brokerId = yield getBrokerIdByToken(brokerToken);
        console.log(`brokerId ${JSON.stringify(brokerId)}`);
        if (brokerId) {
            let userAccount = yield utils_1.getUserActiveAccount(userId);
            let brokerAccount = yield utils_1.getUserActiveAccount(brokerId);
            wallet_1.assignUserToBroker(brokerAccount.accountId, userAccount.accountId);
            let db = admin.database();
            db.ref('server').child(`brokers/${brokerId}/`).push({ user: userId, status: 'active' });
        }
    });
}
exports.assignUserToBrokerOperation = assignUserToBrokerOperation;
function getBrokerIdByToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/brokers').orderByChild('token').equalTo(token).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let brokers = Object.keys(results).map((key) => {
                            let broker = results[key];
                            broker.userId = key;
                            return broker;
                        });
                        resolve(brokers[0].userId);
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
function updateUserPayment(userAccount, payment) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db
            .ref('server/users/')
            .child(userAccount.user_id)
            .child('accounts')
            .child(userAccount.id)
            .update({ payedFees: payment });
    });
}
function handleBrokerRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (request) {
            console.log('ASSIGN BROKER STARTING');
            let userAccount = yield utils_1.getUserActiveAccount(request.userId);
            let response = yield wallet_1.assignNewBroker(userAccount.accountId);
            console.log('Assign Broker Result: ' + JSON.stringify(response));
            db.ref('server').child('/operations/events/assignBroker').child(request.orderId).update({ active: false });
        }
    });
}
function handleBrokerPaymentRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (request) {
            console.log('PAY BROKER STARTING');
            let userAccount = yield utils_1.getUserActiveAccount(request.userId);
            let response = yield wallet_1.payBroker(userAccount.accountId, request.payment);
            console.log('Pay Broker Result: ' + JSON.stringify(response));
            if (response.success) {
                yield updateUserPayment(userAccount, response.payment);
            }
            db.ref('server').child('/operations/events/payBroker').child(request.orderId).update({ active: false });
        }
    });
}
function createBrokerToken(userId) {
    let token = `${new Date().getTime()}${userId}`;
    let db = admin.database();
    db.ref('server').child(`brokers/${userId}/token`).set(token);
    return token;
}
function getBrokerPaymentRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/payBroker')
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let payments = Object.keys(results).map((key) => {
                            let payment = results[key];
                            payment.orderId = key;
                            return payment;
                        });
                        resolve(payments[0]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function validateBroker(brokerId) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
function getBrokerToken(brokerId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child(`brokers/${brokerId}/token`).once('value', function (snapshot) {
                    let token = snapshot.val();
                    resolve(token);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
//# sourceMappingURL=brokerOperations.js.map