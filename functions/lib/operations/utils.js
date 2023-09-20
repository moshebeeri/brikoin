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
const wallet_1 = require("./wallet");
const pdfUtils_1 = require("../signPdf/pdfUtils");
const FlowManagerUtils_1 = require("../scheduler/FlowManagerUtils");
const functions = require('firebase-functions');
const fileBucket = functions.config().file.bucket;
const admin = require('firebase-admin');
const MIL = 1000000;
function getInternalTrades() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/internalTradeRequest')
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let trades = Object.keys(results).map((key) => {
                            let trade = results[key];
                            trade.key = key;
                            return trade;
                        });
                        resolve(trades[0]);
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
exports.getInternalTrades = getInternalTrades;
function updateTotalFees(db, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('START updateTotalFees ' + JSON.stringify(admin));
        try {
            console.log('UPDATING TOTAL FEES');
            let response = yield wallet_1.getTotalFees();
            console.log('Total FEEs: ' + JSON.stringify(response));
            if (response.success) {
                yield db.ref('server').child('administrator').update({ totalFees: response.totalFees });
            }
        }
        catch (error) {
            console.log('Failed update total fees ' + JSON.stringify(error));
        }
    });
}
exports.updateTotalFees = updateTotalFees;
function getNewEntities(entity) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/projectsCollections')
                    .child(entity)
                    .orderByChild('update_chain')
                    .equalTo(false)
                    .once('value', (snapshot) => __awaiter(this, void 0, void 0, function* () {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        results = Object.keys(results).map((key) => {
                            let result = results[key];
                            result.key = key;
                            return result;
                        });
                        resolve(results);
                        return;
                    }
                    resolve([]);
                }));
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getNewEntities = getNewEntities;
function getUserActiveAccount(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('users').child(userId).child('activeAccount').once('value', function (snapshot) {
                    let account = snapshot.val();
                    db
                        .ref('server')
                        .child('users')
                        .child(userId)
                        .child('accounts')
                        .orderByChild('accountId')
                        .equalTo(account.accountId)
                        .once('value', function (snapshot) {
                        let accountObject = snapshot.val();
                        accountObject = Object.keys(accountObject).map((key) => {
                            let userAccount = accountObject[key];
                            userAccount.id = key;
                            return userAccount;
                        });
                        resolve(accountObject[0]);
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserActiveAccount = getUserActiveAccount;
function getAccountNonce(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('nonce').child(accountId).once('value', function (snapshot) {
                    let nonce = snapshot.val();
                    if (!nonce) {
                        resolve(0);
                    }
                    else {
                        resolve(nonce);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getAccountNonce = getAccountNonce;
function setAccountNonce(accountId, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('nonce').child(accountId).set(nonce);
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.setAccountNonce = setAccountNonce;
function updateUserClearances(userAccount, mortgageClearances, mortgageAddress, tradeAmount, tradePrice, cleared, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            console.log('UPDATE CLEARANCE');
            try {
                db
                    .ref('server')
                    .child('users')
                    .child(userAccount.user_id)
                    .child('accounts')
                    .child(userAccount.id)
                    .child('mortgageClearances')
                    .child(mortgageAddress)
                    .update({ mortgageClearances: mortgageClearances });
                if (tradeAmount > 0) {
                    db
                        .ref('server')
                        .child('users')
                        .child(userAccount.user_id)
                        .child('accounts')
                        .child(userAccount.id)
                        .child('mortgageClearances')
                        .child(mortgageAddress)
                        .push({ amount: tradeAmount, price: tradePrice, time: new Date().getTime() });
                }
                if (cleared) {
                    db
                        .ref('server')
                        .child('users')
                        .child(userAccount.user_id)
                        .child('accounts')
                        .child(userAccount.id)
                        .child('mortgageClearances')
                        .child(mortgageAddress)
                        .once('value', function (snapshot) {
                        let result = snapshot.val();
                        if (result) {
                            let keys = Object.keys(result);
                            if (keys && keys.length > 0) {
                                keys.forEach((key) => {
                                    if (result[key] && !result[key].cleared) {
                                        db
                                            .ref('server')
                                            .child('users')
                                            .child(userAccount.user_id)
                                            .child('accounts')
                                            .child(userAccount.id)
                                            .child('mortgageClearances')
                                            .child(mortgageAddress)
                                            .child(key)
                                            .update({ cleared: true });
                                    }
                                });
                            }
                            resolve(keys[0]);
                        }
                        resolve('');
                    });
                }
                resolve(true);
            }
            catch (eupdateUserClearancesrror) {
                reject(false);
            }
        });
    });
}
exports.updateUserClearances = updateUserClearances;
function getAdminAccountId() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('admins').child('init').once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getAdminAccountId = getAdminAccountId;
function getProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('projectsCollections').child('projects').once('value', function (snapshot) {
                    let projects = snapshot.val();
                    if (Object.keys(projects).length > 0) {
                        let projectsAddress = Object.keys(projects).map((key) => projects[key].address);
                        resolve(projectsAddress);
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
exports.getProjects = getProjects;
function getProjectInitialAskId(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('orders')
                    .child(projectAddress)
                    .child('ask')
                    .once('value', function (snapshot) {
                    let projectAsks = snapshot.val();
                    if (Object.keys(projectAsks).length > 0) {
                        let asks = Object.keys(projectAsks).filter((key) => projectAsks[key].state === 'initial' && projectAsks[key].user === 'admin');
                        if (asks.length > 0) {
                            resolve(asks[0]);
                        }
                        else {
                            resolve('');
                        }
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
exports.getProjectInitialAskId = getProjectInitialAskId;
function getProjectInitialAsk(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('orders')
                    .child(projectAddress)
                    .child('ask')
                    .once('value', function (snapshot) {
                    let projectAsks = snapshot.val();
                    if (Object.keys(projectAsks).length > 0) {
                        let asks = Object.keys(projectAsks).filter((key) => projectAsks[key].state === 'initial' && projectAsks[key].user === 'admin');
                        if (asks.length > 0) {
                            resolve(projectAsks[asks[0]]);
                        }
                        else {
                            resolve('');
                        }
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
exports.getProjectInitialAsk = getProjectInitialAsk;
function getFullProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('projectsCollections').child('projects').once('value', function (snapshot) {
                    let projects = snapshot.val();
                    if (Object.keys(projects).length > 0) {
                        let projectsFull = Object.keys(projects).map((key) => {
                            let project = projects[key];
                            project.id = key;
                            project.objectID = key;
                            return project;
                        });
                        resolve(projectsFull);
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
exports.getFullProjects = getFullProjects;
function getProjectEntity(address, entity) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projectsCollections')
                    .child(entity)
                    .orderByChild('address')
                    .equalTo(address)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (!result) {
                        resolve({});
                        return;
                    }
                    if (Object.keys(result).length > 0) {
                        let objects = Object.keys(result).map((key) => {
                            let entity = result[key];
                            entity.id = key;
                            return entity;
                        });
                        resolve(objects[0]);
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
function getProjectMortgages(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('mortgages')
                    .orderByChild('project')
                    .equalTo(address)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (!result) {
                        resolve([]);
                        return;
                    }
                    if (Object.keys(result).length > 0) {
                        resolve(Object.keys(result).map((key) => {
                            let entity = result[key];
                            entity.id = key;
                            return entity;
                        }));
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
function getCornerStone() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('admins').child('controlContracts').once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getCornerStone = getCornerStone;
function getAdminAccount(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('admins').child(name).once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getAdminAccount = getAdminAccount;
function getAdminUser() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('get Admin User');
        let admins = yield getAdminsIds();
        let adminsIds = Object.keys(admins);
        let users = yield getUsers();
        console.log(`adminIds: ${JSON.stringify(adminsIds)}`);
        let adminUsers = Object.keys(users).filter((userId) => adminsIds.includes(userId));
        console.log(`adminUsers: ${JSON.stringify(adminUsers)}`);
        return adminUsers[0];
    });
}
exports.getAdminUser = getAdminUser;
function getAdminsIds() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('usersRoles').child('admin').once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getAdminsIds = getAdminsIds;
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('users').once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function updateNonce(nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            // try {
            //     db.ref('server').child('admins').child('init').update({nonce: nonce})
            //     resolve(true)
            // } catch (error) {
            //     reject(error)
            // }
        });
    });
}
exports.updateNonce = updateNonce;
function updateNonceAdmin(nonce, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('admins').child(name).update({ nonce: nonce });
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.updateNonceAdmin = updateNonceAdmin;
function updateNonceDeployAdmin(nonce, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('admins').child(name).update({ nonceDeploy: nonce });
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.updateNonceDeployAdmin = updateNonceDeployAdmin;
function updateNonceUser(nonce, accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('userNonce').child(accountAddress).update({ nonce: nonce });
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.updateNonceUser = updateNonceUser;
function getUserNonce(accountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('userNonce').child(accountAddress).once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserNonce = getUserNonce;
function updateTransactionDone(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref(`server/projects/events/ordersDone`).set({ projectId: projectId, time: new Date().getTime() });
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.updateTransactionDone = updateTransactionDone;
function getProjectId(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projectsCollections/projects')
                    .orderByChild('address')
                    .equalTo(projectAddress)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        resolve(keys[0]);
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
exports.getProjectId = getProjectId;
function updateMortgageeBalance(userId, userAccountAddress, mortgageeAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let balance = yield wallet_1.getUserMortgageeBalance(userAccountAddress);
        console.log('mortgagee Balaance: ' + balance);
        if (parseInt(balance) > 0) {
            db.ref('server').child('users').child(userId).child('mortgagee').update({
                amount: balance,
                mortgageeAddress: mortgageeAddress
            });
            let mortgageeKey = yield getMortgageeKey(userAccountAddress);
            if (mortgageeKey) {
                db.ref('server').child('projects').child('mortgagees').child(mortgageeKey).update({
                    amount: balance,
                    userAccountAddress: userAccountAddress,
                    mortgageeAddress: mortgageeAddress
                });
            }
            else {
                db.ref('server').child('projects').child('mortgagees').push({
                    amount: balance,
                    userAccountAddress: userAccountAddress,
                    mortgageeAddress: mortgageeAddress
                });
            }
        }
    });
}
exports.updateMortgageeBalance = updateMortgageeBalance;
function updateUserBalance(userId, userAccountAddress, accountId, balance, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let userBalance = yield wallet_1.getUserCurrentBalance(userAccountAddress);
        console.log('balance' + balance);
        console.log('userBalance' + userBalance);
        if (balance) {
            let projectYield = userBalance - balance;
            let yieldAmount = {
                time: new Date().getTime(),
                amount: projectYield
            };
            db
                .ref('server')
                .child('users')
                .child(userId)
                .child('myHoldings')
                .child(projectAddress)
                .child('yields')
                .push(yieldAmount);
        }
        console.log('NEW USER BALANCE: ' + userBalance + '  userId: ' + userId);
        db.ref('server').child('users').child(userId).child('accounts').child(accountId).update({
            stonesBalance: userBalance
        });
    });
}
exports.updateUserBalance = updateUserBalance;
function updateBrokerFees(brokerUserId, brokerAccountAddress, brokerAccountId, userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('UPDATE BROKER FEES');
        let brokerCustomerId = yield getBrokerCustomerId(brokerUserId, brokerAccountId, userAccountAddress);
        console.log('brokerCustomerId: ' + brokerCustomerId);
        if (brokerCustomerId) {
            let feesIndex = yield getBrokerCustomerFeesNumber(brokerUserId, brokerAccountId, brokerCustomerId);
            console.log('feesIndex ' + feesIndex);
            let brokerFeeTransaction = yield wallet_1.getBrokerFeeTransaction(brokerAccountAddress, userAccountAddress, feesIndex);
            console.log('brokerFeeTransaction ' + JSON.stringify(brokerFeeTransaction));
            yield updateBrokerTransaction(brokerFeeTransaction, brokerUserId, brokerAccountId, brokerCustomerId);
        }
    });
}
exports.updateBrokerFees = updateBrokerFees;
function updateBrokerTransaction(brokerFeeTransaction, brokerUserId, brokerAccountId, brokerCustomerId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('users')
                    .child(brokerUserId)
                    .child('accounts')
                    .child(brokerAccountId)
                    .child('brokerCustomers')
                    .child(brokerCustomerId)
                    .child('fees')
                    .push(brokerFeeTransaction);
                resolve(true);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getBrokerCustomerId(brokerUserId, brokerAccountId, userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('users')
                    .child(brokerUserId)
                    .child('accounts')
                    .child(brokerAccountId)
                    .child('brokerCustomers')
                    .orderByChild('userAccount')
                    .equalTo(userAccountAddress)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        resolve(keys[0]);
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
function getBrokerCustomerFeesNumber(brokerUserId, brokerAccountId, brokerCustomerId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('users')
                    .child(brokerUserId)
                    .child('accounts')
                    .child(brokerAccountId)
                    .child('brokerCustomers')
                    .child(brokerCustomerId)
                    .child('fees')
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        resolve(keys.length);
                        return;
                    }
                    resolve(0);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getMortgageeKey(userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('mortgagees')
                    .orderByChild('userAccountAddress')
                    .equalTo(userAccountAddress)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        resolve(keys[0]);
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
exports.getMortgageeKey = getMortgageeKey;
function getUserLastOffer(tradeRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('orders')
                    .child(tradeRequest.projectId)
                    .child(tradeRequest.side)
                    .orderByChild('user')
                    .equalTo(tradeRequest.user)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        if (keys.length > 0) {
                            let request = result[keys[0]];
                            request.key = keys[0];
                            resolve(request);
                        }
                        resolve(keys[0]);
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
exports.getUserLastOffer = getUserLastOffer;
function getUserLastAuctionOffer(tradeRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('events')
                    .child('auctionOrders')
                    .child(tradeRequest.projectId)
                    .child(tradeRequest.auctionId)
                    .child(tradeRequest.side)
                    .orderByChild('user')
                    .equalTo(tradeRequest.user)
                    .once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        let keys = Object.keys(result);
                        if (keys.length > 0) {
                            let request = result[keys[0]];
                            request.key = keys[0];
                            resolve(request);
                        }
                        resolve(keys[0]);
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
exports.getUserLastAuctionOffer = getUserLastAuctionOffer;
function updateProjectChange(projectId) {
    let db = admin.database();
    const request = {
        projectId: projectId,
        timestamp: new Date().getTime()
    };
    db.ref('server').child('changes').set(request);
}
exports.updateProjectChange = updateProjectChange;
function getProjectHolders(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/projects/holders/').child(projectAddress).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let holders = Object.keys(results).map((key) => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(holders);
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
exports.getProjectHolders = getProjectHolders;
function getActiveRequests(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/')
                    .child(request)
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let requesrs = Object.keys(results).map((key) => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(requesrs);
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
exports.getActiveRequests = getActiveRequests;
function getActiveRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let requestResult = yield getRequest(request);
        if (!requestResult) {
            return '';
        }
        if (requestResult.taken) {
            return '';
        }
        let UID = new Date().getTime();
        let takenUid = yield getTakenUid(request, requestResult, UID);
        console.log(`takenUid ${takenUid} UID: ${UID}`);
        if (UID === takenUid) {
            let db = admin.database();
            db.ref('server').child('/operations/events/').child(request).child(requestResult.key).push({ UID: UID });
            return requestResult;
        }
        return '';
    });
}
exports.getActiveRequest = getActiveRequest;
function getTakenUid(request, requestResult, UID) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db
            .ref('server')
            .child('/operations/events/')
            .child(request)
            .child(requestResult.key)
            .child('taken')
            .transaction(function (taken) {
            if (!taken) {
                console.log(`taken resolved ${UID}`);
                return UID;
            }
            return taken;
        });
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/')
                    .child(request)
                    .child(requestResult.key)
                    .child('taken')
                    .once('value', function (snapshot) {
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
function getRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('/operations/events/')
                    .child(request)
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let requests = Object.keys(results).map((key) => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(requests[0]);
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
exports.getRequest = getRequest;
function getGroup(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').child(groupId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    results.id = groupId;
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getGroup = getGroup;
function getConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('configuration').once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getConfiguration = getConfiguration;
function getGroupByCreatorName(userId, groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').orderByChild('creator').equalTo(userId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let groups = Object.keys(results).map((key) => {
                            let group = results[key];
                            group.id = key;
                            return group;
                        });
                        let filteredGroups = groups.filter((group) => group.name === groupName);
                        if (filteredGroups.length > 0) {
                            resolve(filteredGroups[0]);
                            return;
                        }
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
exports.getGroupByCreatorName = getGroupByCreatorName;
function getGroupTask(groupId, param) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('operationHub/taskManager')
                    .orderByChild('type')
                    .equalTo(param)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let tasks = Object.keys(results).map((key) => {
                            let task = results[key];
                            task.id = key;
                            return task;
                        });
                        let filteredTasks = tasks.filter((task) => task.groupId === groupId);
                        if (filteredTasks.length > 0) {
                            resolve(filteredTasks[0]);
                            return;
                        }
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
exports.getGroupTask = getGroupTask;
function getProjectFullDetails(project) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(JSON.stringify(project));
        let assetManager = yield getProjectEntity(project.assetManager, 'assetManagers');
        let estimation = yield getProjectEntity(assetManager.estimation, 'estimations');
        let manager = yield getProjectEntity(assetManager.manager, 'managers');
        let registrar = yield getProjectEntity(assetManager.registrar, 'registrars');
        let terms = yield getProjectEntity(assetManager.terms, 'terms');
        let trustee = yield getProjectEntity(assetManager.trustee, 'trustees');
        let property = yield getProjectEntity(assetManager.property, 'properties');
        let mortgages = yield getProjectMortgages(project.address);
        property.manager = manager;
        property.trustee = trustee;
        property.registrar = registrar;
        property.estimation = estimation;
        project.property = property;
        project.terms = terms;
        project.mortgages = mortgages;
        return project;
    });
}
exports.getProjectFullDetails = getProjectFullDetails;
function getSubProjectsList(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('projectsCollections')
                    .child('projects')
                    .orderByChild('parentProjectId')
                    .equalTo(projectId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results && Object.keys(results).length > 0) {
                        let finalResults = Object.keys(results).map((key) => {
                            let project = results[key];
                            project.id = key;
                            return project;
                        });
                        resolve(finalResults);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getSubProjectsList = getSubProjectsList;
function getInitilProjects(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let projects = yield getFullProjects();
        let results = yield Promise.all(projects.map((project) => getProjectFullDetails(project)));
        return results;
    });
}
exports.getInitilProjects = getInitilProjects;
function initSubProjects(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        let projects = yield getSubProjectsList(projectId);
        if (projects && projects.length > 0) {
            let results = yield Promise.all(projects.map((project) => getProjectFullDetails(project)));
            return results;
        }
        return [];
    });
}
exports.initSubProjects = initSubProjects;
function getProjectByAddress(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield getProject(projectAddress);
        console.log(`Project Found ${JSON.stringify(project)}`);
        let result = yield getProjectFullDetails(project);
        return result;
    });
}
exports.getProjectByAddress = getProjectByAddress;
function getMyProjectGroups(userId, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results && Object.keys(results).length > 0) {
                        let groups = Object.keys(results)
                            .map((key) => {
                            let group = results[key];
                            group.id = key;
                            if (!group.members) {
                                return '';
                            }
                            return group;
                        })
                            .filter((group) => group);
                        if (filter) {
                            const filteredGroups = groups.length > 0
                                ? groups.filter((group) => {
                                    if (Object.keys(group.members).length > 0) {
                                        let filterMembers = Object.keys(group.members).filter((key) => group.members[key].userId === userId);
                                        if (filterMembers.length > 0) {
                                            return true;
                                        }
                                    }
                                    return false;
                                })
                                : [];
                            resolve(filteredGroups);
                        }
                        else {
                            resolve(groups);
                        }
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getMyProjectGroups = getMyProjectGroups;
function getProjectGroups(projectAddress, userId, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child('groups')
                    .orderByChild('project')
                    .equalTo(projectAddress)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results && Object.keys(results).length > 0) {
                        let groups = Object.keys(results).map((key) => {
                            let group = results[key];
                            group.id = key;
                            return group;
                        });
                        if (filter) {
                            const filteredGroups = groups.length > 0
                                ? groups.filter((group) => {
                                    if (group.type === 'OPEN') {
                                        return true;
                                    }
                                    if (Object.keys(group.members).length > 0) {
                                        let filterMembers = Object.keys(group.members).filter((key) => group.members[key].userId === userId);
                                        if (filterMembers.length > 0) {
                                            return true;
                                        }
                                    }
                                    return false;
                                })
                                : [];
                            resolve(filteredGroups);
                        }
                        else {
                            resolve(groups);
                        }
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getProjectGroups = getProjectGroups;
const reducer = (accumulator, currentValue) => accumulator + currentValue;
function getMyCases(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('cases').child(userId).once('value', function (snapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let cases = snapshot.val();
                        let casesArray = Object.keys(cases)
                            .map((key) => {
                            let currentCase = cases[key];
                            if (key === 'changed') {
                                return '';
                            }
                            currentCase.id = key;
                            return currentCase;
                        })
                            .filter((currentCase) => currentCase);
                        console.log(`casesArray: ${JSON.stringify(casesArray)}`);
                        let userIsMember = casesArray
                            .map((currentCase) => getOrdersIds(currentCase))
                            .filter((currentCase) => currentCase);
                        let userIsMemberMerged = [].concat.apply([], userIsMember);
                        console.log(`userIsMemberMerged: ${JSON.stringify(userIsMemberMerged)}`);
                        let orders = yield Promise.all(userIsMemberMerged.map((order) => getPendingOrderById(order.orderId, order.project, order.caseId)));
                        resolve({ cases: casesArray, orders: orders });
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getMyCases = getMyCases;
function getOrdersIds(currentCase) {
    console.log(`currentCase ${JSON.stringify(currentCase)}`);
    if (!currentCase.buyers) {
        return '';
    }
    let buyers = Object.keys(currentCase.buyers).map((key) => currentCase.buyers[key]);
    return buyers.map((buyer) => {
        return {
            orderId: buyer.offer,
            project: currentCase.projectAddress,
            caseId: currentCase.id
        };
    });
}
function getOrder(projectAddress, orderId) { }
function getGroupStats(groupId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').child(groupId).once('value', function (snapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let group = snapshot.val();
                        console.log(`group: ${JSON.stringify(group)}`);
                        console.log('check authorization');
                        // make sure user is a member of the group (authorization)
                        let userIsMember = Object.keys(group.members)
                            .map((key) => group.members[key])
                            .filter((member) => member.userId === userId);
                        if (userIsMember.length === 0) {
                            resolve({});
                            return;
                        }
                        console.log(`user ${userId} is authorized`);
                        if (group) {
                            let detailedMembers = yield Promise.all(Object.keys(group.members).map((key) => getMemberOrder(group.project, group.members[key], groupId)));
                            console.log(`detailedMembers: ${JSON.stringify(detailedMembers)}`);
                            resolve({
                                sum: detailedMembers
                                    .map((member) => member.order ? parseInt(member.order.amount) * parseInt(member.order.price) : 0)
                                    .reduce(reducer),
                                sumTransferred: detailedMembers
                                    .map((member) => member.order && member.order.fullDeposit
                                    ? parseInt(member.order.amount) * parseInt(member.order.price)
                                    : 0)
                                    .reduce(reducer),
                                activeMembers: Object.keys(group.members)
                                    .map((key) => (group.members[key].status === 'Active' ? 1 : 0))
                                    .reduce(reducer),
                                members: Object.keys(group.members).length,
                                detailedMember: detailedMembers,
                                reservedPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.reserved ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100,
                                signedAgreementPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.signedAgreement ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100,
                                orderApprovedPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.orderApproved ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100
                            });
                        }
                        else {
                            resolve({});
                        }
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getGroupStats = getGroupStats;
function getMemberOrder(projectAddress, member, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let pendingOrder = yield getPendingOrderByGroup(member.userId, projectAddress, groupId);
        if (Object.keys(pendingOrder).length > 0) {
            member.order = pendingOrder;
        }
        console.log(`member: ${JSON.stringify(member)}`);
        return member;
    });
}
exports.getMemberOrder = getMemberOrder;
function updateMortgageeBalannce(userId, userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let balance = yield wallet_1.getMortgageeBalance(userAccountAddress);
        console.log('Mortgagaee New Balance: ' + balance);
        yield db.ref('server').child('users').child(userId).child('mortgagee').update({ amount: balance });
    });
}
exports.updateMortgageeBalannce = updateMortgageeBalannce;
function syncUserLedger(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server').child('operations/events/syncUserLedger').push({ active: true, userId: userId });
        yield db.ref('server').child('operations/events/syncUserLedgerTrigger').set({ time: new Date().getTime() });
    });
}
exports.syncUserLedger = syncUserLedger;
function userBalanceByProject(userId, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let ledger = yield getLedger(userId);
        console.log('ledger ' + JSON.stringify(ledger));
        if (!ledger || ledger.length === 0) {
            return 0;
        }
        console.log('projectAddress ' + projectAddress);
        let projectLedeger = ledger.filter((transaction) => transaction.projectAddress === projectAddress);
        console.log('projectLedeger ' + JSON.stringify(projectLedeger));
        if (!projectLedeger || projectLedeger.length === 0) {
            return 0;
        }
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let currentBalance = projectLedeger
            .map((ledger) => (ledger.isAdd ? parseInt(ledger.amount) : parseInt(ledger.amount) * -1))
            .reduce(reducer);
        console.log('User Project Balance ' + currentBalance);
        return currentBalance > 0 ? currentBalance / MIL : 0;
    });
}
exports.userBalanceByProject = userBalanceByProject;
function getLedger(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('users').child(userId).child('ledger').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let ledgers = Object.keys(results).map((key) => {
                            let transaction = results[key];
                            transaction.key = key;
                            return transaction;
                        });
                        resolve(ledgers);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function updateProjectHoldings(userId, userAccountAddress, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let userHoldings = yield wallet_1.getUserHoldings(userAccountAddress, projectAddress);
        console.log('USER Holdings ' + userId + '  holdings: ' + userHoldings);
        yield db
            .ref('server')
            .child('users')
            .child(userId)
            .child('myHoldings')
            .child(projectAddress)
            .update({ holdings: userHoldings });
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
exports.updateProjectHoldings = updateProjectHoldings;
function orderChangedNotification(pendingOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (pendingOrder.caseId) {
            let project = yield getProject(pendingOrder.project);
            let trustee = project.trustee ? (project.trustee.user ? project.trustee.user : project.trustee) : '';
            if (trustee) {
                db.ref('server').child('cases').child(trustee).child('changed').update({ time: new Date().getTime() });
            }
        }
    });
}
exports.orderChangedNotification = orderChangedNotification;
function getProject(project) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projectsCollections')
                    .child('projects')
                    .orderByChild('address')
                    .equalTo(project)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let project = results[key];
                            project.key = key;
                            return project;
                        });
                        resolve(result[0]);
                    }
                    else {
                        resolve({});
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getProject = getProject;
function getUserDocuments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/legalDocuments/`).orderByChild('owner').equalTo(userId).once('value', function (snapshot) {
                let result = snapshot.val();
                console.log(`User documents  ${JSON.stringify(result)} `);
                if (!result) {
                    resolve([]);
                    return;
                }
                let documents = Object.keys(result).map((key) => {
                    let document = result[key];
                    document.key = key;
                    return document;
                });
                resolve(documents);
            });
        });
    });
}
exports.getUserDocuments = getUserDocuments;
function getOrCreateKycOperation(userId, kycDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let kycOperation = yield getUserKycOperation(userId);
        console.log(`KYC operation response : ${JSON.stringify(kycOperation)}`);
        if (!kycOperation.name) {
            let createdKycOperation = {
                document: kycDocument.key,
                name: 'KYC',
                time: new Date().getTime(),
                type: 'signDocument',
                status: 'waiting',
                key: ''
            };
            let kycKey = yield db.ref(`server/operationHub/${userId}/operations`).push(createdKycOperation).key;
            createdKycOperation.key = kycKey;
            yield addNotification(userId, 'operation', 'signKYC');
            let phoneValidation = {
                name: 'phoneValidation',
                time: new Date().getTime(),
                type: 'validateSmsOperation',
                status: 'waiting'
            };
            yield db.ref(`server/operationHub/${userId}/operations`).push(phoneValidation);
            yield addNotification(userId, 'operation', 'phoneValidation');
            return createdKycOperation;
        }
        return kycOperation;
    });
}
exports.getOrCreateKycOperation = getOrCreateKycOperation;
function getUserKycOperation(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db
                .ref(`server/operationHub/${userId}/operations`)
                .orderByChild('name')
                .equalTo('KYC')
                .once('value', function (snapshot) {
                let result = snapshot.val();
                console.log('KYC operation ' + JSON.stringify(result));
                if (!result) {
                    resolve('');
                    return;
                }
                let operations = Object.keys(result).map((key) => {
                    let operation = result[key];
                    operation.key = key;
                    return operation;
                });
                resolve(operations[0]);
            });
        });
    });
}
exports.getUserKycOperation = getUserKycOperation;
function getOrCreateKycDocument(userId, trustee) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documents = yield getUserDocuments(userId);
        if (documents && documents.length > 0) {
            let kycDoc = documents.filter((document) => document.type === 'KYC');
            if (kycDoc.length > 0) {
                let kycDocument = kycDoc[0];
                yield db.ref(`server/legalDocuments/${kycDocument.key}/users`).update({
                    [trustee]: 'read'
                });
                return kycDocument;
            }
        }
        let operationRef = db.ref(`server/legalDocuments/`);
        let kycDocument = {
            owner: userId,
            users: {
                [trustee]: 'read'
            },
            type: 'KYC',
            key: ''
        };
        let documentKey = yield operationRef.push(kycDocument).key;
        kycDocument.key = documentKey;
        return kycDocument;
    });
}
exports.getOrCreateKycDocument = getOrCreateKycDocument;
function getKycDocument(userId, trustee) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documents = yield getUserDocuments(userId);
        if (documents && documents.length > 0) {
            let kycDoc = documents.filter((document) => document.type === 'KYC');
            if (kycDoc.length > 0) {
                let kycDocument = kycDoc[0];
                return kycDocument;
            }
            return {};
        }
    });
}
exports.getKycDocument = getKycDocument;
function addProjectNotification(userId, subject, message, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/notifications/${userId}`).push({
            read: false,
            subject: subject,
            message: message,
            project: project
        });
    });
}
exports.addProjectNotification = addProjectNotification;
function addNotificationWithParams(userId, subject, message, params) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/notifications/${userId}`).push(Object.assign({ read: false, subject: subject, message: message }, params));
    });
}
exports.addNotificationWithParams = addNotificationWithParams;
function addNotification(userId, subject, message) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/notifications/${userId}`).push({
            read: false,
            subject: subject,
            message: message
        });
    });
}
exports.addNotification = addNotification;
function getOpenHoursOperation(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db
                .ref(`server/operationHub/${userId}/operations`)
                .orderByChild('type')
                .equalTo('openHours')
                .once('value', function (snapshot) {
                let result = snapshot.val();
                console.log(`User documents  ${JSON.stringify(result)} `);
                if (!result) {
                    resolve('');
                    return;
                }
                let operations = Object.keys(result).map((key) => {
                    let operation = result[key];
                    operation.key = key;
                    return operation;
                });
                resolve(operations[0]);
            });
        });
    });
}
exports.getOpenHoursOperation = getOpenHoursOperation;
function getScheduledAppointment(userId, operationUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db
                .ref(`server/operationHub/${userId}/operations`)
                .orderByChild('type')
                .equalTo('orderAppointment')
                .once('value', function (snapshot) {
                let result = snapshot.val();
                console.log(`User documents  ${JSON.stringify(result)} `);
                if (!result) {
                    resolve('');
                    return;
                }
                let operations = Object.keys(result).map((key) => {
                    let operation = result[key];
                    operation.key = key;
                    return operation;
                });
                let filteredOperations = operations.filter((operation) => operation.user === operationUserId);
                if (filteredOperations.length > 0) {
                    resolve(filteredOperations[0]);
                }
                resolve('');
            });
        });
    });
}
exports.getScheduledAppointment = getScheduledAppointment;
function getSmsValidation(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db
                .ref(`server/operationHub/${userId}/operations`)
                .orderByChild('type')
                .equalTo('validateSmsOperation')
                .once('value', function (snapshot) {
                let result = snapshot.val();
                console.log(`User documents  ${JSON.stringify(result)} `);
                if (!result) {
                    resolve('');
                    return;
                }
                let operations = Object.keys(result).map((key) => {
                    let operation = result[key];
                    operation.key = key;
                    return operation;
                });
                if (operations.length > 0) {
                    resolve(operations[0]);
                }
                resolve('');
            });
        });
    });
}
exports.getSmsValidation = getSmsValidation;
function scheduleVideoMeeting(operationUserId, userId, project, allowDuplicate) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let openHourOperation = yield getOpenHoursOperation(operationUserId);
        if (!openHourOperation) {
            db.ref('server').child(`/operationHub/${operationUserId}/operations`).push({
                type: 'openHours',
                name: 'scheduleTime',
                status: 'waiting',
                time: new Date().getTime()
            });
            yield addNotification(operationUserId, 'operation', 'scheduleTime');
        }
        let videoMeetingScheduled = yield getScheduledAppointment(userId, operationUserId);
        if (!videoMeetingScheduled || allowDuplicate) {
            db.ref('server').child(`/operationHub/${userId}/operations`).push({
                type: 'orderAppointment',
                name: 'scheduleTime',
                status: 'waiting',
                project: project,
                user: operationUserId,
                time: new Date().getTime()
            });
            yield addNotification(userId, 'operation', 'scheduleTime');
            db.ref('server').child(`/operationHub/taskManager`).push({
                active: true,
                operationUserId: operationUserId,
                project: project,
                type: 'videoConference',
                user: userId,
                time: new Date().getTime()
            });
        }
    });
}
exports.scheduleVideoMeeting = scheduleVideoMeeting;
function getSignedOperation(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let signOperation = task.signOperation;
        let signUser = task.signUser;
        return new Promise((resolve, reject) => {
            db.ref(`server/operationHub/${signUser}/operations/${signOperation}`).once('value', function (snapshot) {
                let result = snapshot.val();
                resolve(result ? result : {});
            });
        });
    });
}
exports.getSignedOperation = getSignedOperation;
function getOperationByid(userId, operationId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/operationHub/${userId}/operations/${operationId}`).once('value', function (snapshot) {
                let result = snapshot.val();
                resolve(result ? result : {});
            });
        });
    });
}
exports.getOperationByid = getOperationByid;
function getPublicUsers(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/usersPublic/`).once('value', function (snapshot) {
                let result = snapshot.val();
                if (result) {
                    let users = Object.keys(result)
                        .map((userId) => {
                        return {
                            userId: userId,
                            name: result[userId].name || '',
                            description: result[userId].description || '',
                            webSite: result[userId].webSite || '',
                            photoUrl: result[userId].photoUrl || ''
                        };
                    })
                        .filter((user) => user.name.includes(name));
                    resolve(users);
                }
                resolve([]);
            });
        });
    });
}
function getLawyers() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/usersRoles/LAWYER`).once('value', function (snapshot) {
                let result = snapshot.val();
                resolve(result);
            });
        });
    });
}
function searchLawyer(lawyerName) {
    return __awaiter(this, void 0, void 0, function* () {
        let users = yield getPublicUsers(lawyerName);
        console.log(`user with name ${lawyerName} : ${JSON.stringify(users)}`);
        if (users.length > 0) {
            let lawyersIds = yield getLawyers();
            let results = users.filter((user) => Object.keys(lawyersIds).includes(user.userId));
            console.log(`results lawyers with name ${lawyerName} : ${JSON.stringify(results)}`);
            return results;
        }
        return [];
    });
}
exports.searchLawyer = searchLawyer;
function convertDocumentToHtml(operationRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let operation = yield getOperationByid(userId, operationRequest.id);
        console.log(`operation ${JSON.stringify(operation)}`);
        let document = yield getDocument(operation);
        console.log(`document ${JSON.stringify(document)}`);
        let documentPath = document.documentPath;
        console.log(`documentPath ${documentPath}`);
        let fileName = document.fileName;
        console.log(`fileName ${fileName}`);
        let fileExtension = fileName.substring(fileName.lastIndexOf('.'));
        console.log(`fileExtension ${fileExtension}`);
        let inputFormat = fileExtension.includes('docx') ? 'docx' : fileExtension.includes('doc') ? 'doc' : '';
        console.log(`inputFormat ${inputFormat}`);
        if (inputFormat) {
            yield pdfUtils_1.convertFile(fileName, documentPath, inputFormat, 'html', {
                buyer: operation.buyerId,
                seller: operation.sellerId ? operation.sellerId : '',
                lawyerSeller: operation.sellerLawyerId ? operation.sellerLawyerId : ''
            });
        }
        else {
            return { status: false, msg: 'format unsupported' };
        }
        return { status: true };
    });
}
exports.convertDocumentToHtml = convertDocumentToHtml;
function updateOriginalFile(operationRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let operation = yield getOperationByid(userId, operationRequest.id);
        console.log(`operation ${JSON.stringify(operation)}`);
        let documentPath = operation.documentPath;
        let fileNmae = documentPath.substring(documentPath.lastIndexOf('/') + 1);
        const bucket = admin.storage().bucket(fileBucket);
        console.log(`documentPath ${documentPath} fileNmae: ${fileNmae}`);
        let originalFile = bucket.file(documentPath);
        let metadata = yield originalFile.getMetadata();
        console.log(`metadata ${JSON.stringify(metadata)}`);
        let newFileFullPath = `users/${userId}/documents/${operation.document}/${fileNmae}`;
        console.log(`newFileFullPath ${newFileFullPath}`);
        let newFile = bucket.file(newFileFullPath);
        yield newFile.copy(originalFile);
        let copyFile = bucket.file(documentPath);
        yield copyFile.setMetadata({
            metadata: metadata[0].metadata
        });
        return { status: true };
    });
}
exports.updateOriginalFile = updateOriginalFile;
function updateOperationDone(operationRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log('updateing operation');
        if (operationRequest && operationRequest.flowInstance) {
            try {
                let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(operationRequest.flowInstance);
                console.log(`found flow instance ${JSON.stringify(flowInstance)}`);
                if (flowInstance && flowInstance.operations) {
                    db.ref(`server/operationHub/${userId}/operations/${operationRequest.id}`).update({
                        status: 'operationDone'
                    });
                    yield FlowManagerUtils_1.updateFlowStep(flowInstance, operationRequest.operationId, 'DONE', operationRequest.flowInstance);
                    db.ref('server/taskScheduler/trigger').update({ time: new Date().getTime() });
                    return { response: 'done' };
                }
                else {
                    console.log('error no flow found');
                    return { response: 'error no flow found' };
                }
            }
            catch (error) {
                console.log('error failed updateOperationDone');
                return { response: 'Failed' };
            }
        }
        return { response: 'error no operation' };
    });
}
exports.updateOperationDone = updateOperationDone;
function updateDocumentAttributes(attributesRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let document = yield getDocument({ document: attributesRequest.documentId });
        if (document.owner !== userId) {
            return { response: 'error invalid user' };
        }
        db.ref(`server/legalDocuments/${attributesRequest.documentId}/attributes`).set(attributesRequest.attributes);
        let generalAttiruvtes = yield getDocumentGeneralAttrivutes(userId);
        let userGeneralAttributes = Object.assign(generalAttiruvtes, attributesRequest.attributes);
        db.ref(`server/operationHub/${userId}/documentsAttributes`).set(userGeneralAttributes);
        return { response: 'succsess' };
    });
}
exports.updateDocumentAttributes = updateDocumentAttributes;
function getDocumentGeneralAttrivutes(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/operationHub/${userId}/documentsAttributes`).once('value', function (snapshot) {
                let result = snapshot.val();
                resolve(result ? result : {});
            });
        });
    });
}
function getDocument(operaion) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documentId = operaion.document;
        return new Promise((resolve, reject) => {
            db.ref(`server/legalDocuments/${documentId}`).once('value', function (snapshot) {
                let result = snapshot.val();
                resolve(result ? result : {});
            });
        });
    });
}
exports.getDocument = getDocument;
function getPublicUserById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/usersPublic/${userId}`).once('value', function (snapshot) {
                let result = snapshot.val();
                if (result) {
                    result.userId = userId;
                }
                resolve(result ? result : {});
            });
        });
    });
}
exports.getPublicUserById = getPublicUserById;
function getUserGroupOffer(userId, groupId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('pendingOrders')
                    .child(project)
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
                        });
                        let activeOrders = result.filter((order) => order.active && !order.cancelOrder && order.group === groupId);
                        if (activeOrders.length > 0) {
                            resolve(activeOrders[0]);
                        }
                        resolve({});
                    }
                    resolve({});
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserGroupOffer = getUserGroupOffer;
function updateBuyerOrderLaweyer(project, orderKey, lawyerId, operationKey, userId, flowId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(`updating server/projects/pendingOrders/${project}/${orderKey} lawyerBuyerId:${lawyerId}`);
        yield db.ref('server').child('projects').child('pendingOrders').child(project).child(orderKey).update({
            lawyerBuyerId: lawyerId
        });
        yield db.ref('server').child('operationHub').child(userId).child('operations').child(operationKey).update({
            lawyerId: lawyerId
        });
        yield db.ref('server').child('FlowInstance').child(flowId).update({
            lawyerBuyerId: lawyerId
        });
    });
}
exports.updateBuyerOrderLaweyer = updateBuyerOrderLaweyer;
function updateSellerOrderLaweyer(project, orderKey, lawyerId, operationKey, userId, flowId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server').child('projects').child('pendingOrders').child(project).child(orderKey).update({
            lawyerSellerId: lawyerId
        });
        yield db.ref('server').child('operationHub').child(userId).child('operations').child(operationKey).update({
            lawyerId: lawyerId
        });
        yield db.ref('server').child('FlowInstance').child(flowId).update({
            lawyerBuyerId: lawyerId
        });
    });
}
exports.updateSellerOrderLaweyer = updateSellerOrderLaweyer;
function getPendingOrder(userId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('pendingOrders')
                    .child(project)
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
                        });
                        let activeOrders = result.filter((order) => order.active && !order.cancelOrder);
                        if (activeOrders.length > 0) {
                            resolve(activeOrders[0]);
                        }
                        resolve({});
                    }
                    resolve({});
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getPendingOrder = getPendingOrder;
function getUserFlowInstances(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let buyerInstances = yield getUserFlowInstanceByRole('buyerId', userId);
        console.log(`buyerInstances ${JSON.stringify(buyerInstances)}`);
        let sellerrInstances = yield getUserFlowInstanceByRole('sellerId', userId);
        console.log(`sellerrInstances ${JSON.stringify(sellerrInstances)}`);
        let buyerLawyerInstances = yield getUserFlowInstanceByRole('lawyerBuyerId', userId);
        console.log(`buyerLawyerInstances ${JSON.stringify(buyerLawyerInstances)}`);
        let sellerLawyerInstances = yield getUserFlowInstanceByRole('lawyerSellerId', userId);
        console.log(`sellerLawyerInstances ${JSON.stringify(sellerLawyerInstances)}`);
        let result = []
            .concat(buyerInstances)
            .concat(sellerrInstances)
            .concat(buyerLawyerInstances)
            .concat(sellerLawyerInstances);
        return result;
    });
}
exports.getUserFlowInstances = getUserFlowInstances;
function getUserFlowInstanceByRole(role, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('FlowInstance').orderByChild(role).equalTo(userId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
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
exports.getUserFlowInstanceByRole = getUserFlowInstanceByRole;
function getAllUserPendingOrders(userId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('projects').child('pendingOrders').child(project).once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
                        });
                        let activeOrders = result.filter((order) => order.active && !order.cancelOrder);
                        activeOrders = activeOrders.filter((order) => order.userId === userId ||
                            order.sellerId === userId ||
                            order.lawyerSellerId === userId ||
                            order.lawyerBuyerId);
                        resolve(activeOrders);
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
exports.getAllUserPendingOrders = getAllUserPendingOrders;
function getPendingOrderByGroup(userId, project, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('pendingOrders')
                    .child(project)
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
                        });
                        let activeOrders = result.filter((order) => order.active && !order.cancelOrder && groupId === order.group);
                        if (activeOrders.length > 0) {
                            resolve(activeOrders[0]);
                        }
                        resolve({});
                    }
                    resolve({});
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getPendingOrderByGroup = getPendingOrderByGroup;
function getUserPendingOrders(project, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('pendingOrders')
                    .child(project)
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let order = results[key];
                            order.key = key;
                            return order;
                        });
                        resolve(result);
                        return;
                    }
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserPendingOrders = getUserPendingOrders;
function getPendingOrderById(pendingOrderId, project, caseId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('projects')
                    .child('pendingOrders')
                    .child(project)
                    .child(pendingOrderId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        results.id = pendingOrderId;
                        if (caseId) {
                            results.caseId = caseId;
                        }
                    }
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getPendingOrderById = getPendingOrderById;
function getProjectStatus(project, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let projectAsk = yield getProjectInitialAsk(project);
        if (projectAsk) {
            console.log(`projectAsk ${JSON.stringify(projectAsk)}`);
            if (projectAsk.active) {
                if (userId) {
                    let userPendingOrder = yield getUserPendingOrders(project, userId);
                    console.log(`pendingOrders ${JSON.stringify(userPendingOrder)}`);
                    if (userPendingOrder && userPendingOrder.length > 0) {
                        let rejectedOrders = userPendingOrder.filter((order) => order.status === 'REJECTED');
                        console.log(`rejectedOrders ${JSON.stringify(rejectedOrders)}`);
                        if (rejectedOrders.length > 0) {
                            console.log(`REJECTED `);
                            return 'REJECTED';
                        }
                        let activeOrders = userPendingOrder.filter((order) => order.active);
                        if (activeOrders.length > 0) {
                            return 'INPROCESS';
                        }
                    }
                }
                return 'OPEN';
            }
            return 'CLOSED';
        }
        return 'OPEN';
    });
}
exports.getProjectStatus = getProjectStatus;
function updatePendingOrder(request, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(`pendingOrder ${JSON.stringify(request)}`);
        let order = yield getPendingOrder(userId, request.project);
        console.log(`userId ${JSON.stringify(userId)}`);
        console.log(`userId ${JSON.stringify(order)}`);
        let pemdingOrderId = yield db.ref(`server/projects/pendingOrders/${request.project}/${order.key}`).update({
            price: request.investPrice || 1,
            active: request.active,
            status: request.status ? request.status : '',
            amount: request.investAmount || ''
        }).key;
        console.log(`pending order created ${pemdingOrderId}`);
        addNotification(userId, 'orderRequest', 'orderUpdated');
        if (order.groupId) {
            db.ref(`/server/groups/changed/${request.project}`).update({ time: new Date().getTime() });
        }
        return pemdingOrderId;
    });
}
exports.updatePendingOrder = updatePendingOrder;
function createPendingRequest(pendingOrder, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(`pendingOrder ${JSON.stringify(pendingOrder)}`);
        let project = yield getProjectEntity(pendingOrder.project, 'projects');
        let pemdingOrderId = db.ref(`server/projects/pendingOrders/${pendingOrder.project}`).push({
            active: true,
            project: pendingOrder.project,
            flowType: project.flowType ? project.flowType : 'NONE',
            sellerId: project.owner
                ? project.owner
                : project.entrepreneur && project.entrepreneur ? project.entrepreneur.user : '',
            lawyerSellerId: project.projectLawyer ? project.projectLawyer.user : '',
            userId: userId,
            price: pendingOrder.investPrice ? pendingOrder.investPrice : 1,
            amount: pendingOrder.investAmount ? pendingOrder.investAmount : project.target,
            group: pendingOrder.groupId ? pendingOrder.groupId : '',
            reserved: false
        }).key;
        console.log(`pending order created ${pemdingOrderId}`);
        if (pemdingOrderId.flowType == 'NONE') {
            db.ref('/server/operations/events/processOrder/').push({
                active: true,
                projectAddress: pendingOrder.project,
                pendingOrderId: pemdingOrderId,
                userId: userId
            });
            db.ref('/server/operations/events/triggerProcessOrder/').update({
                time: new Date().getTime()
            });
        }
        addNotification(userId, 'orderRequest', 'orderSubmited');
        if (pemdingOrderId.groupId) {
            db.ref(`/server/groups/changed/${pendingOrder.project}`).update({ time: new Date().getTime() });
        }
        db.ref('server/taskScheduler/trigger').update({ time: new Date().getTime() });
        return pemdingOrderId;
    });
}
exports.createPendingRequest = createPendingRequest;
//# sourceMappingURL=utils.js.map