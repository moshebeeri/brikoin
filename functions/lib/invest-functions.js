"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();
exports.invest = functions.database.ref('/server/operations/invest').onWrite((change) => {
    let db = admin.database();
    let errors = db.ref('/server').child('errors');
    try {
        let nextOperation = getNextOperation(change);
        if (nextOperation) {
            nextOperation.executed = true;
            invest(nextOperation.user_id, nextOperation.amount);
            let executionPath = db.ref('/server').child('operations').child('addWallet').child(nextOperation.key);
            executionPath.set(nextOperation);
        }
    }
    catch (error) {
        errors.push(error);
    }
});
exports.getIvestments = functions.database.ref('/server/operations/investments').onWrite((change) => {
    const ref = change.after.ref.parent; // reference to the parent
    console.log(ref);
});
function invest(user_id, amount) {
    let db = admin.database();
    let ref = db.ref('/server');
    let blockChain = ref.child('blockChain');
    blockChain.child(user_id).push({
        amount: amount
    });
}
exports.invest = invest;
function getNextOperation(change) {
    let nextOperation;
    let walletOperations = JSON.parse(JSON.stringify(change.data));
    let operations = Object.keys(walletOperations).map(key => {
        let operation = walletOperations[key];
        operation.key = key;
        return operation;
    });
    const unExecutedOperations = operations.filter(operation => !operation.executed);
    if (unExecutedOperations.length > 0) {
        nextOperation = unExecutedOperations[0];
    }
    return nextOperation;
}
app.get('/invest/:userId/:amount/:projectId', (req, res) => {
    try {
        let db = admin.database();
        const userId = req.params.userId;
        const projectId = req.params.projectId;
        const amount = req.params.amount;
        let ref = db.ref('/server');
        let blockChain = ref.child('shadowBlockChain');
        blockChain.child(userId).child(projectId).push({
            projectId: projectId,
            amount: amount
        });
        send(res, 200, {
            message: 'Success'
        });
    }
    catch (e) {
        console.log(e);
        send(res, 500, { message: 'failed to invest' });
    }
});
app.get('/userInvestments/:userId/:projectId', (req, res) => {
    try {
        let db = admin.database();
        const userId = req.params.userId;
        const projectId = req.params.projectId;
        let ref = db.ref('/server');
        let blockChain = ref.child('shadowBlockChain');
        blockChain.child(userId).child(projectId);
        send(res, 200, {
            message: 'Success'
        });
    }
    catch (e) {
        console.log(e);
        send(res, 500, { message: 'failed to get userInvestments' });
    }
});
function send(res, code, body) {
    res.send({
        statusCode: code,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    });
}
//# sourceMappingURL=invest-functions.js.map