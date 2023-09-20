import { addNotificationWithParams, getPendingOrderById, getUserActiveAccount } from '../operations/utils';
import { convertFile } from '../signPdf/pdfUtils';
import { depositCoinsProject, projectBidRequest, projectTradeRequest } from '../operations/wallet';

import { updateFlowStep, getFlowInstanceById } from './FlowManagerUtils';
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fileBucket = functions.config().file.bucket;

export async function triggerSendFinalDocCondition(task) {
	return true;
}

export async function triggerSendFinalDocRun(task) {
	let order = <any>await getPendingOrderById(task.orderId, task.project, '');
	let buyer = <any>await getUserActiveAccount(order.userId);
	let seller = <any>await getUserActiveAccount(order.sellerId);
	let sellerLawyer = <any>await getUserActiveAccount(order.lawyerSellerId);
	let lawayerBuyer = <any>await getUserActiveAccount(order.lawyerBuyerId);
	let fileName = task.documentPath.substring(task.documentPath.lastIndexOf('/') + 1);
	let filePath = task.documentPath.substring(0, task.documentPath.lastIndexOf('/'));
	console.log(`fileName ${fileName}`);
	console.log(`filePath ${filePath}`);
	await convertFile(fileName, filePath, 'html', 'pdf', {
		buyer: order.userId,
		seller: order.sellerId,
		lawyerSeller: order.lawyerSellerId || ''
	});
	let fileNameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
	console.log(`fileNameWithoutExt ${fileNameWithoutExt}`);
	const bucket = admin.storage().bucket(fileBucket);
	let convertedFile = bucket.file(`${filePath}/${fileNameWithoutExt}.pdf`);
	let expDate = <Date>addDays(6);
	let config = {
		action: 'read',
		expires: expDate.getTime()
	};

	console.log(`config ${JSON.stringify(config)}`);
	let url = await convertedFile.getSignedUrl(config);
	console.log(`url ${url}`);
	sendEmail(buyer.name, buyer.email, url[0]);
	sendEmail(sellerLawyer.name, sellerLawyer.email, url[0]);
	sendEmail(seller.name, seller.email, url[0]);
	sendEmail(lawayerBuyer.name, lawayerBuyer.email, url[0]);

	let flowInstance = await getFlowInstanceById(task.flowInstance);
	console.log(`updateFlowStep`);
	updateFlowStep(flowInstance, task.operationId, 'DONE', task.flowInstance);
}

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
