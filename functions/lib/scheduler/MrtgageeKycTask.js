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
function mortgageeKycCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let kyc = yield utils_1.getKycDocument(task.userId, task.mortgagee);
        return kyc && kyc.signedDocument ? true : false;
    });
}
exports.mortgageeKycCondition = mortgageeKycCondition;
function mortgageeKycRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let kyc = yield utils_1.getKycDocument(task.userId, task.mortgagee);
        db.ref('server').child(`/operationHub/${task.mortgagee}/operations`).push({
            type: 'mortgageRequest',
            mortgageRequestId: task.mortgageRequestId,
            mortgageId: task.mortgageId,
            mortgageConditionAddress: task.mortgageConditionAddress,
            mortgageRequestAddress: task.mortgageRequestAddress,
            kyc: kyc.key,
            project: task.project,
            userId: task.userId,
            status: 'waiting',
            name: 'ApproveMortgage',
            time: new Date().getTime()
        });
        yield utils_1.addNotification(task.mortgagee, 'operation', 'ApproveMortgage');
        yield utils_1.scheduleVideoMeeting(task.mortgagee, task.userId, task.project, false);
        // await sendMails(task)
    });
}
exports.mortgageeKycRun = mortgageeKycRun;
function sendMails(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(task.mortgagee);
        let mail = {
            active: true,
            params: {
                name: userAccount.name
            },
            template: 'project.mortgage.mortgagee.notification',
            to: userAccount.email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
    });
}
//# sourceMappingURL=MrtgageeKycTask.js.map