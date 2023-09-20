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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils_1 = require("./utils");
exports.bidAsk6 = functions.database.ref(`server/operations/events/internalTradeTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('START BID/ASL');
    let tradeRequest = yield utils_1.getInternalTrades();
    console.log(JSON.stringify(tradeRequest));
    if (tradeRequest) {
        yield db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({ active: false });
        let userAccount = yield utils_1.getUserActiveAccount(tradeRequest.user);
        let admin = yield utils_1.getAdminAccount('bidAsk');
        // await transferEtherFromAdmin(admin.accountId, admin.privateKey, userAccount.accountId)
        if (tradeRequest.type === 'EXTERNAL') {
            console.log('START BID/ASL EXTERNAL');
            yield handleBidAskSuccsess(tradeRequest, userAccount, 'EXTERNAL');
            return;
        }
        // await transferEtherFromAdmin( admin.accountId, userAccount.accountId)
        let response;
        if (tradeRequest.isMortgage) {
            if (tradeRequest.side === 'bid') {
                console.log('****  MORTGAGE BID  *****');
                response = (yield wallet_1.projectBidMortgageRequest(userAccount.accountId, userAccount.privateKey, tradeRequest, admin.accountId, admin.privateKey, 0));
                if (response.success) {
                    yield db.ref('server').child('/mortgages').child(tradeRequest.mortgageId).child('mortgagesRequests').child(tradeRequest.mortgageRequestId).update({ trade: true });
                }
            }
            else {
                console.log('****  MORTGAGE ASK  *****');
                response = (yield wallet_1.projectAskMortgageRequest(userAccount.accountId, userAccount.privateKey, tradeRequest, 0));
                console.log('ASK MORTGAGE DONE');
            }
        }
        else {
            console.log('****  STANDARD BID  *****');
            console.log(userAccount.accountId + ' ' + userAccount.privateKey + ' ' + tradeRequest.projectId + ' ' + tradeRequest.size + ' ' + tradeRequest.price);
            if (tradeRequest.side === 'bid') {
                response = (yield wallet_1.projectBidRequest(userAccount.accountId, tradeRequest.projectId, tradeRequest.size, tradeRequest.price, 0));
            }
            else {
                console.log('START ASK');
                response = (yield wallet_1.projectAskRequest(userAccount.accountId, tradeRequest.projectId, tradeRequest.size, tradeRequest.price, 0));
            }
        }
        console.log('****  RESPONSE  BID/ ASK  *****:' + JSON.stringify(response));
        if (response.success) {
            yield handleBidAskSuccsess(tradeRequest, userAccount, response);
        }
        else {
            db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({ active: true });
        }
    }
    console.log('########## Handling internal bid/ask end ############');
}));
let cancelBidOrder = function (tradeRequest, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastOffer = yield utils_1.getUserLastOffer(tradeRequest);
        let key = lastOffer.key;
        if (key) {
            yield db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).child(key).remove();
        }
        return lastOffer;
    });
};
let cancelBidAuctionOrder = function (tradeRequest, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let lastOffer = yield utils_1.getUserLastAuctionOffer(tradeRequest);
        let key = lastOffer.key;
        if (key) {
            yield db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
                .child(tradeRequest.auctionId).child(tradeRequest.side).child(key).remove();
        }
        return lastOffer;
    });
};
exports.cancelTrade2 = functions.database.ref(`server/operations/events/cancelTradeTriggerEvent`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('CANCEL INTERNAL ORDER');
    let db = admin.database();
    console.log('START INTERNAL ORDER');
    let tradeRequest = yield getInternalCancelTrades();
    console.log(JSON.stringify(tradeRequest));
    if (tradeRequest) {
        console.log('TRADE REQUEST ' + JSON.stringify(tradeRequest));
        let userAccount = yield utils_1.getUserActiveAccount(tradeRequest.user);
        yield db.ref('server').child('/operations/events/cancelTradeRequest').child(tradeRequest.key).update({ active: false });
        let response = {};
        if (tradeRequest.type === 'INTERNAL') {
            response = (yield wallet_1.projectCancelOrder(userAccount.accountId, userAccount.privateKey, tradeRequest.projectAddress));
            console.log('response ' + JSON.stringify(response));
        }
        else {
            response.success = true;
        }
        if (response.success) {
            yield utils_1.updateUserBalance(tradeRequest.user, userAccount.accountId, userAccount.id, '', '');
            tradeRequest.projectId = tradeRequest.projectAddress;
            let lastOffer = {};
            if (tradeRequest.auctionId) {
                lastOffer = yield cancelBidAuctionOrder(tradeRequest, db);
            }
            else {
                lastOffer = yield cancelBidOrder(tradeRequest, db);
            }
            if (lastOffer.mortgageAddress && lastOffer.mortgageId && lastOffer.mortgageRequestId) {
                yield db.ref('server').child('mortgages').child(lastOffer.mortgageId).child('mortgagesRequests').child(lastOffer.mortgageRequestId).update({ trade: false });
            }
            yield utils_1.updateProjectChange(tradeRequest.projectAddress);
        }
    }
    console.log('########## Handling internal bid/ask end ############');
}));
let updateBroker = function (buyer) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('UPDATE BROKER ACCOUNT BALANCE');
        let brokerAccount = yield utils_1.getUserActiveAccount(buyer.brokerAccount);
        yield utils_1.updateBrokerFees(brokerAccount.user_id, brokerAccount.accountId, brokerAccount.id, buyer.accountId);
        console.log('FINISH UPDATE BROKER ACCOUNT BALANCE');
    });
};
let updateAdmin = function (trade, seller) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('UPDATE ADMIN ');
        yield utils_1.updateProjectHoldings(trade.seller, seller.accountId, trade.projectAddress);
        yield utils_1.updateUserBalance(trade.seller, seller.accountId, seller.id, '', '');
        console.log('FINISH UPDATE ADMIN ');
    });
};
let updateMortgageBalance = function (trade) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('UPDATE Mortgage balance');
        let mortgage = yield getMortgage(trade.buyerMortgageId);
        console.log('User: ' + mortgage.user);
        let userAccount = yield utils_1.getUserActiveAccount(mortgage.user);
        yield utils_1.updateMortgageeBalannce(mortgage.user, userAccount.accountId);
        console.log('FINISH UPDATE Mortgage balance');
    });
};
let getSellerAccount = function (trade, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        let seller;
        if (trade.seller === 'admin') {
            seller = admin;
        }
        else {
            seller = (yield utils_1.getUserActiveAccount(trade.seller));
        }
        return seller;
    });
};
exports.reserveBid = functions.database.ref(`server/operations/events/bidReservedTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let bidReservedRequest = yield utils_1.getActiveRequest('bidReserved');
    console.log('START reserveBid');
    if (bidReservedRequest && bidReservedRequest.project) {
        let userAccount = yield utils_1.getUserActiveAccount(bidReservedRequest.userId);
        console.log('START reserveBid ' + JSON.stringify(bidReservedRequest));
        db.ref('server').child('operations').child('events').child('bidReserved').child(bidReservedRequest.key).update({ active: false });
        let response = yield wallet_1.projectBidReserve(userAccount.accountId, userAccount.privateKey, bidReservedRequest.project);
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).update({ reserved: true });
            yield utils_1.updateUserBalance(bidReservedRequest.userId, userAccount.accountId, userAccount.id, '', bidReservedRequest.project);
            yield utils_1.updateTransactionDone(bidReservedRequest.project);
        }
    }
    console.log('END reserveBid');
}));
exports.cancelReserveBid = functions.database.ref(`server/operations/events/cancelBidReservedTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let bidReservedRequest = yield utils_1.getActiveRequest('cancelBidReserved');
    console.log('START reserveBid');
    if (bidReservedRequest && bidReservedRequest.project) {
        let userAccount = yield utils_1.getUserActiveAccount(bidReservedRequest.userId);
        console.log('START reserveBid ' + JSON.stringify(bidReservedRequest));
        db.ref('server').child('operations').child('events').child('cancelBidReserved').child(bidReservedRequest.key).update({ active: false });
        let response = yield wallet_1.cancelProjectBidReserve(userAccount.accountId, userAccount.privateKey, bidReservedRequest.project);
        if (response.success) {
            if (bidReservedRequest.deleteRequest) {
                db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).remove();
            }
            else {
                db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).update({ reserved: false });
            }
            yield utils_1.updateUserBalance(bidReservedRequest.userId, userAccount.accountId, userAccount.id, '', bidReservedRequest.project);
            yield utils_1.updateTransactionDone(bidReservedRequest.project);
        }
    }
    console.log('END reserveBid');
}));
exports.handleTrade3 = functions.database.ref(`server/operations/events/tradeEventTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('##### start trade ####');
    let trade = yield getActiveTrades();
    let adminAccount = yield utils_1.getAdminAccount('project');
    if (trade) {
        console.log('UPDATE trade :  ' + JSON.stringify(trade));
        yield db.ref('server').child('operations').child('events').child('tradeEvent').child(trade.key).update({ active: false });
        let buyer = yield utils_1.getUserActiveAccount(trade.buyer);
        let seller = yield getSellerAccount(trade, adminAccount);
        if (trade.isBidMortgage || trade.isAskMortgage) {
            console.log('MORTGAGE PROCESS START');
            if (trade.isBidMortgage) {
                yield createMortgagePaymentSchedule(trade.buyerMortgageAddress, trade.buyerMortgageRequestId, trade.buyerMortgageId);
            }
            let response = yield wallet_1.projectTradeMortgageRequest(buyer.accountId, seller.accountId, trade.amount, trade.price, adminAccount.accountId, adminAccount.privateKey, trade.projectAddress, trade.buyerMortgageAddress ? trade.buyerMortgageAddress : 0, trade.sellerMortgageAddress ? trade.sellerMortgageAddress : 0);
            console.log('MORTGAGE PROCESS');
            if (!response.success) {
                return;
            }
            console.log("TRADE RESPONSE " + JSON.stringify(response));
            if (trade.sellerMortgageAddress && parseInt(response.sellerTotalClearances) >= 0) {
                yield utils_1.updateUserClearances(seller, response.sellerTotalClearances, trade.sellerMortgageAddress, trade.amount, trade.price, false, trade.projectAddress);
            }
        }
        else {
            let response = yield wallet_1.projectTradeRequest(buyer.accountId, seller.accountId, trade.amount, trade.price, adminAccount.accountId, adminAccount.privateKey, trade.projectAddress);
            console.log("TRADE RESPONSE " + JSON.stringify(response));
            if (!response.success) {
                return;
            }
        }
        if (trade.isBidMortgage) {
            yield updateMortgageBalance(trade);
        }
        yield utils_1.updateProjectHoldings(trade.buyer, buyer.accountId, trade.projectAddress);
        yield utils_1.updateUserBalance(trade.buyer, buyer.accountId, buyer.id, '', '');
        if (buyer.brokerAccount) {
            yield updateBroker(buyer);
        }
        if (trade.seller !== 'admin') {
            yield updateAdmin(trade, seller);
        }
        //update pending order, order is done
        if (trade.pendingOrderId) {
            db.ref('server/projects/pendingOrders/').child(trade.projectAddress).child(trade.pendingOrderId).update({ active: false });
        }
        console.log('UPDATE PROJECT CHANGE ');
        yield utils_1.updateProjectChange(trade.projectAddress);
        console.log('FINISH UPDATE PROJECT CHANGE ');
        console.log('UPDATE GLOBAL FEES');
        yield utils_1.updateTotalFees(db, adminAccount);
        console.log('FINISH UPDATE GLOBAL FEES');
        yield db.ref('server/operations/events/tradeEventTrigger').update({ time: new Date().getTime() });
    }
    console.log('########## Handling internal trade end ############');
}));
function getMortgage(mortgageId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                console.log('Handle Mortgage request getter');
                db.ref('server').child('/mortgages/').child(mortgageId).once('value', function (snapshot) {
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
function getInternalCancelTrades() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/operations/events/cancelTradeRequest').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let trades = Object.keys(results).map(key => {
                            let trade = results[key];
                            trade.key = key;
                            return trade;
                        });
                        resolve(trades[0]);
                    }
                    return [];
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
let handleAuction = function (tradeRequest, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = yield utils_1.getUserLastAuctionOffer(tradeRequest);
        if (key) {
            yield db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
                .child(tradeRequest.auctionId).child(tradeRequest.side).child(key).update(tradeRequest);
        }
        else {
            yield db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
                .child(tradeRequest.auctionId).child(tradeRequest.side).push(tradeRequest);
        }
    });
};
let handleBidAskTrade = function (tradeRequest, db) {
    return __awaiter(this, void 0, void 0, function* () {
        let key = yield utils_1.getUserLastOffer(tradeRequest);
        if (key) {
            yield db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).child(key).update(tradeRequest);
        }
        else {
            yield db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).push(tradeRequest);
        }
        const triggerTrade = {
            projectId: tradeRequest.projectId,
            timestamp: new Date().getTime()
        };
        yield db.ref('server').child('projects').child('events').child('orders').set(triggerTrade);
    });
};
function handleBidAskSuccsess(tradeRequest, userAccount, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({ status: 'done' });
        yield utils_1.updateUserBalance(tradeRequest.user, userAccount.accountId, userAccount.id, '', '');
        if (tradeRequest.auctionId) {
            yield handleAuction(tradeRequest, db);
        }
        else {
            yield handleBidAskTrade(tradeRequest, db);
        }
        yield utils_1.updateProjectChange(tradeRequest.projectId);
        console.log(JSON.stringify(response));
    });
}
function createMortgagePaymentSchedule(mortgageAddress, buyerMortgageRequestId, buyerMortgageId) {
    let db = admin.database();
    db.ref('server').child('/operations/events/mortgagesPayment').push({
        mortgageAddress: mortgageAddress,
        buyerMortgageRequestId: buyerMortgageRequestId,
        buyerMortgageId: buyerMortgageId,
        active: true
    });
    db.ref('server').child('/operations/events/mortgagesPaymentTrigger').set({ time: new Date().getTime() });
}
function getActiveTrades() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/tradeEvent').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let trades = Object.keys(results).map(key => {
                            let trade = results[key];
                            trade.key = key;
                            return trade;
                        });
                        resolve(trades[0]);
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
//# sourceMappingURL=bidAsk.js.map