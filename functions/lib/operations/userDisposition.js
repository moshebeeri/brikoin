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
exports.userDisposition = functions.database.ref(`server/operations/events/dispositionTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let dispositionRequests = yield utils_1.getActiveRequests('dispositionRequest');
    console.log('START DISPOSITION');
    if (dispositionRequests) {
        dispositionRequests.forEach((dispositionRequest) => __awaiter(this, void 0, void 0, function* () {
            let activeAccount = yield utils_1.getUserActiveAccount(dispositionRequest.userId);
            yield wallet_1.setUserDisposition(activeAccount.accountId, dispositionRequest.dispositionState);
            db.ref('server').child('operations').child('events').child('dispositionRequest').child(dispositionRequest.key).update({ active: false });
            db.ref('server').child('users').child(dispositionRequest.userId).child('accounts').child(activeAccount.id).update({ disposition: dispositionRequest.dispositionState });
        }));
    }
    console.log('END DISPOSITION');
}));
//# sourceMappingURL=userDisposition.js.map