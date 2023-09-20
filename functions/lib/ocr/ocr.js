var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const functions = require('firebase-functions');
const admin = require('firebase-admin');
exports.ocr = functions.database.ref(`server/operations/ocr/document`).onWrite((document) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    try {
        let operation = yield nextOperation();
        if (operation) {
            let key = Object.keys(operation)[0];
            operation[key].executed = true;
            let executionPath = db.ref('server').child('operations').child('project').child('initialOffer').child(key);
            executionPath.set(operation[key]);
        }
    }
    catch (error) {
        log(JSON.stringify(error));
    }
}));
function nextOperation() {
    return __awaiter(this, void 0, void 0, function* () {
        let nextOperation = yield getNextOperation();
        return nextOperation;
    });
}
function getNextOperation() {
    return new Promise((resolve, reject) => {
        try {
            const db = admin.database();
            db.ref(`server/operations/ocr/document`).orderByChild("executed").equalTo(false).limitToFirst(1).on("value", function (snapshot) {
                resolve(snapshot.val());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function log(message) {
    console.log(message);
}
//# sourceMappingURL=ocr.js.map