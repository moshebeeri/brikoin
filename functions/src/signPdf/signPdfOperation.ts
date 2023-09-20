const functions = require('firebase-functions');
const admin = require('firebase-admin');
const path = require('path');
const os = require('os');
const fs = require('fs');
import { convertFile } from './pdfUtils';
const fileBucket = functions.config().file.bucket;
import signer from './utils/signpdf';
import { plainAdd } from './utils/helpers';
import { getActiveRequest, getOperationByid } from '../operations/utils';
import { updateFlowStep, getFlowInstanceById } from '../scheduler/FlowManagerUtils';
// TODO  increase the Memory of this function to at least 1 G
exports.signPdf = functions.database
	.ref(`server/operations/events/signPdfTriggerEvent`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		console.log('START PDF SIGNATURE');
		let signPdfRequest = <any>await getActiveRequest('signPdf');
		if (signPdfRequest) {
			const fileName = signPdfRequest.fileName;
			const filePath = signPdfRequest.filePath;
			const bucket = admin.storage().bucket(fileBucket);
			const tempFilePath = path.join(os.tmpdir(), fileName);
			await bucket.file(filePath).download({ destination: tempFilePath });

			let pdfBuffer = fs.readFileSync(tempFilePath);
			console.log(JSON.stringify(pdfBuffer));

			const tempCertificateFilePath = path.join(os.tmpdir(), 'certificate.p12');
			await bucket.file('certificate/certificate.p12').download({ destination: tempCertificateFilePath });
			let certificateBuffer = fs.readFileSync(tempCertificateFilePath);

			console.log(`downLoad success: ${os.tmpdir()} '/certificate.p12'`);
			pdfBuffer = plainAdd(pdfBuffer, {
				reason: 'Brikoin Signature',
				signatureLength: 6000
			});
			const signedPDF = signer.sign(pdfBuffer, certificateBuffer);
			const signedPath = path.join(os.tmpdir(), 'signed.pdf');

			fs.createWriteStream(signedPath).end(signedPDF);
			await bucket.upload(signedPath, {
				destination: filePath,
				metadata: {
					contentType: 'application/pdf'
				}
			});

			let metaData = await bucket.file(filePath).getMetadata();
			console.log(`metaData:  ${metaData[0].md5Hash}`);
			db.ref(`server/legalDocuments/${signPdfRequest.documentId}`).update({
				signedDocumentMd5: metaData[0].md5Hash
			});

			db.ref(`server/operationHub/${signPdfRequest.user}/operations/${signPdfRequest.operationId}`).update({
				status: 'operationDone'
			});
			let signOperation = <any>await getOperationByid(signPdfRequest.user, signPdfRequest.operationId);
			if (signOperation && signOperation.flowInstance) {
				let flowInstance = await getFlowInstanceById(signOperation.flowInstance);
				updateFlowStep(flowInstance, signOperation.operationId, 'DONE', signOperation.flowInstance);
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
	});

const runtimeOpts = {
	timeoutSeconds: 450
};

// TODO  increase the Memory of this function to at least 1 G
exports.convertFile = functions
	.runWith(runtimeOpts)
	.database.ref(`server/operations/events/convertFileTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		console.log('START PDF convertion  NOW NOW');
		let convertPdfRequest = <any>await getActiveRequest('convertFile');
		if (convertPdfRequest) {
			await convertFile(
				convertPdfRequest.fileName,
				convertPdfRequest.filePath,
				convertPdfRequest.formatInput,
				convertPdfRequest.formatOutput,
				convertPdfRequest.metadata
			);
			db
				.ref('server')
				.child('/operations/events/convertFile')
				.child(convertPdfRequest.key)
				.update({ active: false });
		}
	});
