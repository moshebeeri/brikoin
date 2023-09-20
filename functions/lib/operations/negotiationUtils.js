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
const utils_1 = require("./utils");
const admin = require('firebase-admin');
function sendOffer(operation, offer, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let offerRequest = {
            active: true,
            time: new Date().getTime(),
            amount: offer,
            side: operation.side,
            userId: userId
        };
        if (validateRequest(userId, offerRequest, operation)) {
            yield db.ref('server').child(`/negotiation/${operation.flowInstance}`).push(offerRequest);
            yield utils_1.addNotificationWithParams(userId, 'negotiation', 'offerSended', {
                project: operation.project,
                flowId: operation.flowInstance
            });
            yield utils_1.addNotificationWithParams(operation.seller, 'negotiation', 'offerAccepted', {
                project: operation.project,
                flowId: operation.flowInstance
            });
            return 'DONE';
        }
        return 'FAILED';
    });
}
exports.sendOffer = sendOffer;
function approveOffer(operation, offerId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let offer = yield getOfferById(operation.flowInstance, offerId);
        if (yield validateRequest(userId, offer, operation)) {
            yield db.ref('server').child(`/negotiation/${operation.flowInstance}/${offerId}`).update({
                active: false,
                time: new Date().getTime(),
                status: 'APPROVED'
            });
            yield utils_1.updatePendingOrder({
                active: true,
                status: 'APPROVED',
                project: operation.project,
                investPrice: offer.investPrice || 1,
                investAmount: offer.amount
            }, operation.buyer || userId);
            let buyerOperation = operation.side === 'BUYER'
                ? operation
                : yield getOperationByUser('simpleNegotiation', operation.buyer, operation.flowInstance);
            console.log(`buyerOperation ${JSON.stringify(buyerOperation)}`);
            yield utils_1.addNotificationWithParams(buyerOperation.userId, 'negotiation', 'offerApproved', {
                project: buyerOperation.project,
                flowId: operation.flowInstance
            });
            let sellerOperation = operation.side === 'SELLER'
                ? operation
                : yield getOperationByUser('simpleNegotiation', operation.seller, operation.flowInstance);
            yield utils_1.addNotificationWithParams(sellerOperation.userId, 'negotiation', 'offerApproved', {
                project: sellerOperation.project,
                flowId: operation.flowInstance
            });
            console.log(`sellerOperation ${JSON.stringify(sellerOperation)}`);
            yield utils_1.updateOperationDone({
                id: buyerOperation.id,
                operationId: operation.side === 'BUYER' ? operation.operationId : operation.buyerOperationId,
                flowInstance: operation.flowInstance
            }, operation.side === 'BUYER' ? userId : operation.buyer);
            yield utils_1.updateOperationDone({
                id: sellerOperation.id,
                operationId: operation.side === 'SELLER' ? operation.operationId : operation.sellerOperationId,
                flowInstance: operation.flowInstance
            }, operation.side === 'SELLER' ? userId : operation.seller);
        }
    });
}
exports.approveOffer = approveOffer;
function getOperationByUser(operationType, userId, flowInstanceId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child(`/operationHub/${userId}/operations`)
                    .orderByChild('type')
                    .equalTo(operationType)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    let operations = Object.keys(results)
                        .map((key) => {
                        let offer = results[key];
                        offer.id = key;
                        return offer;
                    })
                        .filter((operation) => operation.status === 'waiting' && operation.flowInstance === flowInstanceId);
                    resolve(operations.length > 0 ? operations[0] : '');
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function validateRequest(userId, offer, operation) {
    return __awaiter(this, void 0, void 0, function* () {
        let operationFromDb = yield utils_1.getOperationByid(userId, operation.id);
        if (offer.side === 'BUYER') {
            return operationFromDb.side === 'SELLER' && offer.userId === operationFromDb.buyer;
        }
        if (offer.side === 'SELLER') {
            return operationFromDb.side === 'BUYER' && offer.userId === operationFromDb.seller;
        }
        return false;
    });
}
function getOfferById(flowInstance, offerId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child(`/negotiation/${flowInstance}/${offerId}`).once('value', function (snapshot) {
                    let result = snapshot.val();
                    result.id = offerId;
                    resolve(result);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getOfferById = getOfferById;
function getOffers(operation, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child(`/negotiation/${operation.flowInstance}/`).once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let offers = Object.keys(results).map((key) => {
                            let offer = results[key];
                            offer.id = key;
                            return offer;
                        });
                        resolve(offers);
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
exports.getOffers = getOffers;
function getActiveOffers(operation) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db
                    .ref('server')
                    .child(`/negotiation/${operation.flowInstance}/`)
                    .orderByChild('active')
                    .equalTo(true)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    let offers = Object.keys(results).map((key) => {
                        let offer = results[key];
                        offer.id = key;
                        return offer;
                    });
                    resolve(offers);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getActiveOffers = getActiveOffers;
function rejectOffer(operation, offerId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let offer = yield getOfferById(operation.flowInstance, offerId);
        if (yield validateRequest(userId, offer, operation)) {
            yield db.ref('server').child(`/negotiation/${operation.flowInstance}/${offerId}`).update({
                active: false,
                time: new Date().getTime(),
                status: 'REJECTED'
            });
            yield utils_1.updatePendingOrder({
                project: operation.project,
                active: false,
                status: 'REJECTED',
                price: '',
                investAmount: ''
            }, operation.buyer || userId);
            let buyerOperation = operation.side === 'BUYER'
                ? operation
                : yield getOperationByUser('simpleNegotiation', operation.buyer, operation.flowInstance);
            console.log(`buyerOperation ${JSON.stringify(buyerOperation)}`);
            yield utils_1.addNotificationWithParams(buyerOperation.userId, 'negotiation', 'offerRejected', {
                project: buyerOperation.project,
                flowId: operation.flowInstance
            });
            let sellerOperation = operation.side === 'SELLER'
                ? operation
                : yield getOperationByUser('simpleNegotiation', operation.seller, operation.flowInstance);
            yield utils_1.addNotificationWithParams(sellerOperation.userId, 'negotiation', 'offerRejected', {
                project: sellerOperation.project,
                flowId: operation.flowInstance
            });
            console.log(`sellerOperation ${JSON.stringify(sellerOperation)}`);
            yield utils_1.updateOperationDone({
                id: buyerOperation.id,
                operationId: operation.side === 'BUYER' ? operation.operationId : operation.buyerOperationId,
                flowInstance: operation.flowInstance
            }, operation.side === 'BUYER' ? userId : operation.buyer);
            yield utils_1.updateOperationDone({
                id: sellerOperation.id,
                operationId: operation.side === 'SELLER' ? operation.operationId : operation.sellerOperationId,
                flowInstance: operation.flowInstance
            }, operation.side === 'SELLER' ? userId : operation.seller);
        }
    });
}
exports.rejectOffer = rejectOffer;
function counterOffer(operation, offer, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let offerRequest = {
            active: true,
            time: new Date().getTime(),
            amount: offer,
            price: 1,
            side: operation.side,
            userId: userId
        };
        if (validateRequest(userId, offerRequest, operation)) {
            yield updateAllOffersInActive(operation);
            yield utils_1.addNotificationWithParams(userId, 'negotiation', 'offerSended', {
                project: operation.project,
                flowId: operation.flowInstance
            });
            yield utils_1.addNotificationWithParams(operation.seller || operation.buyer, 'negotiation', 'offerAccepted', {
                project: operation.project,
                flowId: operation.flowInstance
            });
            yield db.ref('server').child(`/negotiation/${operation.flowInstance}`).push(offerRequest);
            return 'DONE';
        }
        return 'FAILED';
    });
}
exports.counterOffer = counterOffer;
function updateAllOffersInActive(operation) {
    return __awaiter(this, void 0, void 0, function* () {
        let offers = yield getActiveOffers(operation);
        if (offers && offers.length > 0) {
            let db = admin.database();
            yield asyncForEach(offers, (element) => __awaiter(this, void 0, void 0, function* () {
                yield db
                    .ref('server')
                    .child(`/negotiation/${operation.flowInstance}/${element.id}`)
                    .update({ active: false });
            }));
        }
    });
}
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
//# sourceMappingURL=negotiationUtils.js.map