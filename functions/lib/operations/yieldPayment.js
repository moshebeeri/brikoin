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
exports.payPropertyYield = functions.database.ref(`server/operations/events/payYieldRequestTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let yieldRequest = yield getActiveYieldRequests();
    console.log('START YIELDS PAYMENTS');
    if (yieldRequest) {
        // console.log('START YIELD PAYMENTS')
        let holders = yield utils_1.getProjectHolders(yieldRequest.projectAddress);
        // console.log('UPDATE HOLDERS BALANCE')
        let holderToBalnace = {};
        if (holders) {
            holders.forEach((holder) => __awaiter(this, void 0, void 0, function* () {
                // console.log('UPDATE HOLDER BALANCE')
                if (holder.holdings > 0) {
                    let activeAccount = yield utils_1.getUserActiveAccount(holder.holder);
                    holderToBalnace[holder.holder] = activeAccount.stonesBalance;
                    console.log('ACCOUNT CURRENT BALANCE ' + activeAccount.stonesBalance);
                }
            }));
        }
        yield wallet_1.payIncome(yieldRequest.projectAddress, yieldRequest.yieldAmount);
        console.log('TRANSACTION YIELD PAYMENTS DONE');
        db.ref('server').child('operations').child('events').child('payYieldRequest').child(yieldRequest.key).update({ active: false });
        // console.log('UPDATE HOLDERS BALANCE')
        if (holders) {
            holders.forEach((holder) => __awaiter(this, void 0, void 0, function* () {
                console.log('UPDATE HOLDER BALANCE');
                if (holder.holdings > 0) {
                    let activeAccount = yield utils_1.getUserActiveAccount(holder.holder);
                    // console.log('UPDATE HOLDER ACCOUNT')
                    console.log(JSON.stringify(holder));
                    console.log(JSON.stringify(activeAccount));
                    utils_1.updateUserBalance(holder.holder, activeAccount.accountId, activeAccount.id, holderToBalnace[holder.holder], yieldRequest.projectAddress);
                }
            }));
        }
        utils_1.updateProjectChange(yieldRequest.projectAddress);
    }
}));
function getActiveYieldRequests() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/payYieldRequest').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let yiledRequests = Object.keys(results).map(key => {
                            let request = results[key];
                            request.key = key;
                            return request;
                        });
                        resolve(yiledRequests[0]);
                    }
                    return '';
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
//# sourceMappingURL=yieldPayment.js.map