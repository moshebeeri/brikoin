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
const wallet_1 = require("./wallet");
exports.inviteUser = functions.database
    .ref(`server/operations/events/inviteUserTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let inviteUser = yield utils_1.getActiveRequest('inviteUser');
    if (inviteUser.userId) {
        yield inviteUser(inviteUser.creator, inviteUser.userId, inviteUser.groupId);
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('inviteUser')
            .child(inviteUser.key)
            .update({ active: false });
    }
}));
function inviteUser(creator, userId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(groupId);
        if (group.creator === creator) {
            let db = admin.database();
            let configuration = yield utils_1.getConfiguration();
            if (configuration.useBlockchain) {
                yield wallet_1.inviteUserGroup(group.creator, group.groupAddress, userId);
            }
            yield db.ref(`server/groups/${groupId}/members/`).push({
                status: 'Invited',
                userId: userId
            });
            yield db.ref(`server/groups/changed/${group.project}`).set({
                time: new Date().getTime()
            });
            yield utils_1.addNotificationWithParams(userId, 'groups', 'invitation', { project: group.project });
            yield utils_1.addNotificationWithParams(creator, 'groups', 'invitationDone', { project: group.project });
            yield sendMails(userId, group);
            return { sucssess: true };
        }
        return { sucssess: false };
    });
}
exports.inviteUser = inviteUser;
const runtimeGroupVote = {
    timeoutSeconds: 300
};
exports.createGroupVote = functions
    .runWith(runtimeGroupVote)
    .database.ref(`server/operations/events/addGroupVoteTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let groupVote = yield utils_1.getActiveRequest('addGroupVote');
    let configuration = yield utils_1.getConfiguration();
    if (groupVote.groupId) {
        let group = yield utils_1.getGroup(groupVote.groupId);
        let userIsGroupRepresentation = yield wallet_1.isGroupRepresentative(group.groupAddress, groupVote.userId);
        console.log(`userIsGroupRepresentation ${userIsGroupRepresentation}`);
        if (userIsGroupRepresentation) {
            yield wallet_1.addGroupVote(groupVote.documentMd5, groupVote.type, group.groupAddress, group.creator);
            console.log(`vote added  ${groupVote.documentMd5}`);
            yield db.ref(`server/groups/${groupVote.groupId}/votes/`).push({
                subject: groupVote.subject,
                documentMd5: groupVote.documentMd5,
                documentUrl: groupVote.documentUrl
            });
            yield db.ref(`server/groups/changed/${group.project}`).set({
                time: new Date().getTime()
            });
            let members = getGroupMembers(group);
            console.log(`members   ${JSON.stringify(members)}`);
            yield Promise.all(members.map((member) => __awaiter(this, void 0, void 0, function* () {
                let votingRights = yield wallet_1.isVotingMember(group.groupAddress, member.userId);
                console.log(`votingRights   ${JSON.stringify(member)}`);
                if (votingRights) {
                    yield createVotingOperation(member.userId, groupVote.subject, groupVote.documentUrl, groupVote.documentMd5, groupVote.type, group.project);
                    yield utils_1.addNotificationWithParams(member.userId, 'groups', 'votes', {
                        project: group.project,
                        subject: groupVote.subject,
                        documentUrl: groupVote.documentUrl
                    });
                }
            })));
        }
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('addGroupVote')
            .child(groupVote.key)
            .update({ active: false });
    }
}));
exports.addGroupRepresentor = functions.database
    .ref(`server/operations/events/groupRepresentedTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let groupRepresented = yield utils_1.getActiveRequest('groupRepresented');
    let configuration = yield utils_1.getConfiguration();
    if (groupRepresented.groupId) {
        let group = yield utils_1.getGroup(groupRepresented.groupId);
        if (group.creator === groupRepresented.creator) {
            if (configuration.useBlockchain) {
                yield wallet_1.addGroupRpresentive(group.groupAddress, group.creator, groupRepresented.userId);
            }
            yield db.ref(`server/groups/${groupRepresented.groupId}/representatives/`).push({
                userId: groupRepresented.userId
            });
        }
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('groupRepresented')
            .child(groupRepresented.key)
            .update({ active: false });
    }
}));
exports.groupVote = functions.database
    .ref(`server/operations/events/groupVoteTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let groupVote = yield utils_1.getActiveRequest('groupVote');
    if (groupVote.groupId) {
        console.log('start group voting');
        let group = yield utils_1.getGroup(groupVote.groupId);
        console.log('voting');
        let votingResults = yield wallet_1.vote(groupVote.userId, groupVote.documentMd5, groupVote.vote, group.groupAddress);
        yield db.ref(`server/groups/${groupVote.groupId}/votes/${groupVote.voteId}/results`).push({
            result: groupVote.vote
        });
        console.log('voting done');
        yield db.ref(`server/groups/${groupVote.groupId}/votes/${groupVote.voteId}`).update(votingResults);
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('groupVote')
            .child(groupVote.key)
            .update({ active: false });
    }
}));
exports.groupPaymentStatus = functions.database
    .ref(`server/operations/events/groupPaymentStatusTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let groupPaymentStatus = yield utils_1.getActiveRequest('groupPaymentStatus');
    let configuration = yield utils_1.getConfiguration();
    if (groupPaymentStatus.groupId) {
        let group = yield utils_1.getGroup(groupPaymentStatus.groupId);
        let isVotingMember = configuration.useBlockchain
            ? yield wallet_1.updatePaymentStatus(group.groupAddress, groupPaymentStatus.userId, groupPaymentStatus.trustee, groupPaymentStatus.amount, groupPaymentStatus.addOperation)
            : true;
        yield db.ref(`server/groups/${groupPaymentStatus.groupId}/members/${groupPaymentStatus.memberId}`).update({
            votingRights: isVotingMember
        });
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('groupPaymentStatus')
            .child(groupPaymentStatus.key)
            .update({ active: false });
    }
}));
exports.acceptInvatation = functions.database
    .ref(`server/operations/events/acceptInvitationTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let configuration = yield utils_1.getConfiguration();
    let acceptInvitation = yield utils_1.getActiveRequest('acceptInvitation');
    if (acceptInvitation.userId) {
        yield db.ref(`server/groups/${acceptInvitation.groupId}/members/${acceptInvitation.memberId}`).update({
            status: 'Active'
        });
        let group = yield utils_1.getGroup(acceptInvitation.groupId);
        if (configuration.useBlockchain) {
            yield wallet_1.joinGroup(group.groupAddress, acceptInvitation.userId);
        }
        yield db.ref(`server/groups/changed/${group.project}`).set({
            time: new Date().getTime()
        });
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('acceptInvitation')
            .child(acceptInvitation.key)
            .update({ active: false });
    }
    console.log('END acceptInvitation');
}));
const runtimeOpts = {
    timeoutSeconds: 120
};
function acceptInvatation(userId, memberId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let group = yield utils_1.getGroup(groupId);
        let configuration = yield utils_1.getConfiguration();
        let db = admin.database();
        yield db.ref(`server/groups/${groupId}/members/${memberId}`).update({
            status: 'Active'
        });
        if (configuration.useBlockchain) {
            yield wallet_1.joinGroup(group.groupAddress, userId);
        }
        yield db.ref(`server/groups/changed/${group.project}`).set({
            time: new Date().getTime()
        });
        return { sucssess: true };
    });
}
exports.acceptInvatation = acceptInvatation;
exports.createGroup = functions
    .runWith(runtimeOpts)
    .database.ref(`server/operations/events/createGroupTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let groupRequest = yield utils_1.getActiveRequest('createGroup');
    let configuration = yield utils_1.getConfiguration();
    if (groupRequest.userId) {
        let groupAddress = { groupAddress: new Date().getTime() };
        console.log(`configuration : ${configuration} configuration.useBlockChain ${configuration.useBlockchain}`);
        if (configuration.useBlockchain) {
            console.log('creating group with BC');
            groupAddress = (yield wallet_1.createGroup(groupRequest.userId, groupRequest.project, groupRequest.type === 'OPEN'));
        }
        console.log(`groupAddress : ${JSON.stringify(groupAddress)}`);
        yield db.ref(`server/groups/`).child(groupRequest.groupKey).update({
            groupAddress: groupAddress.groupAddress
        });
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('createGroup')
            .child(groupRequest.key)
            .update({ active: false });
        yield db.ref(`server/operations/events/createGroupTrigger`).update({ time: new Date().getTime() });
    }
    console.log('END createGroup');
}));
function getGroupMembers(group) {
    return Object.keys(group.members).map((key) => group.members[key]);
}
function createNewGroup(groupRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (groupRequest.userId) {
            let groupKey = yield db.ref(`server/groups/`).push({
                type: groupRequest.type,
                creator: userId,
                project: groupRequest.project,
                name: groupRequest.name,
                active: true
            }).key;
            yield db.ref(`server/groups/${groupKey}/members`).push({
                status: 'Active',
                userId: userId
            });
            groupRequest.groupKey = groupKey;
            groupRequest.userId = userId;
            groupRequest.active = true;
            yield db.ref(`server/operations/events/createGroup`).push(groupRequest);
            yield db.ref(`server/operations/events/createGroupTrigger`).update({ time: new Date().getTime() });
            yield db.ref(`server/groups/changed/${groupRequest.project}`).set({
                time: new Date().getTime()
            });
            yield createGroupInvestmentTask(groupKey);
            return { groupKey: groupKey };
        }
        console.log('END createGroup');
        return { groupKey: '', status: 'failed' };
    });
}
exports.createNewGroup = createNewGroup;
function createGroupInvestmentTask(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        console.log(`createGroupInvestmentTask creation`);
        let scheduleTask = {
            active: true,
            groupId: groupId,
            type: 'triggerGroupInvestment',
            time: new Date().getTime()
        };
        console.log(`createGroupInvestmentTask Task : ${JSON.stringify(scheduleTask)}`);
        db.ref('server').child(`/operationHub/taskManager`).push(scheduleTask);
    });
}
exports.joinGroup = functions.database
    .ref(`server/operations/events/joinGroupTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let joinRequest = yield utils_1.getActiveRequest('joinGroup');
    let configuration = yield utils_1.getConfiguration();
    if (joinRequest.userId) {
        let group = yield utils_1.getGroup(joinRequest.groupId);
        if (group.type === 'OPEN') {
            if (configuration.useBlockchain) {
                yield wallet_1.joinGroup(group.groupAddress, joinRequest.userId);
            }
            yield db.ref(`server/groups/${joinRequest.groupId}/members`).push({
                status: 'Active',
                userId: joinRequest.userId
            });
            yield db.ref(`server/groups/changed/${group.project}`).set({
                time: new Date().getTime()
            });
        }
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('joinGroup')
            .child(joinRequest.key)
            .update({ active: false });
    }
    console.log('END joinRequest');
}));
function userJoinGroup(userId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let configuration = yield utils_1.getConfiguration();
        let group = yield utils_1.getGroup(groupId);
        if (group.type === 'OPEN') {
            if (configuration.useBlockchain) {
                yield wallet_1.joinGroup(group.groupAddress, userId);
            }
            yield db.ref(`server/groups/${groupId}/members`).push({
                status: 'Active',
                userId: userId
            });
            yield db.ref(`server/groups/changed/${group.project}`).set({
                time: new Date().getTime()
            });
        }
        return { sucssess: true };
    });
}
exports.userJoinGroup = userJoinGroup;
function createVotingOperation(userId, subject, documentUrl, documentMd5, type, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref(`server/operationHub/${userId}/operations/`).push({
            type: 'groupVote',
            status: 'waiting',
            subject: subject,
            project: project,
            documentUrl: documentUrl,
            documentMd5: documentMd5,
            name: 'vote',
            time: new Date().getTime(),
            voteType: type
        });
    });
}
function sendMails(user, group) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let userCreator = yield utils_1.getUserActiveAccount(group.creator);
        let project = yield utils_1.getProject(group.project);
        let mail = {
            active: true,
            params: {
                project: group.project,
                groupName: group.name,
                projectName: project.name,
                inventor: userCreator.name,
                time: new Date().getTime()
            },
            template: 'project.group.invite.user',
            to: userAccount.email
        };
        let db = admin.database();
        yield db.ref(`server/operations/events/sendEmail/`).push(mail);
        yield db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
    });
}
//# sourceMappingURL=groups.js.map