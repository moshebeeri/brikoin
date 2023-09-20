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
const projectsSearchEngine_1 = require("./projectsSearchEngine");
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
app.post('/findProjects', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let results = yield projectsSearchEngine_1.findProjects(' ');
    res.send(JSON.stringify({ data: results }));
}));
app.post('/getProjectByAddress', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getProjectByAddress  ${JSON.stringify(req.body.data)}`);
    let project = yield projectsSearchEngine_1.findProjectsByAddress(req.body.data);
    res.send(JSON.stringify({ data: project }));
}));
app.post('/getSupProjects', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getSupProjects   ${JSON.stringify(req.body.data)}`);
    let projects = yield projectsSearchEngine_1.findSubProject(req.body.data);
    res.send(JSON.stringify({ data: projects }));
}));
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.projects = functions.https.onRequest(app);
//# sourceMappingURL=projectsApi.js.map