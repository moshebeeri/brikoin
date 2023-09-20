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
const limit_order_book_1 = require("limit-order-book");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// TODO: Remember to set token using >> firebase functions:config:set server.root="Firebase server root"
exports.inititalOffering = functions.database.ref(`server/operations/project/initialOffer`).onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    try {
        let operation = yield nextOperation();
        if (operation) {
            let key = Object.keys(operation)[0];
            operation[key].executed = true;
            addProjectAsk(operation[key].projectId, operation[key].amount, operation[key].name, operation[key].userId);
            let executionPath = db.ref('server').child('operations').child('project').child('initialOffer').child(key);
            executionPath.set(operation[key]);
        }
    }
    catch (error) {
        log(JSON.stringify(error));
    }
}));
function nextOperation() {
    return __awaiter(this, void 0, void 0, function* () {
        let nextOperation = yield getNextOperation();
        return nextOperation;
    });
}
function getNextOperation() {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/operations/project/initialOffer`).orderByChild("executed").equalTo(false).limitToFirst(1).on("value", function (snapshot) {
                resolve(snapshot.val());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getProjectById(projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/projectsCollections/projects`).orderByChild("address").equalTo(projectAddress).on("value", function (snapshot) {
                let results = snapshot.val();
                if (results) {
                    let orders = Object.keys(results).map(key => {
                        let order = results[key];
                        order.id = key;
                        return order;
                    });
                    resolve(orders[0]);
                }
                resolve('');
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getAuctionRequest(projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/projects/events/auctionOrdersRequest`).orderByChild("projectId").equalTo(projectAddress).on("value", function (snapshot) {
                let results = snapshot.val();
                if (results) {
                    let orders = Object.keys(results).map(key => {
                        let order = results[key];
                        order.id = key;
                        return order;
                    });
                    resolve(orders[0]);
                }
                resolve('');
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function addProjectAsk(projectId, amount, name, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield getProjectById(projectId);
        const db = admin.database();
        let ask = {
            active: true,
            projectId: projectId,
            size: amount,
            name: name,
            side: 'ask',
            price: 1,
            state: 'initial',
            user: userId,
            time: new Date().getTime()
        };
        console.log(JSON.stringify(project));
        if (project.tradeMethod === 'auction') {
            let auctionRequest = yield getAuctionRequest(projectId);
            console.log(auctionRequest);
            let auctionAsk = {
                amount: amount,
                name: name,
                price: 1,
                state: 'initial',
                reservedPrice: 1,
                userId: 'admin',
                projectId: projectId,
                size: amount,
                active: true,
                dueDate: auctionRequest.dueDate,
                time: new Date().getTime()
            };
            db.ref(`server/projects/events/auctionOrders/${projectId}`).child(auctionRequest.id).child('ask').push(auctionAsk);
        }
        else {
            db.ref(`server/projects/orders/${projectId}`).child('ask').push(ask);
        }
        db.ref(`server/projects/events/initialProject/`).set({ projectId: projectId });
    });
}
function log(message) {
    console.log(message);
}
exports.trade = functions.database.ref(`server/projects/events/orders`).onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    try {
        let resultChange = JSON.parse(JSON.stringify(change));
        let projectId = resultChange.after.projectId;
        let bidsOrders = yield getActiveBids(projectId);
        let asksOrders = yield getActiveAsks(projectId);
        console.log('bidsOrders: ' + JSON.stringify(bidsOrders));
        console.log('asksOrders: ' + JSON.stringify(asksOrders));
        calculateOrders(projectId, bidsOrders, asksOrders);
        updateTransactionDone(projectId);
    }
    catch (error) {
        log('error');
    }
}));
function updateTransactionDone(projectId) {
    const db = admin.database();
    db.ref(`server/projects/events/ordersDone`).set({ projectId: projectId, time: new Date().getTime() });
}
function calculateOrders(projectId, bidsOrders, asksOrders) {
    try {
        let projectOrders = [];
        if (bidsOrders) {
            projectOrders = Object.keys(bidsOrders).map(key => {
                let result = bidsOrders[key];
                result.orderId = key;
                return result;
            }).sort(compare);
        }
        if (asksOrders) {
            let projectAskOrders = Object.keys(asksOrders).map(key => {
                let result = asksOrders[key];
                result.orderId = key;
                return result;
            });
            projectOrders = projectOrders.concat(projectAskOrders).sort(compare);
        }
        let orderBook = new limit_order_book_1.LimitOrderBook();
        let orderIdUserId = {};
        projectOrders.forEach(order => {
            orderIdUserId[order.orderId] = { userId: order.user, projectAddress: order.projectId, mortgage: order.isMortgage, order: order };
        });
        log('project orders map:   ' + JSON.stringify(orderIdUserId));
        let transactionResult;
        projectOrders.forEach(order => {
            let limitOrder = new limit_order_book_1.LimitOrder(order.orderId, order.side, order.price, order.size);
            transactionResult = orderBook.add(limitOrder);
            log(JSON.stringify(transactionResult));
            handleOrderResults(transactionResult, projectId, orderIdUserId);
        });
    }
    catch (error) {
        log('error during calculation');
    }
}
function moveToHistory(projectId, orderId, side, size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = admin.database();
            let order = yield getOrder(projectId, orderId, side);
            let orderO = JSON.parse(JSON.stringify(order));
            orderO.size = size;
            db.ref(`server/projects/orders`).child(projectId).child('history').child(side).push(orderO);
            db.ref(`server/projects/orders`).child(projectId).child(side).child(orderId).set(null);
        }
        catch (error) {
            log('error during moveToHistory ' + error);
        }
    });
}
function writeToblockchain(orderIdToUserId, transactionResult) {
    log('writeToblockchain start');
    try {
        const db = admin.database();
        let trades = transactionResult.makers.map(maker => {
            log(JSON.stringify(maker));
            let askOrderId = maker.side === 'bid' ? transactionResult.taker.orderId : maker.orderId;
            let bidOrderId = maker.side === 'bid' ? maker.orderId : transactionResult.taker.orderId;
            return {
                seller: orderIdToUserId[askOrderId].userId,
                amount: parseInt(JSON.stringify(maker.valueRemoved / maker.price)),
                price: maker.price,
                projectAddress: orderIdToUserId[askOrderId].projectAddress,
                buyer: orderIdToUserId[bidOrderId].userId,
                active: true,
                isBidMortgage: orderIdToUserId[bidOrderId].mortgage ? true : false,
                isAskMortgage: orderIdToUserId[askOrderId].mortgage ? true : false,
                buyerMortgageAddress: orderIdToUserId[bidOrderId].mortgage ? orderIdToUserId[bidOrderId].order.mortgageAddress : 0,
                buyerMortgageRequestId: orderIdToUserId[bidOrderId].mortgage ? orderIdToUserId[bidOrderId].order.mortgageRequestId : 0,
                buyerMortgageId: orderIdToUserId[bidOrderId].mortgage ? orderIdToUserId[bidOrderId].order.mortgageId : 0,
                sellerMortgageAddress: orderIdToUserId[askOrderId].mortgage ? orderIdToUserId[askOrderId].order.mortgageAddress : 0,
                sellerMortgageRequestId: orderIdToUserId[askOrderId].mortgage ? orderIdToUserId[askOrderId].order.mortgageRequestId : 0,
                sellerMortgageId: orderIdToUserId[askOrderId].mortgage ? orderIdToUserId[askOrderId].order.mortgageId : 0
            };
        });
        console.log("TRADES");
        console.log(JSON.stringify(trades));
        trades.forEach(trade => {
            db.ref(`server/operations/events`).child('tradeEvent').push(trade);
            if (trade.isBidMortgage) {
                let order = orderIdToUserId[transactionResult.taker.orderId].order;
                order.status = 'new';
                db.ref(`server/mortgagesPayment`).push(order);
            }
        });
        db.ref(`server/operations/events`).child('tradeEventTrigger').set({ time: new Date().getTime() });
    }
    catch (error) {
        log('error during writeToblockchain ' + error);
    }
    log('writeToblockchain end');
}
function handleOrderResults(transactionResult, projectId, orderIdUserid) {
    const db = admin.database();
    let makers = transactionResult.makers;
    try {
        if (makers.length > 0) {
            writeToblockchain(orderIdUserid, transactionResult);
            db.ref(`server/projects/trades`).child(projectId).push(transactionResult);
            makers.forEach(maker => {
                db.ref(`server/projects/orders`).child(projectId).child(maker.side).child(maker.orderId).update({ size: maker.sizeRemaining });
                if (maker.sizeRemaining === 0) {
                    moveToHistory(projectId, maker.orderId, maker.side, maker.size);
                }
                let historyOrder = {
                    price: maker.price,
                    user: orderIdUserid[transactionResult.taker.orderId].userId,
                    buyer: orderIdUserid[transactionResult.taker.orderId].userId,
                    seller: orderIdUserid[maker.orderId].userId,
                    size: parseInt(JSON.stringify(maker.valueRemoved / maker.price)),
                    timestamp: new Date().getTime(),
                    isBidMortgage: orderIdUserid[transactionResult.taker.orderId].mortgage ? true : false,
                    isAskMortgage: orderIdUserid[maker.orderId].mortgage ? true : false,
                    buyerMortgageAddress: orderIdUserid[transactionResult.taker.orderId].mortgage ? orderIdUserid[transactionResult.taker.orderId].order.mortgageAddress : 0,
                    buyerMortgageRequestId: orderIdUserid[transactionResult.taker.orderId].mortgage ? orderIdUserid[transactionResult.taker.orderId].order.mortgageRequestId : 0,
                    buyerMortgageId: orderIdUserid[transactionResult.taker.orderId].mortgage ? orderIdUserid[transactionResult.taker.orderId].order.mortgageId : 0,
                    sellerMortgageAddress: orderIdUserid[maker.orderId].mortgage ? orderIdUserid[maker.orderId].order.mortgageAddress : 0,
                    sellerMortgageRequestId: orderIdUserid[maker.orderId].mortgage ? orderIdUserid[maker.orderId].order.mortgageRequestId : 0,
                    sellerMortgageId: orderIdUserid[maker.orderId].mortgage ? orderIdUserid[maker.orderId].order.mortgageId : 0
                };
                db.ref(`server/projects/tradesHistory`).child(projectId).push(historyOrder);
            });
        }
        let taker = transactionResult.taker;
        if (taker && taker.orderId) {
            db.ref(`server/projects/orders`).child(projectId).child(taker.side).child(taker.orderId).update({ size: taker.sizeRemaining });
            if (taker.sizeRemaining == 0) {
                moveToHistory(projectId, taker.orderId, taker.side, taker.size);
            }
        }
    }
    catch (error) {
        log('error during handleOrderResults ' + error);
    }
}
function compare(a, b) {
    if (a.time < b.time)
        return -1;
    if (a.time > b.time)
        return 1;
    return 0;
}
function getActiveBids(projectId) {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/projects/orders`).child(projectId).child('bid').on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getOrder(projectId, orderId, side) {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/projects/orders`).child(projectId).child(side).child(orderId).on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getActiveAsks(projectId) {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/projects/orders`).child(projectId).child('ask').on('value', function (snapshot) {
                resolve(snapshot.val());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
//# sourceMappingURL=order-book-functions.js.map