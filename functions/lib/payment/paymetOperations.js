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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const url = require('url');
const app = express();
const router = express.Router(); // get an instance of the express Router
function createClientIDPass() {
    return {
        ClientID: '10377',
        Password: '5Xt8UxWzX5bVXps'
    };
}
const successResponse = (response) => {
};
const failedResponse = (err) => {
};
const payment = (request) => __awaiter(this, void 0, void 0, function* () {
    console.log(`@ const payment = async (paymentRequest: PaymentRequest) => `);
    request.ClientIDPass = createClientIDPass();
    console.log(`payment POST data => ${JSON.stringify(request)}`);
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://secure.e-c.co.il/RestAPI/api/DoDeal', {
                body: JSON.stringify(request),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                method: 'POST',
                mode: 'no-cors'
            });
            let finalResult = yield response.json();
            console.log(finalResult);
            resolve(finalResult);
        }
        catch (e) {
            console.log(e.message);
            failedResponse(e.message);
            reject(e);
        }
    }));
});
router.use((req, res, next) => {
    // do logging
    // console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use('/', router);
router.route('/easyCard/pay')
    .post((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        console.log();
        console.log(JSON.stringify(req.body));
        // let db = admin.database()
        //c onst card = new CardDetails('4580101900056793', '03', '22', '12222222227', '479')
        console.log('yeyyy');
        const ret = yield payment({
            cardDetails: { CardNumber: req.body.data.card.number,
                Month: req.body.data.card.month,
                Year: req.body.data.card.year,
                TZ: req.body.data.card.tz,
                CVV: req.body.data.card.cvc },
            ExternalID: req.body.data.externalId,
            TotalSum: req.body.data.product.Cost,
            MType: req.body.data.payment.mType,
            DealType: req.body.data.payment.dealType,
            Opt: req.body.data.payment.opt,
            ActionMethod: req.body.data.payment.actionMethod,
            JsonProductsList: JSON.stringify([req.body.data.product])
        });
        // return res.status(200).send(ret);
        let paramsResults = JSON.stringify(ret);
        return res.status(200).send({ data: { response: url.parse('test/?' + paramsResults.substring(3, paramsResults.length - 3), { parseQueryString: true }).query, params: {
                    externalId: req.body.data.externalId,
                    product: req.body.data.product,
                    paymentInfo: req.body.data.payment
                } } });
    }
    catch (error) {
        console.log(`error occurred easyCard/pay\n ${JSON.stringify(req.body)} message: ${error.message}`);
        return res.status(500).send({ data: { errorMessage: error.message } });
    }
}));
router.route('/test')
    .post((req, res) => __awaiter(this, void 0, void 0, function* () {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        console.log(JSON.stringify(req.body));
        res.status(200).send({ data: { test: req.body, method: 'POST' } });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
// Expose Express API as a single Cloud Function:
exports.paymentsService = functions.https.onRequest(app);
//# sourceMappingURL=paymetOperations.js.map