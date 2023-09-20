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
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const utils_1 = require("../operations/utils");
const FIFTEEN_MINUTES = 15 * 60 * 1000;
function videoCreateCondition(task) {
    return __awaiter(this, void 0, void 0, function* () {
        let scheduleTime = yield getScheduleTime(task.operationUserId, task.user);
        if (!scheduleTime) {
            return false;
        }
        let now = new Date().getTime();
        if (scheduleTime.from - now < FIFTEEN_MINUTES) {
            return true;
        }
        return false;
    });
}
exports.videoCreateCondition = videoCreateCondition;
function getScheduleTime(operationUserId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            db.ref(`server/operationHub/calendar/${operationUserId}/availabilities`).orderByChild('userId').equalTo(userId).once('value', function (snapshot) {
                let result = snapshot.val();
                if (!result) {
                    resolve('');
                }
                let appointments = Object.keys(result).map(key => {
                    let appointment = result[key];
                    appointment.key = key;
                    return appointment;
                });
                resolve(appointments[0]);
            });
        });
    });
}
function videoCreateRun(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const userAccount = yield utils_1.getUserActiveAccount(task.user);
        const videoToken1 = yield createVideoToken(userAccount.name);
        const operationUserAccount = yield utils_1.getUserActiveAccount(task.operationUserId);
        const videoToken2 = yield createVideoToken(operationUserAccount.name);
        const roomName = `room ${new Date().getTime()}`;
        yield createVideoOperation(task.user, videoToken1, roomName, task.project);
        yield createVideoOperation(task.operationUserId, videoToken2, roomName, task.project);
        yield createReminderTask(task);
    });
}
exports.videoCreateRun = videoCreateRun;
function createVideoToken(identify) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = new AccessToken('ACde9becade1257930f33203e0cfaaa26d', 'SK85e7a31c2e5c92b9982b5ee92cf481b3', 'jMOUpsb5IfSJrQkFam6o2E3MzltX0QYD');
        // Assign the generated identity to the token
        token.identity = identify;
        const grant = new VideoGrant();
        // Grant token access to the Video API features
        token.addGrant(grant);
        return token.toJwt();
    });
}
function createVideoOperation(userId, videoToken, roomName, project) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        const videoOperation = {
            name: 'videoCall',
            type: 'videoOperation',
            userId: userId,
            status: 'waiting',
            roomName: roomName,
            videoToken: videoToken,
            project: project,
            time: new Date().getTime()
        };
        yield db.ref(`server/operationHub/${userId}/operations/`).push(videoOperation);
        yield utils_1.addNotification(userId, 'operation', 'videoCall');
    });
}
function createReminderTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        let scheduleTime = yield getScheduleTime(task.operationUserId, task.user);
        console.log(`Schedule time : ${JSON.stringify(scheduleTime)}`);
        let reminderTask = {
            active: true,
            reminderTime: scheduleTime.from,
            operationUserId: task.operationUserId,
            remindedFifteen: false,
            remindedTen: false,
            type: 'reminderTask',
            userId: task.user,
            time: new Date().getTime()
        };
        console.log(`Reminder Tasl : ${JSON.stringify(reminderTask)}`);
        db.ref('server').child(`/operationHub/taskManager`).push(reminderTask);
    });
}
//# sourceMappingURL=VideoCreateTask.js.map