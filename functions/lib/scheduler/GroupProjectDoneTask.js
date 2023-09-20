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
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const admin = require('firebase-admin');
function triggerGroupDoneCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(task.groupId);
        if (!group.active) {
            return true;
        }
        let orders = yield Promise.all(Object.keys(group.members)
            .map((key) => utils_1.getMemberOrder(group.project, group.members[key], task.groupId))
            .filter((member) => member.order));
        let reserved = orders.map((order) => (order.order.reserved ? 1 : 0)).reduce(reducer);
        if (reserved === Object.keys(group.members).length) {
            return true;
        }
        return false;
    });
}
exports.triggerGroupDoneCondition = triggerGroupDoneCondition;
function triggerGroupDoneRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(task.groupId);
        if (!group.active) {
            return;
        }
        let projectGroups = yield utils_1.getProjectGroups(group.project, '', false);
        let otherGroups = projectGroups.filter((group) => group.id !== task.groupId);
        if (otherGroups.length > 0) {
            yield Promise.all(otherGroups.map((group) => closeGroup(group.id)));
            yield Promise.all(otherGroups.map((group) => __awaiter(this, void 0, void 0, function* () {
                let orders = yield Promise.all(Object.keys(group.members)
                    .map((key) => utils_1.getMemberOrder(group.project, group.members[key], task.groupId))
                    .filter((member) => member.order));
                yield Promise.all(orders.map((order) => cancelUserOrder(order.order)));
            })));
        }
    });
}
exports.triggerGroupDoneRun = triggerGroupDoneRun;
function closeGroup(group) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child(`/groups/${group.id}`).set({
            active: false
        });
        return true;
    });
}
function cancelUserOrder(order) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child(`/projects/pendingOrders/${order.project}/${order.key}`).set({
            active: false
        });
        yield notifyUserCancel(order);
        if (order.reseved) {
            yield notifyTrusteeCancel(order);
        }
    });
}
function notifyUserCancel(order) {
    return __awaiter(this, void 0, void 0, function* () {
        yield utils_1.addNotificationWithParams(order.userId, 'investmentOrder', 'canceledProjectSold', {
            orderId: order.key,
            project: order.project
        });
        let project = yield utils_1.getProject(order.project);
        let user = yield utils_1.getUserActiveAccount(order.userId);
        yield sendEmail(project, user.mail, order);
    });
}
function notifyTrusteeCancel(order) {
    return __awaiter(this, void 0, void 0, function* () {
        let project = yield utils_1.getProject(order.project);
        yield utils_1.addNotificationWithParams(project.trustee, 'investmentOrder', 'canceledProjectSold', {
            orderId: order.key,
            project: order.project
        });
    });
}
function sendEmail(project, email, order) {
    return __awaiter(this, void 0, void 0, function* () {
        let mail = {
            active: true,
            params: {
                projectName: project.name,
                investment: parseInt(order.amount) * parseInt(order.price),
                reason: 'PROJECT SOLD'
            },
            template: 'investment.order.canceled',
            to: email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
        yield db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
    });
}
//# sourceMappingURL=GroupProjectDoneTask.js.map