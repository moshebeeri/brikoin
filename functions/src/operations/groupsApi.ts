import { findGroupStats, findGroupsByProject, findMyGroups } from './groupsSearchEngine';
import { inviteUser, createNewGroup, acceptInvatation, userJoinGroup } from './groups';
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

app.post('/hello', (req, res) => {
	res.send(JSON.stringify({ data: { name: req.user.name } }));
});
app.post('/getProjectGroups', async (req, res) => {
	let results = await findGroupsByProject(req.body.data.project);
	res.send(JSON.stringify({ data: results }));
});

app.post('/getMyProjectGroups', async (req, res) => {
	let results = await findMyGroups(req.user.uid);
	res.send(JSON.stringify({ data: results }));
});
app.post('/getGroupStat', async (req, res) => {
	if (req.body.data.group) {
		let results = await findGroupStats(req.body.data.group);
		res.send(JSON.stringify({ data: results }));
	} else {
		res.send(JSON.stringify({ data: 'failed' }));
	}
});

app.post('/createGroup', async (req, res) => {
	if (req.body.data) {
		let results = await createNewGroup(req.body.data, req.user.uid);
		res.send(JSON.stringify({ data: results }));
	} else {
		res.send(JSON.stringify({ data: 'failed' }));
	}
});
app.post('/inviteUser', async (req, res) => {
	let results = await inviteUser(req.user.uid, req.body.data.userId, req.body.data.groupId);
	res.send(JSON.stringify({ data: results }));
});

app.post('/acceptInvatation', async (req, res) => {
	let results = await acceptInvatation(req.user.uid, req.body.data.memberId, req.body.data.groupId);
	res.send(JSON.stringify({ data: results }));
});

app.post('/joinGroup', async (req, res) => {
	let results = await userJoinGroup(req.user.uid, req.body.data.groupId);
	res.send(JSON.stringify({ data: results }));
});
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.groupsApi = functions.https.onRequest(app);
