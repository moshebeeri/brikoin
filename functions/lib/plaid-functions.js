"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plaid = require('plaid');
const express = require('express');
const functions = require('firebase-functions');
const app = express();
const admin = require('firebase-admin');
// TODO: Remember to set token using >> firebase functions:config:set plaid.token="SECRET_PLAID_TOKEN_HERE"
const plaidClient = new plaid.Client('5b35001b64b5a20011aea64e', functions.config().plaid.token, 'dee1972b42cd7c46291cb03ad8d7aa', plaid.environments.sandbox);
function send(res, code, body) {
    res.send({
        statusCode: code,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    });
}
function handlePlaidRequest(db, req, res) {
    try {
        const token = req.params.token;
        const accountId = req.params.accountId;
        const userId = req.params.userId;
        let ref = db.ref('/server');
        let payment = ref.child('payments');
        let bankToken = payment.child('bankTokens');
        bankToken.set('start');
        plaidClient.exchangePublicToken(token).then(respones => {
            let accessToken = respones.access_token;
            bankToken.child('accessToken').push(respones);
            // Generate a bank account token
            plaidClient.createStripeToken(accessToken, accountId).then(res => {
                let bankAccountToken = res.stripe_bank_account_token;
                bankToken.child(userId).set(bankAccountToken);
            }).catch(function (error) {
                payment.child('error').push(error);
            });
        }).catch(function (error) {
            payment.child('error').push(error);
        });
        send(res, 200, {
            message: 'Success',
            token
        });
    }
    catch (e) {
        console.log(e);
        send(res, 500, { message: 'failed to create token' });
    }
}
exports.handlePlaidRequest = handlePlaidRequest;
app.get('/createPlaidToken/:token/:accountId/:userId', (req, res) => {
    const db = admin.database();
    handlePlaidRequest(db, req, res);
});
exports.plaid = functions.https.onRequest(app);
//# sourceMappingURL=plaid-functions.js.map