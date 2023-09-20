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
exports.initialProject = functions.database.ref(`server/projects/events/initialProject`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let project = yield getProjectInit();
    let stoneCoinAddress = project.projectId;
    if (stoneCoinAddress === '0') {
        return;
    }
    console.log('################ start handle project init ########################');
    if (stoneCoinAddress) {
        let adminAccount = yield utils_1.getAdminAccount('project');
        let initialOffer = yield getProjectInitialOffer(stoneCoinAddress);
        yield wallet_1.createProjectInitialAsk(adminAccount, stoneCoinAddress, initialOffer.amount);
        yield db.ref('server').child('/projects/events/').child('initialProject').set({ projectId: 0 });
        yield db.ref('server').child('/operations/project/initialOffer').child(initialOffer.id).update({ executed: true });
    }
    console.log('################ End handle project init ########################');
}));
function getProjectInit() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('projects/events/initialProject').once('value', function (snapshot) {
                    resolve(snapshot.val());
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function getProjectInitialOffer(projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                let db = admin.database();
                db.ref('server').child('/operations/project/initialOffer').orderByChild('projectId').equalTo(projectAddress).once('value', function (snapshot) {
                    let result = snapshot.val();
                    if (result) {
                        result = Object.keys(result).map(key => {
                            let project = result[key];
                            project.id = key;
                            return project;
                        });
                        resolve(result[0]);
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
//# sourceMappingURL=initialProject.js.map