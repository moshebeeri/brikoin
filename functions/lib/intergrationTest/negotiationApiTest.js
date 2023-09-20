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
const negotiationUtils_1 = require("../operations/negotiationUtils");
const utils_1 = require("../operations/utils");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const runtimeOpts = {
    timeoutSeconds: 540
};
const users = ['bFLhkVLR3wSOCpxYTmRJAjuQgV52', 'AMCPqDVdLuNIJBdaucDl6mm99kg2'];
const SELLER_OPERATION_ID = 1111112;
const BUYER_OPERATION_ID = 111111;
const project = '0x0970DDc8690155cab58a6f7c22E3bDD3aEe9BF78';
const pendingOrder = '-M5Gi2SL1beVAzqwpcTB';
exports.testNegotiationFlow = functions
    .runWith(runtimeOpts)
    .database.ref(`server/test/negotiation/trigger`)
    .onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    let sellerOperation = yield createNegotiaionOperation(users[0], 'SELLER', '', users[1], SELLER_OPERATION_ID);
    let buyerOperation = yield createNegotiaionOperation(users[1], 'BUYER', users[0], '', BUYER_OPERATION_ID);
    yield negotiationUtils_1.sendOffer(buyerOperation, 100, users[0]);
    let offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 100)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 100)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    yield negotiationUtils_1.counterOffer(sellerOperation, 150, users[1]);
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 150)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 150)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    yield negotiationUtils_1.counterOffer(buyerOperation, 140, users[1]);
    offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 140)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 140)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    let allOffers = yield negotiationUtils_1.getOffers(sellerOperation, users[1]);
    if (allOffers.length !== 3) {
        console.log(`failed allOffers sellerOperation ${JSON.stringify(allOffers)}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(allOffers)}`);
        return;
    }
    yield negotiationUtils_1.approveOffer(sellerOperation, offers[0].id, users[0]);
    let order = yield utils_1.getPendingOrderById(pendingOrder, project, '');
    if (order.amount !== 140) {
        console.log(`failed approveOrder order ${JSON.stringify(order)}`);
        testDone(`failed approveOrder order ${JSON.stringify(order)}`);
        return;
    }
    buyerOperation = (yield utils_1.getOperationByid(users[1], buyerOperation.id));
    if (buyerOperation.status !== 'operationDone') {
        console.log(`failed buyerOperation status ${JSON.stringify(buyerOperation)}`);
        testDone(`failed buyerOperation status ${JSON.stringify(buyerOperation)}`);
        return;
    }
    sellerOperation = (yield utils_1.getOperationByid(users[0], sellerOperation.id));
    if (sellerOperation.status !== 'operationDone') {
        console.log(`failed sellerOperation status ${JSON.stringify(sellerOperation)}`);
        testDone(`failed sellerOperation status ${JSON.stringify(sellerOperation)}`);
        return;
    }
    testDone('succses');
}));
exports.testNegotiationRejectFlow = functions
    .runWith(runtimeOpts)
    .database.ref(`server/test/negotiation/triggerReject`)
    .onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    let sellerOperation = yield createNegotiaionOperation(users[0], 'SELLER', '', users[1], SELLER_OPERATION_ID);
    let buyerOperation = yield createNegotiaionOperation(users[1], 'BUYER', users[0], '', BUYER_OPERATION_ID);
    yield negotiationUtils_1.sendOffer(buyerOperation, 100, users[0]);
    let offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 100)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 100)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    yield negotiationUtils_1.counterOffer(sellerOperation, 150, users[1]);
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 150)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 150)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    yield negotiationUtils_1.counterOffer(buyerOperation, 140, users[1]);
    offers = yield negotiationUtils_1.getActiveOffers(buyerOperation);
    if (!validateOffer(offers[0], 140)) {
        console.log(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer buyerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    offers = yield negotiationUtils_1.getActiveOffers(sellerOperation);
    if (!validateOffer(offers[0], 140)) {
        console.log(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(offers[0])}`);
        return;
    }
    let allOffers = yield negotiationUtils_1.getOffers(sellerOperation, users[1]);
    if (allOffers.length !== 3) {
        console.log(`failed allOffers sellerOperation ${JSON.stringify(allOffers)}`);
        testDone(`failed validateOffer sellerOperation ${JSON.stringify(allOffers)}`);
        return;
    }
    yield negotiationUtils_1.rejectOffer(sellerOperation, offers[0].id, users[0]);
    let order = yield utils_1.getPendingOrderById(pendingOrder, project, '');
    if (order.active === false) {
        console.log(`failed approveOrder order ${JSON.stringify(order)}`);
        testDone(`failed approveOrder order ${JSON.stringify(order)}`);
        return;
    }
    buyerOperation = (yield utils_1.getOperationByid(users[1], buyerOperation.id));
    if (buyerOperation.status !== 'operationDone') {
        console.log(`failed buyerOperation status ${JSON.stringify(buyerOperation)}`);
        testDone(`failed buyerOperation status ${JSON.stringify(buyerOperation)}`);
        return;
    }
    sellerOperation = (yield utils_1.getOperationByid(users[0], sellerOperation.id));
    if (sellerOperation.status !== 'operationDone') {
        console.log(`failed sellerOperation status ${JSON.stringify(sellerOperation)}`);
        testDone(`failed sellerOperation status ${JSON.stringify(sellerOperation)}`);
        return;
    }
    testDone('succses');
}));
function validateOffer(offer, amount) {
    if (!offer) {
        return false;
    }
    if (offer.amount !== amount) {
        return false;
    }
    return true;
}
function createNegotiaionOperation(userId, side, sellerId, buyerId, operationId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let operation = {
            flowInstance: '-M5Gi4uZgQYhTnaXQY9S',
            name: 'negotiation',
            operationId: operationId,
            orderId: pendingOrder,
            project: project,
            seller: sellerId ? sellerId : '',
            buyer: buyerId ? buyerId : '',
            sellerOperationId: SELLER_OPERATION_ID,
            buyerOperationId: BUYER_OPERATION_ID,
            side: side,
            status: 'waiting',
            time: new Date().getTime(),
            type: 'simpleNegotiation'
        };
        let id = yield db.ref('server').child(`/operationHub/${userId}/operations`).push(operation).key;
        operation['id'] = id;
        return operation;
    });
}
function testDone(status) {
    let db = admin.database();
    db.ref('server').child(`/operationHub/${users[0]}/operations`).remove();
    db.ref('server').child(`/operationHub/${users[1]}/operations`).remove();
    db.ref('server').child(`/negotiation/-M5Gi4uZgQYhTnaXQY9S`).remove();
    db.ref('server').child(`/projects/pendingOrders/${project}/${pendingOrder}`).update({
        active: true,
        amount: '',
        price: ''
    });
    db.ref('test').child(`negotiation`).set({ result: status });
}
//# sourceMappingURL=negotiationApiTest.js.map