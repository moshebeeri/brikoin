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
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;
function reminderTasktCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let now = new Date().getTime();
        if (task.reminderTime - now < FIFTEEN_MINUTES && !task.remindedFifteen) {
            return true;
        }
        if (task.reminderTime - now < TEN_MINUTES && !task.remindedTen) {
            return true;
        }
        if (task.reminderTime - now < FIVE_MINUTES) {
            return true;
        }
        return false;
    });
}
exports.reminderTasktCondition = reminderTasktCondition;
function reminderRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!task.remindedFifteen) {
            yield sendMails(task.operationUserId, 15);
            yield sendMails(task.userId, 15);
            yield createReminderTask(task, true, false);
            return;
        }
        if (!task.remindedTen) {
            yield sendMails(task.operationUserId, 10);
            yield sendMails(task.userId, 10);
            yield createReminderTask(task, true, true);
            return;
        }
        yield sendMails(task.operationUserId, 5);
        yield sendMails(task.userId, 5);
    });
}
exports.reminderRun = reminderRun;
function createReminderTask(task, remindedFifteen, remindedTen) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server').child(`/operationHub/taskManager`).push({
            active: true,
            operationUserId: task.operationUserId,
            reminderTime: task.reminderTime,
            remindedFifteen: remindedFifteen,
            remindedTen: remindedTen,
            type: 'reminderTask',
            userId: task.userId,
            time: new Date().getTime()
        });
    });
}
function sendMails(user, time) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let mail = {
            active: true,
            params: {
                name: userAccount.name,
                time: time,
            },
            template: 'project.scheduler.meeting.reminder',
            to: userAccount.email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
    });
}
//# sourceMappingURL=RemainderTask.js.map