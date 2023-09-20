import {
	createPendingRequest,
	updateOperationDone,
	updatePendingOrder,
	updateDocumentAttributes,
	getPendingOrder,
	getProjectStatus,
	searchLawyer,
	convertDocumentToHtml,
	updateMortgageeBalance,
	updateOriginalFile,
	updateBuyerOrderLaweyer,
	updateSellerOrderLaweyer,
	getPendingOrderById,
	getAllUserPendingOrders,
	getUserFlowInstances,
	getPublicUserById
} from './utils';
import { validateFirebaseIdToken } from './apiUtils';
import { sendEmailToLawyer } from './projectUtils';
import { getFlowInstanceById, getUserWizardSteps, getUserWizardStepsByInstance } from '../scheduler/FlowManagerUtils';
const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.use(bodyParser.json());

app.post('/sumbitOffer', async (req, res) => {
	console.log(`submiting   last version offer ${JSON.stringify(req.body.data)}}`);
	let resultId = await createPendingRequest(req.body.data, req.user.uid);

	res.send(JSON.stringify({ data: resultId }));
});

app.post('/updateOffer', async (req, res) => {
	console.log(`updating last version offer ${JSON.stringify(req.body.data)}}`);
	let resultId = await updatePendingOrder(req.body.data, req.user.uid);

	res.send(JSON.stringify({ data: resultId }));
});
app.post('/getProjectStatus', async (req, res) => {
	console.log(`getProjectStatus  ${JSON.stringify(req.body.data)}}`);
	let status = await getProjectStatus(req.body.data, req.user.uid);
	console.log(`status ${JSON.stringify(status)}`);

	res.send(JSON.stringify({ data: status }));
});

app.post('/getUserOrder', async (req, res) => {
	console.log(`submiting last version offer ${JSON.stringify(req.body.data)}}`);
	let pendingOrder = await getPendingOrder(req.user.uid, req.body.data);

	res.send(JSON.stringify({ data: pendingOrder }));
});

app.post('/getUserFlowWizard', async (req, res) => {
	console.log(`getUserFlowInstance    ${JSON.stringify(req.body.data)}}`);
	let pendingOrders = <any>await getAllUserPendingOrders(req.user.uid, req.body.data);
	if (pendingOrders && pendingOrders.length > 0) {
		let wizardsSteps = await Promise.all(pendingOrders.map((order) => getUserWizardSteps(order, req.user.uid)));
		res.send(JSON.stringify({ data: wizardsSteps }));
	} else {
		res.send(JSON.stringify({ data: '' }));
	}
});

app.post('/getUserFlowById', async (req, res) => {
	console.log(`getUserFlowInstance     ${JSON.stringify(req.body.data)}}`);
	let instance = <any>await getFlowInstanceById(req.body.data);
	if (instance) {
		let wizardsSteps = {
			steps: await getUserWizardStepsByInstance(instance, req.user.uid),
			project: instance.project,
			flowId: instance.key,
			seller: instance.sellerId ? await getPublicUserById(instance.sellerId) : '',
			buyer: instance.buyerId ? await getPublicUserById(instance.buyerId) : '',
			lawyerBuyer: instance.lawyerBuyerId ? await getPublicUserById(instance.lawyerBuyerId) : '',
			lawyerSeller: instance.lawyerSellerId ? await getPublicUserById(instance.lawyerSellerId) : '',
			order: await getPendingOrderById(instance.orderId, instance.project, '')
		};

		res.send(JSON.stringify({ data: wizardsSteps }));
	} else {
		res.send(JSON.stringify({ data: '' }));
	}
});

