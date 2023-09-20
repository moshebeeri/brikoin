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
const collections_1 = require("./collections");
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
app.post('/duplicateProject', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`duplicateProject  ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.duplicateProperty(req.body.data.id);
    console.log(`duplicateProject DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/deleteLoadingProject', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`deleteLoadingProject   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.deleteProperty(req.body.data.id, req.user.uid);
    console.log(`deleteLoadingProject DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/loadingProjectReviewed', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`loadingProjectReviewed   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.propertyReviewed(req.body.data.id, req.user.uid);
    console.log(`propertyReviewed DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/loadingProjectApproved', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`loadingProjectApproved   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.propertyApproved(req.body.data.id, req.user.uid);
    console.log(`loadingProjectApproved DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/getParentProjects', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getParentProjects 	  ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.getParentProjects();
    console.log(`getParentProjects DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/assignToParentProject', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`assignProjectToParent   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield collections_1.assignProjectToParent(req.body.data.parentId, req.body.data.id);
    console.log(`assignProjectToParent DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/getLoadingProjects', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getLoadingProjects `);
    let resultId = yield collections_1.getLoadingProjects(req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.collectionsApi = functions.https.onRequest(app);
//# sourceMappingURL=collectionsApi.js.map