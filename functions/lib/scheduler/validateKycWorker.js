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
const FlowManagerUtils_1 = require("./FlowManagerUtils");
function validateKycWorker(step, flow) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = yield FlowManagerUtils_1.getUserIdByRole(step.userRole, flow.order, flow.project);
        let kycOperation = yield utils_1.getUserKycOperation(userId);
        return { done: kycOperation ? kycOperation.status === 'operationDone' : false };
    });
}
exports.validateKycWorker = validateKycWorker;
//# sourceMappingURL=validateKycWorker.js.map