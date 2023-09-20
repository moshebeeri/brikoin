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
// TODO: Remember to set token using >> firebase functions:config:set server.root="Firebase server root"
exports.tradeAuction6 = functions.database.ref(`server/projects/events/calcAuction`).onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    const db = admin.database();
    console.log(change);
    let auctionId = yield getCurrentAuctionId();
    let request = yield getAuctionsRequest(auctionId);
    if (request.auctionId) {
        let bidsOrders = yield getBidRequests(request.projectId, request.auctionId);
        let askRequest = yield getAskRequests(request.projectId, request.auctionId);
        console.log(bidsOrders);
        console.log(askRequest);
        let result = calculateOrders(request.type, bidsOrders, askRequest);
        setOrdersInactive(request.projectId, auctionId, bidsOrders, askRequest);
        setAuctionInActive(auctionId, result);
        updateTransactionDone(request.projectId);
        db.ref('server/projects/events/auctionOrdersRequest').child(request.auctionId).set({ active: false });
    }
}));
function getBidRequests(projectId, auctionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref(`server/projects/events/auctionOrders`).child(projectId).child(auctionId).child('bid').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let orders = Object.keys(results).map(key => {
                            let order = results[key];
                            order.id = key;
                            return order;
                        });
                        resolve(orders);
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
function getAskRequests(projectId, auctionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref(`server/projects/events/auctionOrders`).child(projectId).child(auctionId).child('ask').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let orders = Object.keys(results).map(key => {
                            let order = results[key];
                            order.id = key;
                            return order;
                        });
                        resolve(orders);
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
function getAuctionsRequest(auctionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server/projects/events/auctionOrdersRequest').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    console.log('auctionId ' + auctionId);
                    if (results) {
                        let orders = Object.keys(results).map(key => {
                            let order = results[key];
                            order.auctionId = key;
                            return order;
                        }).filter(order => order.auctionId === auctionId);
                        console.log(orders);
                        if (orders.length > 0) {
                            resolve(orders[0]);
                        }
                        else {
                            reject('auction not found or is not active ' + auctionId);
                        }
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getCurrentAuctionId() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server/projects/events/calcAuction').once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    resolve(results.auctionId);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function calcFinalPrice(reservedOrders, winingOrders, type) {
    if (winingOrders.length === 0) {
        return 0;
    }
    if (type === 'dutch') {
        if (reservedOrders.length > 0) {
            let price = reservedOrders[0].price;
            reservedOrders.forEach(order => {
                if (price < order.price) {
                    price = order.price;
                }
            });
            return price;
        }
        let price = winingOrders[0].price;
        winingOrders.forEach(order => {
            if (order.price > price) {
                price = order.price;
            }
        });
        return price;
    }
    else {
        if (reservedOrders.length > 0) {
            let price = reservedOrders[0].price;
            reservedOrders.forEach(order => {
                if (price > order.price) {
                    price = order.price;
                }
            });
            return price;
        }
        let price = winingOrders[0].price;
        winingOrders.forEach(order => {
            if (order.price < price) {
                price = order.price;
            }
        });
        return price;
    }
}
function updateTransactionDone(projectId) {
    const db = admin.database();
    db.ref(`server/projects/events/ordersDone`).set({ projectId: projectId, time: new Date().getTime() });
}
function getWiningAsks(amount, orders) {
    let sortedOrders = orders.sort(compareDutch);
    let winingOrders = [];
    let currentAmount = 0;
    let index = 0;
    while (currentAmount < amount && index < sortedOrders.length) {
        currentAmount = currentAmount + sortedOrders[index].amount;
        winingOrders.push(sortedOrders[index]);
        index = index + 1;
    }
    let reservedOrders = [];
    while (index < sortedOrders.length) {
        reservedOrders.push(sortedOrders[index]);
        index = index + 1;
    }
    return { orders: winingOrders, reserved: reservedOrders };
}
function getWiningBids(amount, orders) {
    let sortedOrders = orders.sort(compareEnglish);
    let winingOrders = [];
    let currentAmount = 0;
    let index = 0;
    while (currentAmount < amount && index < sortedOrders.length) {
        currentAmount = currentAmount + sortedOrders[index].size;
        winingOrders.push(sortedOrders[index]);
        index = index + 1;
    }
    let reservedOrders = [];
    while (index < sortedOrders.length) {
        reservedOrders.push(sortedOrders[index]);
        index = index + 1;
    }
    return { orders: winingOrders, reserved: reservedOrders };
}
function setAuctionInActive(auctionId, result) {
    const db = admin.database();
    db.ref(`server/projects/events/`).child('auctionOrdersRequest').child(auctionId).update({ active: false, volume: result.volume, finalPrice: result.finalPrice });
}
function setOrdersInactive(projectId, auctionId, bidsOrders, askOrders) {
    bidsOrders.forEach(order => {
        setOrderInactive('bid', order.id, projectId, auctionId);
    });
    askOrders.forEach(order => {
        setOrderInactive('ask', order.id, projectId, auctionId);
    });
}
function setOrderInactive(type, orderId, projectId, auctionId) {
    const db = admin.database();
    db.ref(`server/projects/events/`).child('auctionOrders').child(projectId).child(auctionId).child(type).child(orderId).update({ active: false });
}
function calculateOrders(type, bidsOrders, askOrders) {
    console.log('STARTT CALC');
    if (type === 'dutch') {
        console.log('DUTCH');
        let orders = getWiningAsks(bidsOrders[0].amount, askOrders);
        let price = calcFinalPrice(orders.reserved, orders.orders, type);
        writeToblockchain(bidsOrders[0], orders.orders, type, price);
        return { finalPrice: price, volume: bidsOrders[0].amount };
    }
    else {
        console.log('ENGLISH');
        let orders = getWiningBids(askOrders[0].amount, bidsOrders);
        console.log(JSON.stringify(orders));
        let price = calcFinalPrice(orders.reserved, orders.orders, type);
        console.log(price);
        writeToblockchain(askOrders[0], orders.orders, type, price);
        return { finalPrice: price, volume: askOrders[0].amount };
    }
}
function writeToblockchain(order, winingOrders, type, finalPrice) {
    const db = admin.database();
    let totalAmount = order.amount;
    let trades = winingOrders.map(winingOrder => {
        let amount = totalAmount > winingOrder.size ? winingOrder.size : totalAmount;
        totalAmount = totalAmount - winingOrder.size;
        return {
            seller: type === 'dutch' ? winingOrder.userId : order.userId,
            amount: amount,
            price: finalPrice,
            projectAddress: order.projectId,
            buyer: type === 'dutch' ? order.userId || order.user : winingOrder.userId || winingOrder.user,
            active: true,
            isBidMortgage: type === 'dutch' ? order.mortgage ? true : false : winingOrder.mortgage ? true : false,
            isAskMortgage: type === 'dutch' ? winingOrder.mortgage ? true : false : order.mortgage ? true : false,
            buyerMortgageAddress: type === 'dutch' ? order.mortgage ? order.mortgageAddress : 0 : winingOrder.mortgage ? winingOrder.mortgageAddress : 0,
            buyerMortgageRequestId: type === 'dutch' ? order.mortgage ? order.mortgageRequestId : 0 : winingOrder.mortgage ? winingOrder.mortgageRequestId : 0,
            buyerMortgageId: type === 'dutch' ? order.mortgage ? order.mortgageId : 0 : winingOrder.mortgage ? winingOrder.mortgageId : 0,
            sellerMortgageAddress: type === 'dutch' ? winingOrder.mortgage ? winingOrder.mortgageAddress : 0 : order.mortgage ? order.mortgageAddress : 0,
            sellerMortgageRequestId: type === 'dutch' ? winingOrder.mortgage ? winingOrder.mortgageRequestId : 0 : order.mortgage ? order.mortgageRequestId : 0,
            sellerMortgageId: type === 'dutch' ? winingOrder.mortgage ? winingOrder.mortgageId : 0 : order.mortgage ? order.mortgageId : 0,
        };
    });
    trades.forEach(trade => {
        db.ref(`server/operations/events`).child('tradeEvent').push(trade);
        // if(trade.isBidMortgage){
        //     let order =  orderIdToUserId[transactionResult.taker.orderId].order
        //     order.status = 'new'
        //     db.ref(`server/mortgagesPayment`).push(order)
        // }
    });
    db.ref(`server/operations/events`).child('tradeEventTrigger').set({ time: new Date().getTime() });
}
function compareDutch(a, b) {
    if (a.price === b.price) {
        if (a.time < b.time)
            return -1;
        if (a.time > b.time)
            return 1;
        return 0;
    }
    if (a.price < b.price) {
        return -1;
    }
    return 1;
}
function compareEnglish(a, b) {
    if (a.price === b.price) {
        if (a.time < b.time)
            return -1;
        if (a.time > b.time)
            return 1;
        return 0;
    }
    if (a.price > b.price) {
        return -1;
    }
    return 1;
}
//# sourceMappingURL=auction-book.js.map