"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// TODO: Remember to set token using >> firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
// TODO: Remember to set token using >> firebase functions:config:set server="Firebase server root"
const stripe = require('stripe')('aa');
app.use(cors);
app.use(require('body-parser').raw({ type: '*/*' }));
app.get('/creditPayment/:token/:amount/:currency', (req, res) => {
    // Catch any unexpected errors to prevent crashing
    try {
        charge(req, res);
    }
    catch (e) {
        log(JSON.stringify(e));
        send(res, 500, {
            error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`
        });
    }
});
app.post('/receive', jsonParser, function (request, response) {
    let db = admin.database();
    let ref = db.ref(functions.config().server.root);
    log('RECIVING');
    if (request.body && request.body.data) {
        admin.auth().getUserByEmail(request.body.data.object.source.name)
            .then(function (userRecord) {
            let user = {
                userId: userRecord.uid,
                requestId: request.body.id,
                active: true,
            };
            ref.child('users').child(userRecord.uid).child('payments').push(request.body);
            ref.child('operations').child('events').child('receivedPayment').push(user);
            ref.child('operations').child('events').child('triggerPaymentsCheck').set({ requestId: request.body.request.id });
        })
            .catch(function (error) {
            ref.child('error').push(error);
        });
    }
    send(response, 200, {
        message: 'Success', result: request.body
    });
});
function log(message) {
    const db = admin.database();
    let logs = db.ref(functions.config().server.root).child('logs').child('orders');
    logs.push(message);
}
function send(res, code, body) {
    log(JSON.stringify(body));
    res.send({
        statusCode: code,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    });
}
function charge(req, res) {
    const token = req.params.token;
    const amount = req.params.amount;
    const currency = req.params.currency;
    // Charge card
    stripe.charges.create({
        amount,
        currency,
        description: 'Firebase Example',
        source: token
    }).then(charge => {
        send(res, 200, {
            message: 'Success',
            charge
        });
    }).catch(err => {
        log(JSON.stringify(err));
        send(res, 500, {
            error: err.message
        });
    });
}
exports.charge = charge;
exports.payment = functions.https.onRequest(app);
//# sourceMappingURL=payment-functions.js.map