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
const admin = require('firebase-admin');
const utils_1 = require("../operations/utils");
function trusteeAgreementCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let operation = yield utils_1.getSignedOperation(task);
        console.log(`trustee condition operation ${JSON.stringify(operation)}`);
        if (operation.type === 'signDocument' && operation.status === 'operationDone') {
            console.log('trusteeAgreementCondition return true');
            return true;
        }
        return false;
    });
}
exports.trusteeAgreementCondition = trusteeAgreementCondition;
function trusteeAgreementRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let operation = yield utils_1.getSignedOperation(task);
        yield createFutureOperations(task, operation);
        yield updateOrderSigned(operation.project, operation.orderId);
        yield syncCase(task.signUser, operation.project);
        yield sendMails(task);
    });
}
exports.trusteeAgreementRun = trusteeAgreementRun;
function sendMails(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(task.trustee);
        let mail = {
            active: true,
            params: {
                name: userAccount.name
            },
            template: 'project.investment.trustee.usersign',
            to: userAccount.email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
    });
}
function createFutureTasks(operationKey, task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let newTask = {
            active: true,
            signOperation: operationKey,
            signUser: task.signUser,
            trustee: task.trustee,
            type: 'transferFund'
        };
        yield db.ref(`server/operationHub/taskManager`).push(newTask);
    });
}
function updateOrderSigned(project, orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/projects/pendingOrders/${project}/${orderId}`).update({
            signedAgreement: true
        });
    });
}
function syncCase(user, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/operations/events/syncCase/`).push({
            active: true,
            user: user,
            project: project
        });
        yield db.ref(`server/operations/events/syncCaseTrigger/`).update({
            time: new Date().getTime()
        });
    });
}
function createFutureOperations(task, operation) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let documentId = yield createTransferDocument(task, operation, 'transferReserved');
        let operationKey = yield db.ref(`server/operationHub/${task.signUser}/operations/`).push({
            type: 'transferReserved',
            status: 'waiting',
            orderId: operation.orderId,
            document: documentId,
            project: operation.project,
            name: 'investment',
            time: new Date().getTime()
        }).key;
        yield createFutureTasks(operationKey, task);
        yield utils_1.addNotification(task.signUser, 'operation', 'transferReserved');
        documentId = yield createTransferDocument(task, operation, 'transferFirstPayment');
        let firstPaymentTransfer = yield db.ref(`server/operationHub/${task.signUser}/operations/`).push({
            type: 'transferFirstPayment',
            status: 'waiting',
            orderId: operation.orderId,
            project: operation.project,
            document: documentId,
            name: 'investment',
            time: new Date().getTime(),
            dependsOn: operationKey
        }).key;
        yield createFutureTasks(firstPaymentTransfer, task);
        // documentId = await createTransferDocument(task, operation, 'transferSecondPayment')
        //
        // let secondPaymentTransfer = await db.ref(`server/operationHub/${task.signUser}/operations/`).push({
        //     type: 'transferSecondPayment',
        //     document: documentId,
        //     status: 'waiting',
        //     orderId: operation.orderId,
        //     project: operation.project,
        //     name: 'investment',
        //     date: new Date().getTime(),
        //     dependsOn: operationKey + ',' + firstPaymentTransfer
        // }).key
        // await createFutureTasks(secondPaymentTransfer, task)
    });
}
function createTransferDocument(task, operation, type) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return yield db.ref(`server/legalDocuments/`).push({
            owner: task.signUser,
            project: operation.project,
            type: type,
            orderId: operation.orderId,
            users: {
                [task.trustee]: 'read'
            }
        }).key;
    });
}
//# sourceMappingURL=TrusteeAgreementTask.js.map