app.post('/getUserFlowsWizard', async (req, res) => {
	console.log(`getUserFlowInstance   ${JSON.stringify(req.body.data)}}`);
	let flowInstances = <any>await getUserFlowInstances(req.user.uid);
	if (flowInstances && flowInstances.length > 0) {
		let wizardsSteps = await Promise.all(
			flowInstances.map(async (instance) => {
				return {
					steps: await getUserWizardStepsByInstance(instance, req.user.uid),
					project: instance.project,
					flowId: instance.key,
					seller: instance.sellerId ? await getPublicUserById(instance.sellerId) : '',
					buyer: instance.buyerId ? await getPublicUserById(instance.buyerId) : '',
					lawyerBuyer: instance.lawyerBuyerId ? await getPublicUserById(instance.lawyerBuyerId) : '',
					lawyerSeller: instance.lawyerSellerId ? await getPublicUserById(instance.lawyerSellerId) : '',
					order: await getPendingOrderById(instance.orderId, instance.project, '')
				};
			})
		);
		res.send(JSON.stringify({ data: wizardsSteps }));
	} else {
		res.send(JSON.stringify({ data: '' }));
	}
});

app.post('/searchLawyer', async (req, res) => {
	console.log(`searchLawyer  for ${JSON.stringify(req.body.data)}}`);
	let lawyers = await searchLawyer(req.body.data.text);

	res.send(JSON.stringify({ data: lawyers }));
});
app.post('/getUserById', async (req, res) => {
	console.log(`getUserById for ${JSON.stringify(req.body.data)}}`);
	let user = await getPublicUserById(req.body.data);
	res.send(JSON.stringify({ data: user }));
});

app.post('/assignBuyerLawyer', async (req, res) => {
	console.log(`submiting   assignBuyerLawyer ${JSON.stringify(req.body.data)}}`);
	let pendingOrder = <any>await getPendingOrder(req.user.uid, req.body.data.project);
	console.log(`submiting   pendingOrder ${JSON.stringify(pendingOrder)}}`);
	if (pendingOrder) {
		console.log(`submiting  lawyerId ${JSON.stringify(req.body.data.lawyerId)}}`);
		await updateBuyerOrderLaweyer(
			req.body.data.project,
			pendingOrder.key,
			req.body.data.lawyerId,
			req.body.data.operationKey,
			req.user.uid,
			pendingOrder.flowId
		);
		console.log('SENDING EMAIL');
		await sendEmailToLawyer(req.body.data.lawyerId, req.user.uid, req.body.data.project, pendingOrder.key, 'Buyer');
	}
	res.send(JSON.stringify({ data: 'done' }));
});

app.post('/assignSellerLawyer', async (req, res) => {
	console.log(`submiting assignSellerLawyer ${JSON.stringify(req.body.data)}}`);
	console.log(`submiting  lawyerId ${JSON.stringify(req.body.data.lawyerId)}}`);
	let order = <any>await getPendingOrderById(req.body.data.orderId, req.body.data.project, '');
	if (order && order.sellerId === req.user.uid) {
		await updateSellerOrderLaweyer(
			req.body.data.project,
			req.body.data.orderId,
			req.body.data.lawyerId,
			req.body.data.operationKey,
			req.user.uid,
			order.flowId
		);
		console.log('SENDING EMAIL');
		await sendEmailToLawyer(
			req.body.data.lawyerId,
			req.user.uid,
			req.body.data.project,
			req.body.data.orderId,
			'Seller'
		);
	}
	res.send(JSON.stringify({ data: 'done' }));
});
app.post('/convertDocumentToHtml', async (req, res) => {
	console.log(`convertDocumentToHtml   ${JSON.stringify(req.body.data)}}`);
	let resultId = await convertDocumentToHtml(req.body.data, req.user.uid);
	console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/updateOriginalFile', async (req, res) => {
	console.log(`updateOriginalFile    ${JSON.stringify(req.body.data)}}`);
	let resultId = await updateOriginalFile(req.body.data, req.user.uid);
	console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/operationDone', async (req, res) => {
	console.log(`operation done  latest version ${JSON.stringify(req.body.data)}}`);
	let resultId = await updateOperationDone(req.body.data, req.user.uid);
	console.log(`OPERATION DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/updateDocument', async (req, res) => {
	console.log(`update document  ${JSON.stringify(req.body.data)}}`);
	let resultId = await updateDocumentAttributes(req.body.data, req.user.uid);

	res.send(JSON.stringify({ data: resultId }));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.projectApi = functions.https.onRequest(app);
