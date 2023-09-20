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
const accountSid = 'ACde9becade1257930f33203e0cfaaa26d';
const authToken = 'b05780609ebf102e89da27a3785b4d46';
const client = require('twilio')(accountSid, authToken);
const utils_1 = require("./utils");
exports.sendSmsValidation = functions.database.ref(`server/operations/events/smsPhoneValidationTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let smsRequest = yield utils_1.getActiveRequest('smsPhoneValidation');
    console.log('VALIDATE SMS');
    if (smsRequest && smsRequest.phoneNumber) {
        console.log('START VALIDATING ' + JSON.stringify(smsRequest));
        let validationCode = Math.floor(100000 + Math.random() * 900000);
        client.messages
            .create({
            body: 'Validate your phone code: ' + validationCode,
            from: '+19412601541',
            to: smsRequest.phoneNumber
        })
            .then(message => console.log(message.sid))
            .done();
        db.ref('server').child('operations').child('events').child('smsPhoneValidation').child(smsRequest.key).update({ active: false });
        db.ref('server').child('smsValidation').child(smsRequest.userId).set({ validationCode: validationCode });
    }
    console.log('END VALIDATION SMS');
}));
exports.checkPhoneValidaion = functions.database.ref(`server/operations/events/checkPhoneValidationTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let validationRequest = yield utils_1.getActiveRequest('checkPhoneValidation');
    console.log('VALIDATE PHONE CODE');
    if (validationRequest && validationRequest.validationCode) {
        console.log('START VALIDATING ' + JSON.stringify(validationRequest));
        let userValidationnCode = yield getUserValidationCode(validationRequest.userId);
        console.log('userValidationnCode ' + JSON.stringify(userValidationnCode));
        let smsValidationOperation = yield utils_1.getSmsValidation(validationRequest.userId);
        if (userValidationnCode.validationCode === validationRequest.validationCode) {
            let userAccount = yield utils_1.getUserActiveAccount(validationRequest.userId);
            if (smsValidationOperation) {
                db.ref(`server/operationHub/${validationRequest.userId}/operations/${smsValidationOperation.key}`).update({
                    validation: 'success'
                });
            }
            db.ref('server').child('users').child(validationRequest.userId).child('accounts').child(userAccount.id).update({ phoneNumber: validationRequest.phoneNumber });
        }
        else {
            if (smsValidationOperation) {
                db.ref(`server/operationHub/${validationRequest.userId}/operations/${smsValidationOperation.key}`).update({
                    validation: 'failed'
                });
            }
        }
        db.ref('server').child('operations').child('events').child('checkPhoneValidation').child(validationRequest.key).update({ active: false });
    }
    console.log('END VALIDATE PHONE COD');
}));
function getUserValidationCode(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('smsValidation').child(userId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserValidationCode = getUserValidationCode;
//# sourceMappingURL=customerChanels.js.map