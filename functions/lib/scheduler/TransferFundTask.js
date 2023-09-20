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
function transferFundCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let operation = yield utils_1.getSignedOperation(task);
        let document = yield utils_1.getDocument(operation);
        console.log(`Testing transfer condition ${JSON.stringify(document)}`);
        if (document.signedDocument) {
            return true;
        }
        return false;
    });
}
exports.transferFundCondition = transferFundCondition;
function autoTrusteeDemo(operation, task) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield utils_1.getProject(operation.project);
        console.log(`check if project demo ${project.demo}`);
        if (project.demo) {
            console.log(`operation.type ${operation.type}`);
            switch (operation.type) {
                case 'transferReserved':
                    yield transferReserved(operation, task);
                    break;
                case 'transferFirstPayment':
                    console.log(`running transferFirstPayment`);
                    yield transferFirstPayment(operation, task);
                    break;
            }
        }
    });
}
exports.autoTrusteeDemo = autoTrusteeDemo;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function transferReserved(operation, task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/operations/events/reserveAndDeposit/`).push({
            active: true,
            userId: task.signUser,
            projectAddress: operation.project,
            pendingOrderId: operation.orderId
        });
        yield db.ref(`server/operations/events/triggerReserveAndDeposit/`).update({
            time: new Date().getTime()
        });
    });
}
function transferFirstPayment(operation, task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(`add new approveFundDeposit task ${JSON.stringify({
            active: true,
            userId: task.signUser,
            projectAddress: operation.project,
            pendingOrderId: operation.orderId
        })}`);
        yield db.ref(`server/operations/events/approveFundDeposit/`).push({
            active: true,
            userId: task.signUser,
            projectAddress: operation.project,
            pendingOrderId: operation.orderId
        });
        yield db.ref(`server/operations/events/triggerApproveFundDeposit/`).update({
            time: new Date().getTime()
        });
        yield delay(15000);
        // approve order
        yield db.ref(`server/operations/events/approvePendingOrder/`).push({
            active: true,
            userId: task.signUser,
            projectAddress: operation.project,
            pendingOrderId: operation.orderId
        });
        yield db.ref(`server/operations/events/triggerApprovePendingOrder/`).update({
            time: new Date().getTime()
        });
    });
}
function transferFundRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let operation = yield utils_1.getSignedOperation(task);
        yield db.ref(`server/operationHub/${task.signUser}/operations/${task.signOperation}`).update({
            status: 'operationDone',
        });
        yield db.ref(`server/operations/events/syncCase/`).push({
            active: true,
            user: task.signUser,
            project: operation.project,
        });
        yield db.ref(`server/operations/events/syncCaseTrigger/`).update({
            time: new Date().getTime()
        });
        yield sendMailToTrustee(task);
        yield autoTrusteeDemo(operation, task);
    });
}
exports.transferFundRun = transferFundRun;
function sendMailToTrustee(task) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
//# sourceMappingURL=TransferFundTask.js.map