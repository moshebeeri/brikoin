"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const calculateMortgage_1 = require("./calculateMortgage");
function calculate(req) {
    console.log('START function');
    let mortgageCondition = getCondition(req.body.mortgageType, req.body.years * 12, req.body.amount, req.body.armInterestRate, req.body.fixedInterestRate);
    console.log(JSON.stringify(mortgageCondition));
    let amortizations = calculateMortgagePayments(mortgageCondition);
    return JSON.stringify(amortizations);
}
function calculateMortgagePayments(mortgageCondition) {
    let amortizations = calculateMortgage_1.calculateMortgage({
        'salePrice': mortgageCondition.salePrice,
        'interestRate': mortgageCondition.interestRate,
        'loanTermMonths': mortgageCondition.loanTermMonths,
        'propertyTaxRate': 0,
        'adjustFixedRateMonths': mortgageCondition.adjustFixedRateMonths,
        'adjustIntervalMonths': mortgageCondition.adjustIntervalMonths,
        'adjustInitialCap': mortgageCondition.adjustInitialCap,
        'adjustPeriodicCap': mortgageCondition.adjustPeriodicCap,
        'downPayment': '0%',
        'adjustLifetimeCap': mortgageCondition.adjustLifetimeCap,
        'startDate': new Date().toDateString()
    });
    return amortizations;
}
exports.calculateMortgagePayments = calculateMortgagePayments;
function getCondition(mortgageType, month, amount, armInterestRate, fixedInterestRate) {
    let mortgageCondition = {};
    mortgageCondition.salePrice = amount;
    switch (mortgageType) {
        case 'ARM3':
            mortgageCondition.interestRate = armInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustFixedRateMonths = 36;
            mortgageCondition.adjustIntervalMonths = 12;
            mortgageCondition.adjustInitialCap = 10;
            mortgageCondition.adjustPeriodicCap = 12;
            mortgageCondition.adjustLifetimeCap = 12;
            break;
        case 'ARM5':
            mortgageCondition.interestRate = armInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustFixedRateMonths = 60;
            mortgageCondition.adjustInitialCap = 10;
            mortgageCondition.adjustPeriodicCap = 12;
            mortgageCondition.adjustLifetimeCap = 12;
            break;
        case 'ARM7':
            mortgageCondition.interestRate = armInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustFixedRateMonths = 84;
            mortgageCondition.adjustInitialCap = 10;
            mortgageCondition.adjustPeriodicCap = 12;
            mortgageCondition.adjustLifetimeCap = 12;
            break;
        case 'ARM10':
            mortgageCondition.interestRate = armInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustFixedRateMonths = 120;
            mortgageCondition.adjustInitialCap = 10;
            mortgageCondition.adjustPeriodicCap = 12;
            mortgageCondition.adjustLifetimeCap = 12;
            break;
        case 'FIXED10':
            mortgageCondition.interestRate = fixedInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustInitialCap = 0;
            mortgageCondition.adjustPeriodicCap = 0;
            mortgageCondition.adjustLifetimeCap = 0;
            break;
        case 'FIXED15':
            mortgageCondition.interestRate = fixedInterestRate;
            mortgageCondition.loanTermMonths = month;
            mortgageCondition.adjustInitialCap = 0;
            mortgageCondition.adjustPeriodicCap = 0;
            mortgageCondition.adjustLifetimeCap = 0;
            break;
    }
    return mortgageCondition;
}
exports.getCondition = getCondition;
const app = express();
// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// build multiple CRUD interfaces:
app.post('/', (req, res) => res.send(calculate(req)));
app.get('/ping', (req, res) => res.send('pong'));
// Expose Express API as a single Cloud Function:
exports.calculate = functions.https.onRequest(app);
//# sourceMappingURL=calculator.js.map