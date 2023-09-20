import { sendOffer, approveOffer, counterOffer, rejectOffer, getOffers } from './negotiationUtils';
import { validateFirebaseIdToken } from './apiUtils';

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

app.post('/sendOffer', async (req, res) => {
	console.log(`sendOffer  ${JSON.stringify(req.body.data)}}`);
	let resultId = await sendOffer(req.body.data.operation, req.body.data.amount, req.user.uid);
	console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/rejectOffer', async (req, res) => {
	console.log(`rejectOffer ${JSON.stringify(req.body.data)}}`);
	let resultId = await rejectOffer(req.body.data.operation, req.body.data.offerId, req.user.uid);
	console.log(`OPERATION DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/approveOffer', async (req, res) => {
	console.log(`approveOffer ${JSON.stringify(req.body.data)}}`);
	let resultId = await approveOffer(req.body.data.operation, req.body.data.offerId, req.user.uid);
	console.log(`OPERATION DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/counterOffer', async (req, res) => {
	console.log(`counterOffer   ${JSON.stringify(req.body.data)}}`);
	let resultId = await counterOffer(req.body.data.operation, req.body.data.amount, req.user.uid);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/getOffers', async (req, res) => {
	console.log(`getOffers   ${JSON.stringify(req.body.data)}}`);

	let resultId = await getOffers(req.body.data, req.user.uid);
	res.send(JSON.stringify({ data: resultId }));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.negotiationApi = functions.https.onRequest(app);
