"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
const pdfUtils_1 = require("./pdfUtils");
const fileBucket = functions.config().file.bucket;
const signpdf_1 = __importDefault(require("./utils/signpdf"));
const helpers_1 = require("./utils/helpers");
const utils_1 = require("../operations/utils");
const FlowManagerUtils_1 = require("../scheduler/FlowManagerUtils");
// TODO  increase the Memory of this function to at least 1 G
exports.signPdf = functions.database
    .ref(`server/operations/events/signPdfTriggerEvent`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('START PDF SIGNATURE');
    let signPdfRequest = yield utils_1.getActiveRequest('signPdf');
    if (signPdfRequest) {
        const fileName = signPdfRequest.fileName;
        const filePath = signPdfRequest.filePath;
        const bucket = admin.storage().bucket(fileBucket);
        const tempFilePath = path.join(os.tmpdir(), fileName);
        yield bucket.file(filePath).download({ destination: tempFilePath });
        let pdfBuffer = fs.readFileSync(tempFilePath);
        console.log(JSON.stringify(pdfBuffer));
        const tempCertificateFilePath = path.join(os.tmpdir(), 'certificate.p12');
        yield bucket.file('certificate/certificate.p12').download({ destination: tempCertificateFilePath });
        let certificateBuffer = fs.readFileSync(tempCertificateFilePath);
        console.log(`downLoad success: ${os.tmpdir()} '/certificate.p12'`);
        pdfBuffer = helpers_1.plainAdd(pdfBuffer, {
            reason: 'Brikoin Signature',
            signatureLength: 6000
        });
        const signedPDF = signpdf_1.default.sign(pdfBuffer, certificateBuffer);
        const signedPath = path.join(os.tmpdir(), 'signed.pdf');
        fs.createWriteStream(signedPath).end(signedPDF);
        yield bucket.upload(signedPath, {
            destination: filePath,
            metadata: {
                contentType: 'application/pdf'
            }
        });
        let metaData = yield bucket.file(filePath).getMetadata();
        console.log(`metaData:  ${metaData[0].md5Hash}`);
        db.ref(`server/legalDocuments/${signPdfRequest.documentId}`).update({
            signedDocumentMd5: metaData[0].md5Hash
        });
        db.ref(`server/operationHub/${signPdfRequest.user}/operations/${signPdfRequest.operationId}`).update({
            status: 'operationDone'
        });
        let signOperation = yield utils_1.getOperationByid(signPdfRequest.user, signPdfRequest.operationId);
        if (signOperation && signOperation.flowInstance) {
            let flowInstance = yield FlowManagerUtils_1.getFlowInstanceById(signOperation.flowInstance);
            FlowManagerUtils_1.updateFlowStep(flowInstance, signOperation.operationId, 'DONE', signOperation.flowInstance);
        }
        const beforePath = path.join(os.tmpdir(), '_before.pdf');
        const afterPath = path.join(os.tmpdir(), '_after.pdf');
        fs.unlinkSync(signedPath);
        fs.unlinkSync(tempFilePath);
        fs.unlinkSync(tempCertificateFilePath);
        fs.unlinkSync(beforePath);
        fs.unlinkSync(afterPath);
        console.log('file uploaded');
        db.ref('server').child('/operations/events/signPdf').child(signPdfRequest.key).update({ active: false });
    }
    console.log('########## Handling signPdf end ############');
}));
const runtimeOpts = {
    timeoutSeconds: 450
};
// TODO  increase the Memory of this function to at least 1 G
exports.convertFile = functions
    .runWith(runtimeOpts)
    .database.ref(`server/operations/events/convertFileTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    console.log('START PDF convertion  NOW NOW');
    let convertPdfRequest = yield utils_1.getActiveRequest('convertFile');
    if (convertPdfRequest) {
        yield pdfUtils_1.convertFile(convertPdfRequest.fileName, convertPdfRequest.filePath, convertPdfRequest.formatInput, convertPdfRequest.formatOutput, convertPdfRequest.metadata);
        db
            .ref('server')
            .child('/operations/events/convertFile')
            .child(convertPdfRequest.key)
            .update({ active: false });
    }
}));
//# sourceMappingURL=signPdfOperation.js.map