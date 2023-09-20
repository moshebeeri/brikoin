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
exports.syncCase = functions.database.ref(`server/operations/events/syncCaseTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let syncRequest = yield utils_1.getActiveRequest('syncCase');
    let pendingOrder = yield utils_1.getPendingOrder(syncRequest.user, syncRequest.project);
    console.log('pendingOrder: ' + JSON.stringify(pendingOrder));
    if (pendingOrder && pendingOrder.active) {
        console.log('GET PROJECT');
        let project = yield utils_1.getProject(syncRequest.project);
        console.log('project: ' + JSON.stringify(project));
        let lawyerId = project.trustee ? (project.trustee.user ? project.trustee.user : project.trustee) : project.sellerLawyer;
        if (lawyerId) {
            let projectCase = yield getProjectCase(lawyerId, syncRequest.project);
            if (!pendingOrder.caseId) {
                updatePendingOrder(pendingOrder, syncRequest.project, projectCase.key);
            }
            if (projectCase) {
                console.log('projectCase: ' + JSON.stringify(projectCase));
                if (projectCase.buyers) {
                    updateOffering(projectCase, syncRequest, db, project, pendingOrder, lawyerId);
                }
                else {
                    sendRequestMail(syncRequest.user, project);
                    let documents = yield getBuyerDocuments(syncRequest.user, project, pendingOrder);
                    let buyer = {
                        offer: pendingOrder.key,
                        user: syncRequest.user,
                        kycDocument: documents.kycDocument ? documents.kycDocument : '',
                        transferFirstPayment: documents.transferFirstPayment ? documents.transferFirstPayment : '',
                        transferReserved: documents.transferReserved ? documents.transferReserved : '',
                        legalDocument: documents.legalDocument ? documents.legalDocument : ''
                    };
                    db.ref('server').child('cases').child(lawyerId).child(projectCase.key).child('buyers').push(buyer);
                    yield utils_1.addNotificationWithParams(lawyerId, 'trusteeCase', 'pendingOffer', { caseId: projectCase.key });
                }
            }
            yield utils_1.orderChangedNotification(pendingOrder);
        }
    }
    db.ref('server').child('operations').child('events').child('syncCase').child(syncRequest.key).update({ active: false });
    console.log('END Sync Casde');
}));
function updatePendingOrder(pendingOrder, project, caseId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child('projects').child('pendingOrders').child(project).child(pendingOrder.key).update({
            caseId: caseId
        });
    });
}
function sendRequestMail(userId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        const user = yield admin.auth().getUser(userId);
        const activeAccount = yield utils_1.getUserActiveAccount(userId);
        console.log('SENDING EMAIL');
        console.log(JSON.stringify({
            template: 'project.investment.project.thanks',
            to: user.email,
            params: {
                name: activeAccount.name,
                thanksIssue: 'Purchase Order',
                projectName: project.name,
                projectId: project.address
            },
            active: true
        }));
        db.ref('server/operations/events/sendEmail').push({
            template: 'project.investment.project.thanks',
            to: user.email,
            params: {
                name: activeAccount.name,
                thanksIssue: 'Purchase Order',
                projectName: project.name,
                projectId: project.address
            },
            active: true
        });
        db.ref('server/operations/events/sendMailTrigger').update({ time: new Date().getTime() });
    });
}
function updateOffering(projectCase, syncRequest, db, project, pendingOrder, lawyerId) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentBuyer = Object.keys(projectCase.buyers).map(key => {
            let buyer = projectCase.buyers[key];
            buyer.key = key;
            return buyer;
        }).filter(buyer => buyer.user === syncRequest.user);
        let documents = yield getBuyerDocuments(syncRequest.user, project, pendingOrder);
        let buyer = {
            offer: pendingOrder.key,
            user: syncRequest.user,
            kycDocument: documents.kycDocument,
            transferFirstPayment: documents.transferFirstPayment,
            transferReserved: documents.transferReserved,
            legalDocument: documents.legalDocument
        };
        if (currentBuyer.length === 0) {
            sendRequestMail(syncRequest.user, project);
            yield utils_1.addNotificationWithParams(lawyerId, 'trusteeCase', 'pendingOffer', { caseId: projectCase.key });
            db.ref('server').child('cases').child(lawyerId).child(projectCase.key).child('buyers').push(buyer);
        }
        else {
            yield utils_1.addNotificationWithParams(lawyerId, 'trusteeCase', 'pendingOfferUpdated', { caseId: projectCase.key });
            db.ref('server').child('cases').child(lawyerId).child(projectCase.key).child('buyers').child(currentBuyer[0].key).update(buyer);
        }
    });
}
function getBuyerDocuments(user, project, pendingOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('legalDocuments').orderByChild('owner').equalTo(user).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(`Document results ${JSON.stringify(results)}`);
                    if (results) {
                        let result = Object.keys(results).map(key => {
                            let document = results[key];
                            document.key = key;
                            return document;
                        });
                        let documentResults = {
                            kycDocument: getDocumentId('KYC', result, '', ''),
                            legalDocument: getDocumentId('trusteeAgrement', result, project, pendingOrder.key),
                            transferFirstPayment: getDocumentId('transferFirstPayment', result, project, pendingOrder.key),
                            transferReserved: getDocumentId('transferReserved', result, project, pendingOrder.key)
                        };
                        console.log(`document results ${JSON.stringify(documentResults)}`);
                        resolve(documentResults);
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
function getDocumentId(type, documents, project, orderId) {
    let filterDocument = documents.filter(document => document.type === type && (project && project.address ? (project.address === document.project && orderId === document.orderId) : true));
    return filterDocument && filterDocument.length > 0 ? filterDocument[0].key : '';
}
function getProjectCase(lawyerId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            console.log('lawyerId:' + lawyerId);
            console.log('project:' + project);
            let db = admin.database();
            try {
                db.ref('server').child('cases').child(lawyerId).orderByChild('projectAddress').equalTo(project).once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map(key => {
                            let projectCase = results[key];
                            projectCase.key = key;
                            return projectCase;
                        });
                        resolve(result[0]);
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
//# sourceMappingURL=caseOperations.js.map