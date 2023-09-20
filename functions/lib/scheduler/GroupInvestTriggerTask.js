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
const admin = require('firebase-admin');
const reducer = (accumulator, currentValue) => accumulator + currentValue;
function triggerGroupInvestmentCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(task.groupId);
        if (!group.active) {
            return false;
        }
        let project = yield utils_1.getProject(group.project);
        let orders = yield Promise.all(Object.keys(group.members).map((key) => utils_1.getMemberOrder(group.project, group.members[key], task.groupId)));
        let ordersSum = orders
            .map((order) => (order.order ? parseInt(order.order.amount) * parseInt(order.order.price) : 0))
            .reduce(reducer);
        console.log(`project target ${project.target} group investments sum ${ordersSum}`);
        if (parseInt(project.target) === ordersSum) {
            return true;
        }
        return false;
    });
}
exports.triggerGroupInvestmentCondition = triggerGroupInvestmentCondition;
function triggerGroupInvestmentRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(task.groupId);
        let project = yield utils_1.getProject(group.project);
        yield updateGroupFired(task.groupId);
        let orders = yield Promise.all(Object.keys(group.members).map((key) => utils_1.getMemberOrder(group.project, group.members[key], task.groupId)));
        yield Promise.all(orders.map((order) => triggerUserProcessOrder(order.userId, project.address, order.order.key)));
        yield createGroupProjectDoneTask(task);
    });
}
exports.triggerGroupInvestmentRun = triggerGroupInvestmentRun;
function triggerUserProcessOrder(userId, project, orderPendingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        yield db.ref('/server/operations/events/processOrderNow/').push({
            active: true,
            projectAddress: project,
            pendingOrderId: orderPendingId,
            userId: userId
        });
        yield db.ref('/server/operations/events/triggerProcessOrderNow/').set({
            time: new Date().getTime()
        });
    });
}
function updateGroupFired(groupsId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        yield db.ref(`/server/groups/${groupsId}/`).update({
            fired: true
        });
    });
}
function createGroupProjectDoneTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        console.log(`createGroupProjectDoneTask creation`);
        let scheduleTask = {
            active: true,
            groupId: task.groupId,
            type: 'triggerGroupDone',
            time: new Date().getTime()
        };
        console.log(`createGroupProjectDoneTask Task : ${JSON.stringify(scheduleTask)}`);
        db.ref('server').child(`/operationHub/taskManager`).push(scheduleTask);
    });
}
//# sourceMappingURL=GroupInvestTriggerTask.js.map