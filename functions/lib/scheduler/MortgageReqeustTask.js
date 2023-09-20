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
function mortgageRequestCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        return true;
    });
}
exports.mortgageRequestCondition = mortgageRequestCondition;
function montageRequestRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let kyc = yield utils_1.getOrCreateKycDocument(task.userId, task.mortgagee);
        yield utils_1.getOrCreateKycOperation(task.userId, kyc);
        yield createUserMortgageKYCTask(task);
    });
}
exports.montageRequestRun = montageRequestRun;
function createUserMortgageKYCTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let newTask = {
            active: true,
            mortgagee: task.mortgagee,
            userId: task.userId,
            project: task.project,
            mortgageConditionAddress: task.mortgageConditionAddress,
            mortgageRequestAddress: task.mortgageRequestAddress,
            mortgageId: task.mortgageId,
            mortgageRequestId: task.mortgageRequestId,
            type: 'mortgageCheckKyc'
        };
        yield db.ref(`server/operationHub/taskManager`).push(newTask);
    });
}
//# sourceMappingURL=MortgageReqeustTask.js.map