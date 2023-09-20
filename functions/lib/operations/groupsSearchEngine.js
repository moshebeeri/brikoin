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
const algoliasearch = require('algoliasearch');
const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-GROUPS`);
const statsIndex = client.initIndex(`${functions.config().index.env}-GROUPS-STATS`);
function findGroupsByProject(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search   index ${projectAddress}`);
        let result = yield index.search(projectAddress);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits;
    });
}
exports.findGroupsByProject = findGroupsByProject;
function findMyGroups(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search  userId ${userId}`);
        let result = yield index.search(userId);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits;
    });
}
exports.findMyGroups = findMyGroups;
function findGroupStats(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search ${groupId}`);
        let result = yield statsIndex.search(groupId);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits && result.hits.length > 0 ? result.hits[0] : '';
    });
}
exports.findGroupStats = findGroupStats;
exports.updateGroupsIndex = functions.database.ref(`server/groups`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('START  updateGroups');
    let groups = yield getGroups();
    groups = groups.filter((group) => group.id !== 'changed');
    index.saveObjects(groups);
    let statsIndexObjects = yield Promise.all(groups.map((group) => group.id).filter((id) => id !== 'changed').map((id) => getGroupStats(id)));
    statsIndex.saveObjects(statsIndexObjects);
    console.log('END updateGroupsIndex');
}));
function getGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results && Object.keys(results).length > 0) {
                        let groups = Object.keys(results).map((key) => {
                            let group = results[key];
                            group.id = key;
                            group.objectID = key;
                            return group;
                        });
                        resolve(groups);
                    }
                    else {
                        resolve([]);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
const reducer = (accumulator, currentValue) => accumulator + currentValue;
function getGroupStats(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('groups').child(groupId).once('value', function (snapshot) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let group = snapshot.val();
                        if (group) {
                            let detailedMembers = yield Promise.all(Object.keys(group.members).map((key) => utils_1.getMemberOrder(group.project, group.members[key], groupId)));
                            console.log(`detailedMembers: ${JSON.stringify(detailedMembers)}`);
                            resolve({
                                sum: detailedMembers
                                    .map((member) => member.order ? parseInt(member.order.amount) * parseInt(member.order.price) : 0)
                                    .reduce(reducer),
                                sumTransferred: detailedMembers
                                    .map((member) => member.order && member.order.fullDeposit
                                    ? parseInt(member.order.amount) * parseInt(member.order.price)
                                    : 0)
                                    .reduce(reducer),
                                activeMembers: Object.keys(group.members)
                                    .map((key) => (group.members[key].status === 'Active' ? 1 : 0))
                                    .reduce(reducer),
                                members: Object.keys(group.members).length,
                                detailedMember: detailedMembers,
                                reservedPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.reserved ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100,
                                signedAgreementPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.signedAgreement ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100,
                                orderApprovedPercentage: detailedMembers
                                    .map((member) => (member.order ? (member.order.orderApproved ? 1 : 0) : 0))
                                    .reduce(reducer) /
                                    detailedMembers.length *
                                    100,
                                objectID: groupId,
                                groupId: groupId
                            });
                        }
                        else {
                            resolve({});
                        }
                    });
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getGroupStats = getGroupStats;
//# sourceMappingURL=groupsSearchEngine.js.map