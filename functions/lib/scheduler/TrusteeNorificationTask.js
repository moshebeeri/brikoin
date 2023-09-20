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
const admin = require('firebase-admin');
const utils_1 = require("../operations/utils");
function trusteeNotificationCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
exports.trusteeNotificationCondition = trusteeNotificationCondition;
function trusteeNotificationRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(task.trustee);
        let mail = {
            active: true,
            params: {
                name: userAccount.name
            },
            template: 'project.investment.trustee.notification',
            to: userAccount.email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
    });
}
exports.trusteeNotificationRun = trusteeNotificationRun;
//# sourceMappingURL=TrusteeNorificationTask.js.map