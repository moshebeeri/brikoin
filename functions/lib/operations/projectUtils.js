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
const utils_1 = require("./utils");
const admin = require('firebase-admin');
function sendEmailToLawyer(lawyerId, userId, projectAddress, orderId, side) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(userId);
        let project = yield utils_1.getProject(projectAddress);
        let order = yield utils_1.getPendingOrderById(orderId, projectAddress, '');
        console.log(`order : ${JSON.stringify(order)}`);
        let configuration = yield utils_1.getConfiguration();
        let lawyerAccount = yield utils_1.getUserActiveAccount(lawyerId);
        console.log(`: parseInt(order.amount) ${parseInt(order.amount)}`);
        console.log(`parseInt(order.price ? order.price : 1) ${parseInt(order.price ? order.price : 1)}`);
        sendEmail(project, `${configuration.env}/projectsView/${projectAddress}`, lawyerAccount.email, userAccount.phoneNumber || '', userAccount.name, order, side, lawyerAccount.name);
    });
}
exports.sendEmailToLawyer = sendEmailToLawyer;
function sendEmail(project, projectLink, email, userPhone, userName, order, side, lwayerName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`: parseInt(order.amount) ${parseInt(order.amount)}`);
        console.log(`parseInt(order.price ? order.price : 1) ${parseInt(order.price ? order.price : 1)}`);
        let mail = {
            active: true,
            params: {
                lwayerName: lwayerName,
                projectName: project.name,
                projectLink: projectLink,
                userPhone: userPhone,
                side: side,
                userName: userName,
                investment: parseInt(order.amount) * parseInt(order.price ? order.price : 1)
            },
            template: 'investment.order.chooseLawyer',
            to: email
        };
        console.log(`EMAIL: ${JSON.stringify(mail)}`);
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
        yield db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
    });
}
//# sourceMappingURL=projectUtils.js.map