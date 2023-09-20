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
exports.syncUserLedger = functions.database.ref(`server/operations/events/syncUserLedgerTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('syncUserLedger');
    if (request && request.userId) {
        console.log('Start sync ledger user: ' + request.userId);
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let currentTransactions = yield getUserLedgers(request.userId);
        console.log("User Account " + JSON.stringify(userAccount));
        let transactions = yield wallet_1.getUserTransactions(userAccount.accountId, currentTransactions && currentTransactions.filter(transaction => transaction.projectAddress !== 0).length);
        for (let i = 0; i < transactions.length; i++) {
            yield db.ref('server').child('users').child(request.userId).child('ledger').push(transactions[i]);
        }
        let userTotalBalance = yield wallet_1.getUserBalance(userAccount.accountId);
        let currentLedgerBalance = calculateLedgerBalance(currentTransactions, transactions);
        if (userTotalBalance - currentLedgerBalance > 0) {
            console.log(`Total user balance - current ledger balance: ${userTotalBalance - currentLedgerBalance}`);
            let newTransaction = {
                time: new Date().getTime(),
                amount: userTotalBalance - currentLedgerBalance,
                projectAddress: 0,
                isAdd: true,
                description: 'DEPOSIT'
            };
            yield db.ref('server').child('users').child(request.userId).child('ledger').push(newTransaction);
        }
        if (userTotalBalance - currentLedgerBalance < 0) {
            console.log(`Total user balance - current ledger balance: ${userTotalBalance - currentLedgerBalance}`);
            let newTransaction = {
                time: new Date().getTime(),
                amount: currentLedgerBalance - userTotalBalance,
                projectAddress: 0,
                isAdd: false,
                description: 'WITHDRAW_OR_MOVED'
            };
            yield db.ref('server').child('users').child(request.userId).child('ledger').push(newTransaction);
        }
        db.ref('server').child('/operations/events/syncUserLedger').child(request.key).update({ active: false });
        db.ref('server').child('/operations/events/syncUserLedgerTrigger').update({ time: new Date().getTime() });
    }
}));
function calculateLedgerBalance(currentTransactions, newTransactions) {
    let totalAmount = 0;
    if (currentTransactions) {
        totalAmount = totalAmount + currentTransactions.reduce(function (sum, transaction) {
            console.log(`sum: ${JSON.stringify(sum)} transaction: ${JSON.stringify(transaction)}`);
            if (transaction.isAdd) {
                return sum + parseInt(transaction.amount);
            }
            return sum - parseInt(transaction.amount);
        }, 0);
        console.log(`current Total ledger transactions: ${totalAmount}`);
    }
    if (newTransactions) {
        totalAmount = totalAmount + newTransactions.reduce(function (sum, transaction) {
            if (transaction.isAdd) {
                return sum + parseInt(transaction.amount);
            }
            return sum - parseInt(transaction.amount);
        }, 0);
        console.log(`current Total ledger transactions with new transactions: ${totalAmount}`);
    }
    console.log(`Total ledger transactions: ${totalAmount}`);
    return totalAmount;
}
function getUserLedgers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('users').child(userId).child('ledger').once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let result = Object.keys(results).map(key => {
                            let payment = results[key];
                            payment.key = key;
                            return payment;
                        });
                        resolve(result);
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
//# sourceMappingURL=userLedger.js.map