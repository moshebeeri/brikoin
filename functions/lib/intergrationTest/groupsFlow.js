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
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const runtimeOpts = {
    timeoutSeconds: 540
};
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}
exports.testGroupFlow = functions.runWith(runtimeOpts).database.ref(`server/test/groups/trigger`).onWrite((change) => __awaiter(this, void 0, void 0, function* () {
    let configuration = yield getGroupTestConfiguration();
    if (configuration.project) {
        console.log('Creating Group');
        yield createGroup(configuration.groupName, configuration.creator, configuration.project);
        yield delay(160);
        let group = yield utils_1.getGroupByCreatorName(configuration.creator, configuration.groupName);
        console.log(`Group Created ${JSON.stringify(group)}`);
        if (!group) {
            yield testGroupFailed('Group creation failed');
            return;
        }
        let task = yield utils_1.getGroupTask(group.id, 'triggerGroupInvestment');
        if (!task) {
            yield testGroupFailed('Group Investment task creation failed');
            return;
        }
        let addUser = yield addUserToGroup(configuration.user1, group, configuration.creator);
        if (!addUser) {
            yield clearResources(group, configuration);
            return;
        }
        let addUser2 = yield addUserToGroup(configuration.user2, group, configuration.creator);
        if (!addUser2) {
            yield clearResources(group, configuration);
            return;
        }
        let addUser3 = yield addUserToGroup(configuration.user3, group, configuration.creator);
        if (!addUser3) {
            yield clearResources(group, configuration);
            return;
        }
        let orderIdCreator = yield investInProject(configuration.creator, configuration.creatorAmount, configuration.project, group.id);
        console.log(`creator order id completed; ${orderIdCreator}`);
        let orderIdUser1 = yield investInProject(configuration.user1, configuration.user1Amount, configuration.project, group.id);
        console.log(`user1 order id completed; ${orderIdUser1}`);
        let orderIdUser2 = yield investInProject(configuration.user2, configuration.user2Amount, configuration.project, group.id);
        console.log(`orderIdUser2 order id completed; ${orderIdUser2}`);
        let orderIdUser3 = yield investInProject(configuration.user3, configuration.user3Amount, configuration.project, group.id);
        console.log(`orderIdUser3 order id completed; ${orderIdUser3}`);
        console.log(`waiting for scheduler ....`);
        yield triggerScheduler();
        yield delay(64);
        yield testGroupVotingFlow(configuration, group);
        console.log(`test after scheduler ....`);
        yield delay(40);
        yield clearResources(group, configuration, orderIdCreator, orderIdUser1, orderIdUser2, orderIdUser3);
        yield testGroupDone();
        console.log(`Group Deleted`);
    }
}));
function testGroupVotingFlow(configuration, group) {
    return __awaiter(this, void 0, void 0, function* () {
        let updatedGroup = yield utils_1.getGroup(group.id);
        let result = yield addGroupRepresentative(configuration.creator, updatedGroup.id);
        if (!result) {
            return;
        }
        result = yield addVotingRights(configuration.user1, updatedGroup, configuration.trustee);
        if (!result) {
            return;
        }
        result = yield addVotingRights(configuration.user2, updatedGroup, configuration.trustee);
        if (!result) {
            return;
        }
        result = yield addVotingRights(configuration.user3, updatedGroup, configuration.trustee);
        if (!result) {
            return;
        }
        result = yield addGroupVote(updatedGroup);
        if (!result) {
            return;
        }
        result = yield voteUser(updatedGroup, configuration.user1, true);
        if (!result) {
            return;
        }
        result = yield voteUser(updatedGroup, configuration.user2, false);
        if (!result) {
            return;
        }
        result = yield voteUser(updatedGroup, configuration.user3, true);
        if (!result) {
            return;
        }
        // let votingResults = await getVotingResults(group)
    });
}
function addGroupRepresentative(user, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('/server/operations/events/groupRepresented/').push({
            active: true,
            userId: user,
            creator: user,
            groupId: groupId
        });
        yield db.ref('/server/operations/events/groupRepresentedTrigger/').set({
            time: new Date().getTime()
        });
        yield delay(24);
        let group = yield utils_1.getGroup(groupId);
        if (group.representatives && Object.keys(group.representatives).length > 0) {
            return true;
        }
        yield testGroupFailed(`add group representative ${user}`);
        return false;
    });
}
function addGroupVote(group) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('/server/operations/events/addGroupVote/').push({
            active: true,
            userId: group.creator,
            subject: 'test',
            documentMd5: 'testMd5',
            type: 'MAJOR',
            documentUrl: 'testUrl',
            groupId: group.id,
            time: new Date().getTime()
        });
        yield db.ref('/server/operations/events/addGroupVoteTrigger/').set({
            time: new Date().getTime()
        });
        yield delay(35);
        let groupLatest = yield utils_1.getGroup(group.id);
        if (groupLatest.votes && Object.keys(groupLatest.votes).length > 0) {
            return true;
        }
        yield testGroupFailed(`create Votes `);
        return false;
    });
}
function addVotingRights(user, group, trustee) {
    return __awaiter(this, void 0, void 0, function* () {
        let userMemberId = getUserMemberId(group.members, user);
        let db = admin.database();
        yield db.ref('/server/operations/events/groupPaymentStatus/').push({
            active: true,
            userId: user,
            groupId: group.id,
            trustee: trustee,
            amount: 0,
            addOperation: true,
            memberId: userMemberId
        });
        yield db.ref('/server/operations/events/groupPaymentStatusTrigger/').set({
            time: new Date().getTime()
        });
        yield delay(24);
        let groupLatest = yield utils_1.getGroup(group.id);
        if (groupLatest.members[userMemberId].votingRights) {
            return true;
        }
        yield testGroupFailed(`add user voting rights ${user}`);
        return true;
    });
}
function voteUser(group, user, status) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let groupLatest = yield utils_1.getGroup(group.id);
        let voteId = Object.keys(groupLatest.votes)[0];
        let votes = groupLatest.votes[voteId].results ? Object.keys(groupLatest.votes[voteId].results).length : 0;
        let documentMd5 = groupLatest.votes[voteId].documentMd5;
        yield db.ref('/server/operations/events/groupVote/').push({
            active: true,
            vote: status,
            userId: user,
            documentMd5: documentMd5,
            voteId: voteId,
            groupId: group.id,
        });
        yield db.ref('/server/operations/events/groupVoteTrigger/').set({
            time: new Date().getTime()
        });
        yield delay(24);
        groupLatest = (yield utils_1.getGroup(group.id));
        let voted = groupLatest.votes[voteId].results ? Object.keys(groupLatest.votes[voteId].results).length : 0;
        if (voted - 1 === votes) {
            return true;
        }
        yield testGroupFailed(`user voted ${user}`);
        return true;
    });
}
function getVotingResults(configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        return {};
    });
}
function triggerScheduler() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server/taskScheduler/trigger').set({ time: new Date().getTime() });
    });
}
function clearResources(group, configuration, ...orderIds) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO clear notification
        console.log('start resource cleaning');
        yield deleteGroup(group.id);
        yield deleteGroupsTasks(group.id, configuration);
        let project = yield utils_1.getProject(configuration.project);
        let trusteeId = project.trustee ? project.trustee.user ? project.trustee.user : project.trustee : '';
        if (trusteeId) {
            yield deleteUserOperation(trusteeId, configuration.project);
        }
        yield deleteUserOperation(configuration.creator, configuration.project);
        yield deleteUserOperation(configuration.user1, configuration.project);
        yield deleteUserOperation(configuration.user2, configuration.project);
        yield deleteUserOperation(configuration.user3, configuration.project);
        yield deleteUserDocuments(configuration.creator);
        yield deleteUserDocuments(configuration.user1);
        yield deleteUserDocuments(configuration.user2);
        yield deleteUserDocuments(configuration.user3);
        console.log(`Orders ${JSON.stringify(orderIds)}`);
        yield Promise.all(orderIds.map(order => deleteOrder(order, configuration.project)));
    });
}
function investInProject(userId, amount, projectAddress, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        const orderId = yield db.ref(`/server/projects/pendingOrders/${projectAddress}`).push({
            active: true,
            project: projectAddress,
            userId: userId,
            price: 1,
            amount: amount,
            group: groupId,
            reserved: false
        }).key;
        yield db.ref('/server/operations/events/processOrder/').push({
            active: true,
            projectAddress: projectAddress,
            pendingOrderId: orderId,
            userId: userId
        });
        yield db.ref('/server/operations/events/triggerProcessOrder/').set({
            time: new Date().getTime()
        });
        yield delay(4);
        console.log(`project Order created ${orderId}`);
        return orderId;
    });
}
function addUserToGroup(user, group, groupCreator) {
    return __awaiter(this, void 0, void 0, function* () {
        yield inviteUser(user, group.id, groupCreator);
        yield delay(25);
        let updatedGroup = yield utils_1.getGroup(group.id);
        console.log(`group with new member ${JSON.stringify(updatedGroup.members)}`);
        let userMemberId = getUserMemberId(updatedGroup.members, user);
        if (!userMemberId) {
            yield testGroupFailed(`Invite Member failed ${user}`);
            return false;
        }
        if (userMemberId) {
            yield acceptInvitation(user, group.id, userMemberId);
            yield delay(25);
            let latestGroup = yield utils_1.getGroup(group.id);
            if (latestGroup.members[userMemberId].status !== 'Active') {
                yield testGroupFailed(`Accept invitation failed ${user}`);
                return false;
            }
        }
        return true;
    });
}
function testGroupFailed(message) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server/test/groups/results').push({
            message: message,
            status: 'Failed',
            time: new Date().getTime()
        });
    });
}
function testGroupDone() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server/test/groups/results').push({
            status: 'Success',
            time: new Date().getTime()
        });
    });
}
function getUserMemberId(groupMembers, userId) {
    let ids = Object.keys(groupMembers).filter(key => groupMembers[key].userId === userId);
    if (ids.length > 0) {
        return ids[0];
    }
    return '';
}
function getGroupTestConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('test/groups/configuration').once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    resolve(results);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function createGroup(groupName, groupCreator, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server/operations/events/createGroup').push({
            active: true,
            name: groupName,
            userId: groupCreator,
            project: project,
            type: 'CLOSED'
        });
        yield db.ref('server/operations/events/createGroupTrigger').set({ time: new Date().getTime() });
    });
}
function inviteUser(user, groupId, groupCreator) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server/operations/events/inviteUser').push({
            active: true,
            creator: groupCreator,
            groupId: groupId,
            userId: user
        });
        yield db.ref('server/operations/events/inviteUserTrigger').set({ time: new Date().getTime() });
    });
}
function acceptInvitation(user, groupId, memberId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        yield db.ref('server/operations/events/acceptInvitation').push({
            active: true,
            groupId: groupId,
            memberId: memberId,
            userId: user
        });
        yield db.ref('server/operations/events/acceptInvitationTrigger').set({ time: new Date().getTime() });
    });
}
function deleteGroup(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server/groups/').child(groupId).remove();
    });
}
function deleteOrder(orderId, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(`deleting  orderId ${orderId} projectAddress ${projectAddress}`);
        db.ref(`server/projects/pendingOrders/${projectAddress}`).child(orderId).remove();
    });
}
function deleteGroupsTasks(groupId, configuration) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let project = yield utils_1.getProject(configuration.project);
        let trusteeId = project.trustee ? project.trustee.user ? project.trustee.user : project.trustee : '';
        if (trusteeId) {
            yield deleteUserTasks(trusteeId);
        }
        yield deleteUserTasks(configuration.creator);
        yield deleteUserTasks(configuration.user1);
        yield deleteUserTasks(configuration.user2);
        yield deleteUserTasks(configuration.user3);
        console.log(`deleting ${groupId} tasks`);
        let task1 = yield utils_1.getGroupTask(groupId, 'triggerGroupDone');
        if (task1) {
            db.ref(`server/operationHub/taskManager/${task1.id}/`).remove();
        }
        let task2 = yield utils_1.getGroupTask(groupId, 'triggerGroupInvestment');
        if (task2) {
            db.ref(`server/operationHub/taskManager/${task2.id}/`).remove();
        }
        // db.ref(`server/project/${projectAddress}/`).child(orderId).remove()
    });
}
function deleteUserTasks(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield removeTasks(userId, 'user');
        yield removeTasks(userId, 'userId');
        yield removeTasks(userId, 'signUser');
        yield removeTasks(userId, 'operationUserId');
    });
}
function removeTasks(userId, param) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let tasks = yield getUserTasks(userId, param);
        if (tasks.length > 0) {
            tasks.forEach(task => {
                db.ref(`server/operationHub/taskManager`).child(task.id).remove();
            });
        }
    });
}
function getUserTasks(userId, param) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child(`operationHub/taskManager`).orderByChild(param).equalTo(userId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let tasks = Object.keys(results).map(key => {
                            let task = results[key];
                            task.id = key;
                            return task;
                        });
                        resolve(tasks);
                        return;
                    }
                    resolve([]);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserTasks = getUserTasks;
function getUserDocuments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child(`legalDocuments`).orderByChild('owner').equalTo(userId).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let documents = Object.keys(results).map(key => {
                            let document = results[key];
                            document.id = key;
                            return document;
                        });
                        resolve(documents);
                        return;
                    }
                    resolve([]);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getUserDocuments = getUserDocuments;
function deleteUserOperation(userId, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref(`server/operationHub/${userId}/operations`).remove();
        db.ref(`server/notifications/${userId}`).remove();
    });
}
function deleteUserDocuments(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let documents = yield getUserDocuments(userId);
        if (documents.length > 0) {
            let db = admin.database();
            Promise.all(documents.map(doucment => {
                db.ref(`server/legalDocuments/${doucment.id}`).remove();
            }));
        }
    });
}
//# sourceMappingURL=groupsFlow.js.map