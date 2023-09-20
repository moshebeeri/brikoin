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
const utils_1 = require("../operations/utils");
const pdfUtils_1 = require("../signPdf/pdfUtils");
const FlowManagerUtils_1 = require("./FlowManagerUtils");
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fileBucket = functions.config().file.bucket;
function triggerSendFinalDocCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
exports.triggerSendFinalDocCondition = triggerSendFinalDocCondition;
function triggerSendFinalDocRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let order = yield utils_1.getPendingOrderById(task.orderId, task.project, '');
        let buyer = yield utils_1.getUserActiveAccount(order.userId);
        let seller = yield utils_1.getUserActiveAccount(order.sellerId);
        let sellerLawyer = yield utils_1.getUserActiveAccount(order.lawyerSellerId);
        let lawayerBuyer = yield utils_1.getUserActiveAccount(order.lawyerBuyerId);
        let fileName = task.documentPath.substring(task.documentPath.lastIndexOf('/') + 1);
        let filePath = task.documentPath.substring(0, task.documentPath.lastIndexOf('/'));
        console.log(`fileName ${fileName}`);
        console.log(`filePath ${filePath}`);
        yield pdfUtils_1.convertFile(fileName, filePath, 'html', 'pdf', {
            buyer: order.userId,
            seller: order.sellerId,
            lawyerSeller: order.lawyerSellerId || ''
        });
        let fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        console.log(`fileNameWithoutExt ${fileNameWithoutExt}`);
        const bucket = admin.storage().bucket(fileBucket);
        let convertedFile = bucket.file(`${filePath}/${fileNameWithoutExt}.pdf`);
        let expDate = addDays(6);
        let config = {
            action: 'read',
            expires: expDate.getTime()
        };
        console.log(`config ${JSON.stringify(config)}`);
        let url = yield convertedFile.getSignedUrl(config);
        console.log(`url ${url}`);
        sendEmail(buyer.name, buyer.email, url[0]);
        sendEmail(sellerLawyer.name, sellerLawyer.email, url[0]);
        sendEmail(seller.name, seller.email, url[0]);
        sendEmail(lawayerBuyer.name, lawayerBuyer.email, url[0]);
        let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(task.flowInstance);
        console.log(`updateFlowStep`);
        FlowManagerUtils_1.updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
    });
}
exports.triggerSendFinalDocRun = triggerSendFinalDocRun;
function addDays(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}
function sendEmail(name, email, documentUrl) {
    let db = admin.database();
    db.ref('server/operations/events/sendEmail').push({
        template: 'project.legal.saleDocument',
        to: email,
        params: {
            name: name,
            url: documentUrl
        },
        active: true
    });
    db.ref('server/operations/events/sendMailTrigger').update({ time: new Date().getTime() });
}
//# sourceMappingURL=sendFinalDocumentTask.js.map