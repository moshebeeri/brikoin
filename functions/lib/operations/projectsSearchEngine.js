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
const algoliasearch = require('algoliasearch');
const utils_1 = require("./utils");
const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-PROJECTS`);
function findProjects(query) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search   index ${query}`);
        let result = yield index.search(query);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits;
    });
}
exports.findProjects = findProjects;
function findProjectsByAddress(address) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search  index ${address}`);
        let result = yield index.search(address);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits && result.hits.length > 0 ? result.hits[0] : '';
    });
}
exports.findProjectsByAddress = findProjectsByAddress;
function findSubProject(parentProjectId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search ${parentProjectId}`);
        let result = yield index.search(parentProjectId);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result.hits ? result.hits.filter((project) => project.parentProjectId === parentProjectId) : [];
    });
}
exports.findSubProject = findSubProject;
exports.updateProjectsIndex = functions.database.ref(`server/projectsCollections`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('START  updateProjectCollections');
    let projects = yield utils_1.getInitilProjects('');
    index.saveObjects(projects);
    console.log('END updateUserIndex');
}));
//# sourceMappingURL=projectsSearchEngine.js.map