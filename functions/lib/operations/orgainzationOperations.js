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
exports.addOrganization = functions.database.ref(`server/operations/events/triggerAddOrganization`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let request = yield getOrganizationRequest();
    yield handleOrganizationRequest(request);
}));
exports.assignProjectOrg = functions.database.ref(`server/operations/events/triggerAssignProjectOrg`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let request = yield getAssignProjectRequest();
    yield handleProjectAssignment(request);
}));
function addNewOrganization(response, request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        db.ref('server/organization/').push({ address: response.organizationAddress, name: request.name, phoneNumber: request.phoneNumber, email: request.email });
    });
}
function updateProjectOrganization(projectAddress, organization) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let projectId = yield utils_1.getProjectId(projectAddress);
        console.log('UPDATING PROJECT ' + projectId);
        db.ref('server/projectsCollections/projects').child(projectId).update({ organization: organization });
    });
}
function handleOrganizationRequest(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (request) {
            console.log('ADD ORGANIZATION STARTING');
            let response = yield wallet_1.addOrganization(request.name, request.phoneNumber, request.email);
            console.log('ADD Organization Result: ' + JSON.stringify(response));
            if (response.success) {
                yield addNewOrganization(response, request);
            }
            db.ref('server').child('/operations/events/addOrganization').child(request.orderId).update({ active: false });
        }
    });
}
function handleProjectAssignment(request) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (request) {
            console.log('ASSIGN PROJECT START');
            let response = yield wallet_1.assignProjectToOrg(request.projectAddress, request.organization);
            console.log('PROJECT ASSIGNMENT RESULT ' + JSON.stringify(response));
            if (response.success) {
                yield updateProjectOrganization(request.projectAddress, request.organization);
            }
            db.ref('server').child('/operations/events/assignProjectToOrg').child(request.orderId).update({ active: false });
        }
    });
}
function getOrganizationRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/addOrganization').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let requests = Object.keys(results).map(key => {
                            let payment = results[key];
                            payment.orderId = key;
                            return payment;
                        });
                        resolve(requests[0]);
                    }
                    resolve('');
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getAssignProjectRequest() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/operations/events/assignProjectToOrg').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let requests = Object.keys(results).map(key => {
                            let payment = results[key];
                            payment.orderId = key;
                            return payment;
                        });
                        resolve(requests[0]);
                    }
                    resolve('');
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
//# sourceMappingURL=orgainzationOperations.js.map