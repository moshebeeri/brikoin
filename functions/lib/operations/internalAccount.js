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
const wallet_1 = require("./wallet");
const brokerOperations_1 = require("./brokerOperations");
const utils_1 = require("./utils");
function updateBrokerCustomers(brokerAccount, account) {
    let db = admin.database();
    db
        .ref('server')
        .child('users')
        .child(brokerAccount.user_id)
        .child('accounts')
        .child(brokerAccount.id)
        .child('brokerCustomers')
        .push({ user_id: account.user_id, userAccount: account.accountId });
}
function updateBroker(brokerId, account) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('ASSIGN BROKER TO USER');
            let brokerAccount = yield utils_1.getUserActiveAccount(brokerId);
            let response = yield wallet_1.assignUserToBroker(brokerAccount.accountId, account.accountId);
            console.log('Assign results ' + JSON.stringify(response));
            if (response.success) {
                account.brokerAccount = updateBrokerCustomers(brokerAccount, account);
            }
            return account;
        }
        catch (error) {
            console.log('FAILED ASSIGN BROKER ' + brokerId + ' ##  ' + JSON.stringify(account) + '  ##  ' + JSON.stringify(error));
            return account;
        }
    });
}
exports.internalAccount = functions.database
    .ref(`server/operations/events/addInternalAccountTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    try {
        let accounts = yield getInternalAccounts();
        console.log('ACCOUNT ' + JSON.stringify(accounts));
        if (accounts) {
            accounts.forEach((accountEvent) => __awaiter(this, void 0, void 0, function* () {
                db
                    .ref('server')
                    .child('/operations/events/addInternalAccount')
                    .child(accountEvent.key)
                    .update({ active: false });
                console.log(JSON.stringify(accountEvent));
                let userId = accountEvent.userId;
                let account;
                if (accountEvent.type === 'EXTERNAL') {
                    console.log('CREATING EXTERNAL WALLET ' + userId);
                    account = {
                        name: accountEvent.name,
                        user_id: userId,
                        email: accountEvent.name,
                        accountId: accountEvent.accountId,
                        privateKey: accountEvent.privateKey ? accountEvent.privateKey : ' ',
                        stonesBalance: 0,
                        type: 'EXTERNAL'
                    };
                }
                else {
                    console.log('CREATING INTERNAL ACCOUNT FOR: ' + userId);
                    let blockChainAccount = yield wallet_1.createAccount();
                    account = {
                        name: accountEvent.name,
                        email: accountEvent.name,
                        user_id: userId,
                        accountId: blockChainAccount.address,
                        privateKey: blockChainAccount.privateKey,
                        stonesBalance: 0,
                        type: 'INTERNAL'
                    };
                }
                console.log('push account ' + JSON.stringify(account));
                if (accountEvent.brokerId) {
                    account = yield updateBroker(accountEvent.brokerId, account);
                }
                db.ref('server').child('users').child(userId).child('accounts').push(account);
                db
                    .ref('server')
                    .child('users')
                    .child(userId)
                    .child('activeAccount')
                    .set({ accountId: account.accountId });
                db.ref('server').child('usersPublic').child(userId).set({
                    name: account.name
                });
                console.log(`brokerToken: ${accountEvent.brokerToken}`);
                if (accountEvent.brokerToken) {
                    console.log('ASSIGN TO BRoker');
                    account = yield brokerOperations_1.assignUserToBrokerOperation(accountEvent.brokerToken, userId);
                }
                sendWelcomeMail(accountEvent.name, userId);
            }));
        }
    }
    catch (error) {
        console.log('error');
    }
}));
function sendWelcomeMail(name, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        const user = yield admin.auth().getUser(userId);
        console.log('SENDING EMAIL');
        console.log(JSON.stringify({
            template: 'project.investment.project.welcome',
            to: user.email,
            params: {
                name: name,
                thanksIssue: 'Welcome'
            },
            active: true
        }));
        db.ref('server/operations/events/sendEmail').push({
            template: 'project.investment.project.welcome',
            to: user.email,
            params: {
                name: name,
                thanksIssue: 'Welcome'
            },
            active: true
        });
        db.ref('server/operations/events/sendMailTrigger').update({ time: new Date().getTime() });
    });
}
function getInternalAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/addInternalAccount')
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let accountObject = snapshot.val();
                    if (accountObject) {
                        console.log(JSON.stringify(accountObject));
                        let accounts = Object.keys(accountObject).map((key) => {
                            let userAccount = accountObject[key];
                            userAccount.key = key;
                            return userAccount;
                        });
                        resolve(accounts);
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
//# sourceMappingURL=internalAccount.js.map