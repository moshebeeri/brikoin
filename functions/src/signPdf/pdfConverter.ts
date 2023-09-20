import { validateFirebaseIdToken } from '../operations/apiUtils';
import { convertFile } from './pdfUtils';
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

app.post('/convertHtmlToPdf', async (req, res) => {
	let results = await convertFile(
		req.body.data.fileName,
		req.body.data.filePath,
		req.body.data.sourceFormat,
		req.body.data.destFormat,
		req.body.data.metadata
	);
	res.send(JSON.stringify({ data: results }));
});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.pdfConverter = functions.https.onRequest(app);
