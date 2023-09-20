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
const utils_1 = require("../operations/utils");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
exports.triggerTest = functions.database.ref(`server/test/trigger/trigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    });
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    });
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    });
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    });
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    });
}));
exports.triggerTestEvents = functions.database.ref(`server/operations/events/triggerTestEvents`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('testEvents');
    if (request) {
        db.ref(`server/operations/events/testEvents/${request.key}`).update({
            active: false
        });
        db.ref(`server/operations/events/triggerTestEvents/`).update({
            time: new Date().getTime()
        });
    }
}));
//# sourceMappingURL=triggerJob.js.map