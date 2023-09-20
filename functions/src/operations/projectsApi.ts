import { getGroupStats, getProjectGroups, getInitilProjects, getProjectByAddress, initSubProjects } from './utils';
import { validateFirebaseIdToken } from './apiUtils';
import { findProjects, findProjectsByAddress, findSubProject } from './projectsSearchEngine';
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
// app.use(validateFirebaseIdToken);
app.use(bodyParser.json());

app.post('/findProjects', async (req, res) => {
	let results = await findProjects(' ');
	res.send(JSON.stringify({ data: results }));
});

app.post('/getProjectByAddress', async (req, res) => {
	console.log(`getProjectByAddress  ${JSON.stringify(req.body.data)}`);
	let project = await findProjectsByAddress(req.body.data);
	res.send(JSON.stringify({ data: project }));
});

app.post('/getSupProjects', async (req, res) => {
	console.log(`getSupProjects   ${JSON.stringify(req.body.data)}`);
	let projects = await findSubProject(req.body.data);
	res.send(JSON.stringify({ data: projects }));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.projects = functions.https.onRequest(app);
