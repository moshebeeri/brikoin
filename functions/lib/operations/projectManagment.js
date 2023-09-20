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
exports.reserveAndDeposit = functions.database.ref(`server/operations/events/triggerReserveAndDeposit`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let request = yield utils_1.getActiveRequest('reserveAndDeposit');
    yield handleRequest(request);
}));
function handleRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (request) {
            let userAccount = yield utils_1.getUserActiveAccount(request.userId);
            let reservedPrice = yield wallet_1.getProjectReservedPrice(request.projectAddress, userAccount.accountId);
            let userProjectBalance = yield utils_1.userBalanceByProject(request.userId, request.projectAddress);
            if (parseFloat(userProjectBalance) < parseFloat(reservedPrice)) {
                yield wallet_1.depositCoinsProject(userAccount.accountId, parseFloat(reservedPrice) - parseFloat(userProjectBalance), request.projectAddress);
            }
            let response = yield wallet_1.projectBidReserve(userAccount.accountId, userAccount.privateKey, request.projectAddress);
            console.log(`response  projectBidReserve ${JSON.stringify(response)}`);
            if (response.success) {
                yield utils_1.syncUserLedger(request.userId);
                db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                    cancelOrder: false,
                    reserved: true
                });
                yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'transferReserved', { project: request.projectAddress });
            }
            db.ref('server').child('operations').child('events').child('reserveAndDeposit').child(request.key).update({ active: false });
        }
    });
}
exports.approveFundDeposit = functions.database.ref(`server/operations/events/triggerApproveFundDeposit`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('approveFundDeposit');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let amount = parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price);
        if (pendingOrder.reserved) {
            let reservedPrice = yield wallet_1.getProjectReservedPrice(request.projectAddress, userAccount.accountId);
            if (pendingOrder.orderSecondApproved) {
                amount = amount - (amount / 10);
            }
            else {
                amount = amount - parseInt(reservedPrice);
            }
            yield utils_1.syncUserLedger(request.userId);
        }
        console.log('amount: ' + amount);
        yield wallet_1.depositCoinsProject(userAccount.accountId, amount, request.projectAddress);
        db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
            cancelOrder: false,
            fullDeposit: true
        });
        yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'fullDeposit', { project: request.projectAddress });
        yield utils_1.orderChangedNotification(pendingOrder);
        db.ref('server').child('operations').child('events').child('approveFundDeposit').child(request.key).update({ active: false });
    }
}));
exports.cancelAllOrder = functions.database.ref(`server/operations/events/cancelAllOrderTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('cancelAllOrder');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        yield wallet_1.cancelProjectBidReserve(userAccount.accountId, userAccount.privateKey, request.projectAddress);
        yield wallet_1.cancelBidReqeust(userAccount.accountId, request.projectAddress);
        yield utils_1.syncUserLedger(request.userId);
        db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
            cancelOrder: true,
            buyerSignedTermSheet: false,
            buyerTermSheet: '',
            orderApproved: false,
            fullDeposit: false,
            reserved: false
        });
        yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'cancelAllOrder', { project: request.projectAddress });
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        yield utils_1.orderChangedNotification(pendingOrder);
        db.ref('server').child('operations').child('events').child('cancelAllOrder').child(request.key).update({ active: false });
    }
}));
exports.withdrawProjectFund = functions.database.ref(`server/operations/events/withdrawProjectFundTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('withdrawProjectFund');
    if (request) {
        console.log("request " + JSON.stringify(request));
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let userProjectBalance = yield utils_1.userBalanceByProject(request.userId, request.projectAddress);
        console.log('userProjectBalance: ' + userProjectBalance);
        if (userProjectBalance > 0) {
            yield wallet_1.withdrawCoins(userAccount.accountId, userProjectBalance, request.projectAddress);
            yield utils_1.syncUserLedger(request.userId);
        }
        yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'withdrawProjectFund', { project: request.projectAddress });
    }
    db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ active: false });
    db.ref('server').child('operations').child('events').child('withdrawProjectFund').child(request.key).update({ active: false });
}));
exports.withdrawANoReserved = functions.database.ref(`server/operations/events/withdrawANoReservedTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('withdrawANoReserved');
    console.log('START withdraw coins');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let userProjectBalance = yield utils_1.userBalanceByProject(request.userId, request.projectAddress);
        let reservedPrice = yield wallet_1.getProjectReservedPrice(request.projectAddress, userAccount.accountId);
        if (parseFloat(userProjectBalance) > parseFloat(reservedPrice)) {
            yield wallet_1.withdrawCoins(userAccount.accountId, parseFloat(userProjectBalance) - parseFloat(reservedPrice), request.projectAddress);
            yield utils_1.syncUserLedger(request.userId);
        }
        yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'withdrawANoReserved', { project: request.projectAddress });
    }
    db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ active: false });
    db.ref('server').child('operations').child('events').child('withdrawANoReserved').child(request.key).update({ active: false });
}));
function getUserOffer(pendingOrderId, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/projects/pendingOrders').child(projectAddress).child(pendingOrderId).once('value', function (snapshot) {
                    let result = snapshot.val();
                    resolve(result);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.approvePendingOrder = functions.database.ref(`server/operations/events/triggerApprovePendingOrder`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('approvePendingOrder');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let response = yield wallet_1.projectBidRequest(userAccount.accountId, pendingOrder.project, pendingOrder.amount, pendingOrder.price, 0);
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                cancelOrder: false,
                orderApproved: true
            });
            yield utils_1.syncUserLedger(request.userId);
            yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'approvePendingOrder', { project: request.projectAddress });
            yield utils_1.orderChangedNotification(pendingOrder);
        }
        db.ref('server').child('operations').child('events').child('approvePendingOrder').child(request.key).update({ active: false });
    }
}));
exports.approvePendingOrderSecond = functions.database.ref(`server/operations/events/triggerApprovePendingOrderSecond`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('approvePendingOrderSecond');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let project = yield utils_1.getProject(request.projectAddress);
        yield wallet_1.depositCoinsProject(userAccount.accountId, pendingOrder.amount / 10 - (parseInt(project.reservedBid) / 1000000), request.projectAddress);
        let response = yield wallet_1.projectBidRequest(userAccount.accountId, pendingOrder.project, pendingOrder.amount / 10, pendingOrder.price, 0);
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                cancelOrder: false,
                orderSecondApproved: true
            });
            yield utils_1.syncUserLedger(request.userId);
            yield utils_1.orderChangedNotification(pendingOrder);
        }
        db.ref('server').child('operations').child('events').child('approvePendingOrderSecond').child(request.key).update({ active: false });
    }
}));
exports.cancelPendingOrder = functions.database.ref(`server/operations/events/triggerCancelPendingOrder`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('cancelPendingOrder');
    if (request) {
        let userAccount = yield utils_1.getUserActiveAccount(request.userId);
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let response = yield wallet_1.cancelBidReqeust(userAccount.accountId, pendingOrder.project);
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ active: false });
            yield utils_1.syncUserLedger(request.userId);
            yield utils_1.addNotificationWithParams(request.userId, 'trusteeApproved', 'cancelPendingOrder', { project: request.projectAddress });
        }
        yield utils_1.orderChangedNotification(pendingOrder);
        db.ref('server').child('operations').child('events').child('cancelPendingOrder').child(request.key).update({ active: false });
    }
}));
exports.cancelGroupPendingOrder = functions.database.ref(`server/operations/events/triggerCancelGroupPendingOrder`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('cancelGroupPendingOrder');
    if (request) {
        let pendingOrder = yield utils_1.getUserGroupOffer(request.user, request.groupId, request.projectAddress);
        if (pendingOrder && pendingOrder.key) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(pendingOrder.key).update({
                cancelOrder: true,
                active: false
            });
            db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
                time: new Date().getTime()
            });
            yield utils_1.orderChangedNotification(pendingOrder);
        }
        db.ref('server').child('operations').child('events').child('cancelGroupPendingOrder').child(request.key).update({ active: false });
    }
}));
exports.approveProject = functions.database.ref(`server/operations/events/triggerApproveProject`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('approveProject');
    if (request) {
        console.log('STARTING PROJECT APPROVEMENT');
        let orders = yield getProjectPendingOrders(request.projectAddress);
        console.log('orders' + JSON.stringify(orders));
        let approvedOrders = orders.filter(order => order.orderApproved);
        console.log(JSON.stringify(approvedOrders));
        let project = yield utils_1.getProject(request.projectAddress);
        let projectValidation = yield validateProject(project, approvedOrders);
        console.log('Validation: ' + JSON.stringify(projectValidation));
        if (projectValidation.success) {
            for (let index = 0; index < approvedOrders.length; index++) {
                let tradeOrder = {
                    active: true,
                    amount: approvedOrders[index].amount,
                    buyer: approvedOrders[index].userId,
                    price: approvedOrders[index].price,
                    pendingOrderId: approvedOrders[index].key,
                    projectAddress: approvedOrders[index].project,
                    seller: 'admin'
                };
                db.ref('server/operations/events/tradeEvent').push(tradeOrder);
                db.ref('server/operations/events/tradeEventTrigger').set({
                    time: new Date().getTime()
                });
                yield utils_1.addNotificationWithParams(approvedOrders[index].userId, 'trusteeApproved', 'approveProject', { project: request.projectAddress });
            }
            db.ref('server/projects/orders').child(request.projectAddress).child('ask').remove();
            db.ref('server').child('projectsCollections/projects').child(project.key).update({ initTargetReached: true });
        }
        db.ref('server').child('operations').child('events').child('approveProject').child(request.key).update({ active: false });
    }
}));
exports.updateProjectTarget = functions.database.ref(`server/operations/events/triggerUpdateProjectTarget`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('updateProjectTarget');
    if (request) {
        let response = yield wallet_1.updateProjectTarget(request.project, request.dilution, request.units);
        if (response.success) {
            yield updateProjectInitialAsk(request.project, response.ownerBalance);
            db.ref('server').child('projectsCollections').child('projects').child(request.project).update({ target: response.target });
        }
        db.ref('server').child('operations').child('events').child('updateProjectTarget').child(request.key).update({ active: false });
    }
}));
exports.rejectBuyerOffer = functions.database.ref(`server/operations/events/triggerRejectBuyerOffer`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('rejectBuyerOffer');
    if (request) {
        let project = yield utils_1.getProject(request.projectAddress);
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ rejectOffer: true });
        }
        db.ref('server').child('operations').child('events').child('approveFundDeposit').child(request.key).update({ active: false });
    }
}));
exports.acceptBuyerOffer = functions.database.ref(`server/operations/events/triggerAcceptBuyerOffer`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('acceptBuyerOffer');
    if (request) {
        let project = yield utils_1.getProject(request.projectAddress);
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ acceptOffer: true });
        }
        db.ref('server').child('operations').child('events').child('acceptBuyerOffer').child(request.key).update({ active: false });
    }
}));
exports.initialDocumentSignedBuyer = functions.database.ref(`server/operations/events/triggerInitialDocumentSignedBuyer`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('initialDocumentSignedBuyer');
    if (request) {
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        if (pendingOrder.userId === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                buyerSignedTermSheet: true,
                buyerTermSheet: request.signedDocument,
                buyerTermSheetMd5: request.signedDocumentMd5,
                buyerSignature: request.signature,
                buyerId: request.idBuyer,
                buyerAddress: request.addressBuyer
            });
        }
        db.ref('server').child('operations').child('events').child('initialDocumentSignedBuyer').child(request.key).update({ active: false });
    }
}));
exports.signKyc = functions.database.ref(`server/operations/events/triggerSignKyc`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('signKyc');
    if (request) {
        let activeAccount = yield utils_1.getUserActiveAccount(request.userId);
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        if (pendingOrder.userId === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ kycSigned: true });
            db.ref('server').child('users').child(request.userId).child('accounts').child(activeAccount.id).update({
                kycSigned: true, kycDocument: request.signedDocument,
                kycDocumentMd5: request.signedDocumentMd5
            });
            db.ref('server').child('operations/events').child('syncCase').push({
                user: request.userId,
                project: request.projectAddress,
                active: true
            });
            db.ref('server').child('operations/events').child('syncCaseTrigger').set({ time: new Date().getTime() });
            yield utils_1.orderChangedNotification(pendingOrder);
        }
        db.ref('server').child('operations').child('events').child('signKyc').child(request.key).update({ active: false });
    }
}));
exports.initialDocumentSignedSeller = functions.database.ref(`server/operations/events/triggerInitialDocumentSignedSeller`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('initialDocumentSignedSeller');
    if (request) {
        let project = yield utils_1.getProject(request.projectAddress);
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                sellerSignedTermSheet: true,
                signedTermSheet: request.signedDocument,
                signedTermSheetMd5: request.signedDocumentMd5,
            });
        }
        db.ref('server').child('operations').child('events').child('initialDocumentSignedSeller').child(request.key).update({ active: false });
    }
}));
exports.counterBuyerOffer = functions.database.ref(`server/operations/events/triggerCounterBuyerOffer`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('counterBuyerOffer');
    if (request) {
        let project = yield utils_1.getProject(request.projectAddress);
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({ counterOffer: request.counterOffer });
        }
        db.ref('server').child('operations').child('events').child('counterBuyerOffer').child(request.key).update({ active: false });
    }
}));
exports.processUserOrder = functions.database.ref(`server/operations/events/triggerProcessOrder`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('processOrder');
    if (request) {
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let project = yield utils_1.getProject(request.projectAddress);
        console.log('Start Process');
        if (project.structure === 'Office') {
            yield handleOfficeOrderRequest(request.userId, pendingOrder, project.trustee.user ? project.trustee.user : project.trustee, request.projectAddress, request.pendingOrderId);
        }
        if (pendingOrder.group) {
            db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
                time: new Date().getTime()
            });
        }
        db.ref(`server/operations/events/processOrder/${request.key}`).update({
            active: false
        });
        yield utils_1.orderChangedNotification(pendingOrder);
    }
}));
exports.processOrderNow = functions.database.ref(`server/operations/events/triggerProcessOrderNow`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('processOrderNow');
    if (request) {
        let pendingOrder = yield getUserOffer(request.pendingOrderId, request.projectAddress);
        let project = yield utils_1.getProject(request.projectAddress);
        console.log('Start Process');
        yield handleOfficeOrderRequest(request.userId, pendingOrder, project.trustee.user ? project.trustee.user : project.trustee, request.projectAddress, request.pendingOrderId);
        console.log('Start done');
        if (pendingOrder.group) {
            yield db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
                time: new Date().getTime()
            });
            console.log('Set User Offer to BC');
            yield wallet_1.setUserOffer(pendingOrder.group, request.userId, pendingOrder.amount);
            console.log('offer was set');
        }
        yield utils_1.orderChangedNotification(pendingOrder);
        db.ref(`server/operations/events/processOrderNow/${request.key}`).update({
            active: false
        });
        db.ref(`server/operations/events/triggerProcessOrderNow/`).update({
            time: new Date().getTime()
        });
    }
}));
function handleOfficeOrderRequest(userId, pendingOrder, trustee, projectAddress, pendingOrderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log('Check KYC');
        let kyc = yield utils_1.getOrCreateKycDocument(userId, trustee);
        console.log(` KYC document created or returned ${JSON.stringify(kyc)}`);
        let kycOperation = yield utils_1.getOrCreateKycOperation(userId, kyc);
        console.log(` KYC operation created or returned ${JSON.stringify(kycOperation)}`);
        let project = yield utils_1.getProject(projectAddress);
        if (parseInt(project.target) == parseInt(pendingOrder.amount)) {
            yield buyAllProjectFlow(kycOperation, userId, pendingOrder, projectAddress, pendingOrderId, trustee);
        }
        else {
            yield trusteeFlow(kycOperation, userId, pendingOrder, projectAddress, trustee, pendingOrderId);
        }
    });
}
exports.handleOfficeOrderRequest = handleOfficeOrderRequest;
function buyAllProjectFlow(kycOperation, userId, pendingOrder, projectAddress, pendingOrderId, trustee) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documentRef = db.ref(`server/legalDocuments/`);
        let standardAgrementKey = yield documentRef.push({
            attributes: {
                price: parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price)
            },
            type: 'standardAgrement',
            project: projectAddress,
            orderId: pendingOrderId,
            owner: userId,
        }).key;
        let signOperation = yield db.ref(`server/operationHub/${userId}/operations`).push({
            name: 'standardAgrement',
            type: 'signDocument',
            time: new Date().getTime(),
            status: 'waiting',
            dependsOn: kycOperation.key,
            document: standardAgrementKey,
            orderId: pendingOrderId,
            project: projectAddress
        }).key;
        yield utils_1.addNotification(userId, 'operation', 'standardAgrement');
        let trusteeTask = yield db.ref(`server/operationHub/taskManager/`).push({
            active: true,
            signOperation: signOperation,
            signUser: userId,
            trustee: trustee,
            type: 'trusteeAgrement'
        }).key;
        yield db.ref(`server/operationHub/${userId}/operations/${signOperation}`).update({
            taskId: trusteeTask
        });
        yield utils_1.scheduleVideoMeeting(trustee, userId, projectAddress, false);
        yield db.ref(`server/operationHub/taskManager/`).push({
            active: true,
            signOperation: signOperation,
            signUser: userId,
            trustee: trustee,
            type: 'notificationTrustee'
        }).key;
    });
}
function trusteeFlow(kycOperation, userId, pendingOrder, projectAddress, trustee, pendingOrderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documentRef = db.ref(`server/legalDocuments/`);
        let trusteeAgrementKey = yield documentRef.push({
            attributes: {
                price: parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price)
            },
            type: 'trusteeAgrement',
            project: projectAddress,
            orderId: pendingOrderId,
            owner: userId,
            users: {
                [trustee]: 'read'
            },
        }).key;
        let signOperation = yield db.ref(`server/operationHub/${userId}/operations`).push({
            name: 'trusteeAgrement',
            type: 'signDocument',
            time: new Date().getTime(),
            status: 'waiting',
            dependsOn: kycOperation.key,
            document: trusteeAgrementKey,
            orderId: pendingOrderId,
            project: projectAddress
        }).key;
        yield utils_1.addNotification(userId, 'operation', 'trusteeAgrement');
        let trusteeTask = yield db.ref(`server/operationHub/taskManager/`).push({
            active: true,
            signOperation: signOperation,
            signUser: userId,
            trustee: trustee,
            type: 'trusteeAgrement'
        }).key;
        yield db.ref(`server/operationHub/${userId}/operations/${signOperation}`).update({
            taskId: trusteeTask
        });
        yield utils_1.scheduleVideoMeeting(trustee, userId, projectAddress, false);
        yield db.ref(`server/operationHub/taskManager/`).push({
            active: true,
            signOperation: signOperation,
            signUser: userId,
            trustee: trustee,
            type: 'notificationTrustee'
        }).key;
    });
}
function validateProject(project, orders) {
    return __awaiter(this, void 0, void 0, function* () {
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let totalOrderPrice = orders.map(order => parseInt(order.amount) * parseFloat(order.price)).reduce(reducer);
        console.log('totalOrderPrice: ' + totalOrderPrice);
        return { success: totalOrderPrice >= parseInt(project.target) };
    });
}
function updateProjectInitialAsk(projectAddress, newBalance) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield utils_1.getProject(projectAddress);
        let db = admin.database();
        if (project.tradeMethod === 'auction') {
            let askAuctionOrder = yield getProjectAuctionOrder(projectAddress);
            db.ref('server/projects/events/auctionOrders').child(projectAddress).child('ask').child(askAuctionOrder.key).update({
                amount: newBalance,
                size: newBalance
            });
        }
        else {
            let askOrder = yield getProjectAskOrder(projectAddress);
            db.ref('server/projects/orders').child(projectAddress).child('ask').child(askOrder.key).update({ size: newBalance });
        }
    });
}
function getProjectPendingOrders(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/projects/pendingOrders').child(projectAddress).once('value', function (snapshot) {
                    let result = snapshot.val();
                    console.log('ORDER ' + JSON.stringify(result));
                    let orders = Object.keys(result).map(key => {
                        let order = result[key];
                        order.key = key;
                        console.log('order object' + JSON.stringify(order));
                        return order;
                    });
                    console.log('ORDER Done ' + JSON.stringify(orders));
                    resolve(orders);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getProjectAskOrder(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/projects/orders').child(projectAddress).child('ask').once('value', function (snapshot) {
                    let result = snapshot.val();
                    let asks = result.map(key => {
                        let order = result[key];
                        order.key = key;
                    });
                    resolve(asks[0]);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getProjectAuctionOrder(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/projects/events/auctionOrders').child(projectAddress).child('ask').once('value', function (snapshot) {
                    let result = snapshot.val();
                    let asks = result.map(key => {
                        let order = result[key];
                        order.key = key;
                    });
                    resolve(asks[0]);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
//# sourceMappingURL=projectManagment.js.map