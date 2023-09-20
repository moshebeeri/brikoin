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
const negotiationUtils_1 = require("./negotiationUtils");
const apiUtils_1 = require("./apiUtils");
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
app.use(apiUtils_1.validateFirebaseIdToken);
app.use(bodyParser.json());
app.post('/sendOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`sendOffer  ${JSON.stringify(req.body.data)}}`);
    let resultId = yield negotiationUtils_1.sendOffer(req.body.data.operation, req.body.data.amount, req.user.uid);
    console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/rejectOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`rejectOffer ${JSON.stringify(req.body.data)}}`);
    let resultId = yield negotiationUtils_1.rejectOffer(req.body.data.operation, req.body.data.offerId, req.user.uid);
    console.log(`OPERATION DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/approveOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`approveOffer ${JSON.stringify(req.body.data)}}`);
    let resultId = yield negotiationUtils_1.approveOffer(req.body.data.operation, req.body.data.offerId, req.user.uid);
    console.log(`OPERATION DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/counterOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`counterOffer   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield negotiationUtils_1.counterOffer(req.body.data.operation, req.body.data.amount, req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/getOffers', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getOffers   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield negotiationUtils_1.getOffers(req.body.data, req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.negotiationApi = functions.https.onRequest(app);
//# sourceMappingURL=negotiationApi.js.map