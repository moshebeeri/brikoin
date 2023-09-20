import {
	duplicateProperty,
	getParentProjects,
	deleteProperty,
	assignProjectToParent,
	getLoadingProjects,
	propertyReviewed,
	propertyApproved
} from './collections';
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

app.post('/duplicateProject', async (req, res) => {
	console.log(`duplicateProject  ${JSON.stringify(req.body.data)}}`);
	let resultId = await duplicateProperty(req.body.data.id);
	console.log(`duplicateProject DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/deleteLoadingProject', async (req, res) => {
	console.log(`deleteLoadingProject   ${JSON.stringify(req.body.data)}}`);
	let resultId = await deleteProperty(req.body.data.id, req.user.uid);
	console.log(`deleteLoadingProject DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/loadingProjectReviewed', async (req, res) => {
	console.log(`loadingProjectReviewed   ${JSON.stringify(req.body.data)}}`);
	let resultId = await propertyReviewed(req.body.data.id, req.user.uid);
	console.log(`propertyReviewed DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/loadingProjectApproved', async (req, res) => {
	console.log(`loadingProjectApproved   ${JSON.stringify(req.body.data)}}`);
	let resultId = await propertyApproved(req.body.data.id, req.user.uid);
	console.log(`loadingProjectApproved DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/getParentProjects', async (req, res) => {
	console.log(`getParentProjects 	  ${JSON.stringify(req.body.data)}}`);
	let resultId = await getParentProjects();
	console.log(`getParentProjects DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/assignToParentProject', async (req, res) => {
	console.log(`assignProjectToParent   ${JSON.stringify(req.body.data)}}`);
	let resultId = await assignProjectToParent(req.body.data.parentId, req.body.data.id);
	console.log(`assignProjectToParent DONE RESULT: ${resultId}`);
	res.send(JSON.stringify({ data: resultId }));
});

app.post('/getLoadingProjects', async (req, res) => {
	console.log(`getLoadingProjects `);
	let resultId = await getLoadingProjects(req.user.uid);
	res.send(JSON.stringify({ data: resultId }));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.collectionsApi = functions.https.onRequest(app);
