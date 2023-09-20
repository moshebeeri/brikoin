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
const utils_1 = require("./utils");
const wallet_1 = require("./wallet");
exports.userFeesState = functions.database.ref(`server/operations/events/feeTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let feesRequest = yield utils_1.getActiveRequest('feeRequest');
    console.log('START FEES');
    if (feesRequest) {
        console.log('START SET FEES ' + JSON.stringify(feesRequest));
        let activeAccount = yield utils_1.getUserActiveAccount(feesRequest.userId);
        yield wallet_1.setUserFeeStatus(activeAccount.accountId, feesRequest.feesState);
        db.ref('server').child('operations').child('events').child('feeRequest').child(feesRequest.key).update({ active: false });
        db.ref('server').child('users').child(feesRequest.userId).child('accounts').child(activeAccount.id).update({ feeState: feesRequest.feesState });
    }
    console.log('END FEES');
}));
exports.clearFees = functions.database.ref(`server/operations/events/clearFeesTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let feesRequest = yield utils_1.getActiveRequest('clearFeeRequest');
    console.log('START FEES');
    if (feesRequest) {
        yield wallet_1.clearFees();
        db.ref('server').child('operations').child('events').child('clearFeeRequest').child(feesRequest.key).update({ active: false });
        yield utils_1.updateTotalFees(db, admin);
    }
    console.log('END FEES');
}));
exports.userFeesRatio = functions.database.ref(`server/operations/events/setFeeTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let feesRequest = yield utils_1.getActiveRequest('setFeeRequest');
    console.log('START SET FEES ' + JSON.stringify(feesRequest));
    if (feesRequest) {
        yield wallet_1.setUserFeeRatio(feesRequest.buyingFee, feesRequest.sellingFee);
        db.ref('server').child('operations').child('events').child('setFeeRequest').child(feesRequest.key).update({ active: false });
    }
    console.log('END SET FEES');
}));
//# sourceMappingURL=userFeesState.js.map