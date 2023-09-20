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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils_1 = require("./utils");
exports.handleUserRole = functions.database.ref(`server/operations/events/approveRoleRequestTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let roleRequest = yield utils_1.getActiveRequest('approveRoleRequest');
    console.log('Add RoleS');
    if (roleRequest.approve) {
        db.ref('server').child('usersRoles').child(roleRequest.role).child(roleRequest.userId).set({ 1: 1 });
        db.ref('server').child('userRoleRequest').child(roleRequest.userId).child(roleRequest.requestId).update({ approved: true });
    }
    else {
        db.ref('server').child('userRoleRequest').child(roleRequest.userId).child(roleRequest.requestId).update({ approved: false });
    }
    db.ref('server').child('operations').child('events').child('approveRoleRequest').child(roleRequest.key).update({ active: false });
    console.log('END Add Rules');
}));
exports.selectAppointment = functions.database.ref(`server/operations/events/selectAppointmentTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let selectAppointmentRequest = yield utils_1.getActiveRequest('selectAppointment');
    console.log(`selectAppointment ${JSON.stringify(selectAppointmentRequest)}`);
    if (selectAppointmentRequest && selectAppointmentRequest.userTo) {
        db.ref(`server/operationHub/calendar/${selectAppointmentRequest.userTo}/availabilities/${selectAppointmentRequest.calendarKey}`)
            .update(selectAppointmentRequest.selected ? {
            userId: selectAppointmentRequest.user,
            selected: selectAppointmentRequest.selected
        } : { userId: '', selected: false });
    }
    db.ref(`server/operations/events/selectAppointment/${selectAppointmentRequest.key}`).update({ active: false });
}));
exports.assignUserToProject = functions.database.ref(`server/operations/events/assignUserToProjectTrigger`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let assignRequest = yield utils_1.getActiveRequest('assignUserToProject');
    if (assignRequest.key) {
        let assignment = {};
        if (assignRequest.assignment === 'sellerLawyer') {
            let userActiveAccount = yield utils_1.getUserActiveAccount(assignRequest.sellerLawyer);
            assignment = { sellerLawyer: assignRequest.sellerLawyer, sellerLawyerAddress: userActiveAccount.accountId };
            db.ref('server').child('cases').child(assignRequest.sellerLawyer).push({
                projectId: assignRequest.projectId,
                projectAddress: assignRequest.projectAddress,
                seller: true
            });
        }
        if (assignRequest.assignment === 'trustee') {
            let userActiveAccount = yield utils_1.getUserActiveAccount(assignRequest.trustee);
            assignment = { trusteeAddress: userActiveAccount.accountId, trustee: assignRequest.trustee };
            db.ref('server').child('cases').child(assignRequest.trustee).push({
                projectId: assignRequest.projectId,
                trustee: true,
                projectAddress: assignRequest.projectAddress
            });
        }
        db.ref('server').child('projectsCollections').child('projects').child(assignRequest.projectId).update(assignment);
        db.ref('server').child('operations').child('events').child('assignUserToProject').child(assignRequest.key).update({ active: false });
    }
    console.log('END assignUserToProject');
}));
//# sourceMappingURL=userOperations.js.map