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
const utils_1 = require("./utils");
const apiUtils_1 = require("./apiUtils");
const projectUtils_1 = require("./projectUtils");
const FlowManagerUtils_1 = require("../scheduler/FlowManagerUtils");
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
app.post('/sumbitOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`submiting   last version offer ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.createPendingRequest(req.body.data, req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/updateOffer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`updating last version offer ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.updatePendingOrder(req.body.data, req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/getProjectStatus', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getProjectStatus  ${JSON.stringify(req.body.data)}}`);
    let status = yield utils_1.getProjectStatus(req.body.data, req.user.uid);
    console.log(`status ${JSON.stringify(status)}`);
    res.send(JSON.stringify({ data: status }));
}));
app.post('/getUserOrder', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`submiting last version offer ${JSON.stringify(req.body.data)}}`);
    let pendingOrder = yield utils_1.getPendingOrder(req.user.uid, req.body.data);
    res.send(JSON.stringify({ data: pendingOrder }));
}));
app.post('/getUserFlowWizard', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getUserFlowInstance    ${JSON.stringify(req.body.data)}}`);
    let pendingOrders = yield utils_1.getAllUserPendingOrders(req.user.uid, req.body.data);
    if (pendingOrders && pendingOrders.length > 0) {
        let wizardsSteps = yield Promise.all(pendingOrders.map((order) => FlowManagerUtils_1.getUserWizardSteps(order, req.user.uid)));
        res.send(JSON.stringify({ data: wizardsSteps }));
    }
    else {
        res.send(JSON.stringify({ data: '' }));
    }
}));
app.post('/getUserFlowById', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getUserFlowInstance     ${JSON.stringify(req.body.data)}}`);
    let instance = yield FlowManagerUtils_1.getFlowInstanceById(req.body.data);
    if (instance) {
        let wizardsSteps = {
            steps: yield FlowManagerUtils_1.getUserWizardStepsByInstance(instance, req.user.uid),
            project: instance.project,
            flowId: instance.key,
            seller: instance.sellerId ? yield utils_1.getPublicUserById(instance.sellerId) : '',
            buyer: instance.buyerId ? yield utils_1.getPublicUserById(instance.buyerId) : '',
            lawyerBuyer: instance.lawyerBuyerId ? yield utils_1.getPublicUserById(instance.lawyerBuyerId) : '',
            lawyerSeller: instance.lawyerSellerId ? yield utils_1.getPublicUserById(instance.lawyerSellerId) : '',
            order: yield utils_1.getPendingOrderById(instance.orderId, instance.project, '')
        };
        res.send(JSON.stringify({ data: wizardsSteps }));
    }
    else {
        res.send(JSON.stringify({ data: '' }));
    }
}));
app.post('/getUserFlowsWizard', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getUserFlowInstance   ${JSON.stringify(req.body.data)}}`);
    let flowInstances = yield utils_1.getUserFlowInstances(req.user.uid);
    if (flowInstances && flowInstances.length > 0) {
        let wizardsSteps = yield Promise.all(flowInstances.map((instance) => __awaiter(this, void 0, void 0, function* () {
            return {
                steps: yield FlowManagerUtils_1.getUserWizardStepsByInstance(instance, req.user.uid),
                project: instance.project,
                flowId: instance.key,
                seller: instance.sellerId ? yield utils_1.getPublicUserById(instance.sellerId) : '',
                buyer: instance.buyerId ? yield utils_1.getPublicUserById(instance.buyerId) : '',
                lawyerBuyer: instance.lawyerBuyerId ? yield utils_1.getPublicUserById(instance.lawyerBuyerId) : '',
                lawyerSeller: instance.lawyerSellerId ? yield utils_1.getPublicUserById(instance.lawyerSellerId) : '',
                order: yield utils_1.getPendingOrderById(instance.orderId, instance.project, '')
            };
        })));
        res.send(JSON.stringify({ data: wizardsSteps }));
    }
    else {
        res.send(JSON.stringify({ data: '' }));
    }
}));
app.post('/searchLawyer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`searchLawyer  for ${JSON.stringify(req.body.data)}}`);
    let lawyers = yield utils_1.searchLawyer(req.body.data.text);
    res.send(JSON.stringify({ data: lawyers }));
}));
app.post('/getUserById', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`getUserById for ${JSON.stringify(req.body.data)}}`);
    let user = yield utils_1.getPublicUserById(req.body.data);
    res.send(JSON.stringify({ data: user }));
}));
app.post('/assignBuyerLawyer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`submiting   assignBuyerLawyer ${JSON.stringify(req.body.data)}}`);
    let pendingOrder = yield utils_1.getPendingOrder(req.user.uid, req.body.data.project);
    console.log(`submiting   pendingOrder ${JSON.stringify(pendingOrder)}}`);
    if (pendingOrder) {
        console.log(`submiting  lawyerId ${JSON.stringify(req.body.data.lawyerId)}}`);
        yield utils_1.updateBuyerOrderLaweyer(req.body.data.project, pendingOrder.key, req.body.data.lawyerId, req.body.data.operationKey, req.user.uid, pendingOrder.flowId);
        console.log('SENDING EMAIL');
        yield projectUtils_1.sendEmailToLawyer(req.body.data.lawyerId, req.user.uid, req.body.data.project, pendingOrder.key, 'Buyer');
    }
    res.send(JSON.stringify({ data: 'done' }));
}));
app.post('/assignSellerLawyer', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`submiting assignSellerLawyer ${JSON.stringify(req.body.data)}}`);
    console.log(`submiting  lawyerId ${JSON.stringify(req.body.data.lawyerId)}}`);
    let order = yield utils_1.getPendingOrderById(req.body.data.orderId, req.body.data.project, '');
    if (order && order.sellerId === req.user.uid) {
        yield utils_1.updateSellerOrderLaweyer(req.body.data.project, req.body.data.orderId, req.body.data.lawyerId, req.body.data.operationKey, req.user.uid, order.flowId);
        console.log('SENDING EMAIL');
        yield projectUtils_1.sendEmailToLawyer(req.body.data.lawyerId, req.user.uid, req.body.data.project, req.body.data.orderId, 'Seller');
    }
    res.send(JSON.stringify({ data: 'done' }));
}));
app.post('/convertDocumentToHtml', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`convertDocumentToHtml   ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.convertDocumentToHtml(req.body.data, req.user.uid);
    console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/updateOriginalFile', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`updateOriginalFile    ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.updateOriginalFile(req.body.data, req.user.uid);
    console.log(`convertDocumentToHtml DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/operationDone', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`operation done  latest version ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.updateOperationDone(req.body.data, req.user.uid);
    console.log(`OPERATION DONE RESULT: ${resultId}`);
    res.send(JSON.stringify({ data: resultId }));
}));
app.post('/updateDocument', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(`update document  ${JSON.stringify(req.body.data)}}`);
    let resultId = yield utils_1.updateDocumentAttributes(req.body.data, req.user.uid);
    res.send(JSON.stringify({ data: resultId }));
}));
// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.projectApi = functions.https.onRequest(app);
//# sourceMappingURL=projectOperation.js.map