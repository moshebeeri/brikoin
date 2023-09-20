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
const client = algoliasearch('1VRM6EM4GQ', 'c2eaee0a6dd79ca5fdbe5558d132175d');
const index = client.initIndex(`${functions.config().index.env}-USERS`);
function searchUsers(data) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`search ${data}`);
        let result = yield index.search(data);
        console.log(`results: ${JSON.stringify(result.hits)}`);
        return result;
    });
}
exports.searchUsers = searchUsers;
exports.updateUserIndex = functions.database.ref(`server/usersPublic`).onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    console.log('START updateUserIndex');
    let users = yield getUsers();
    console.log(`users ${JSON.stringify(users)}`);
    index.saveObjects(users);
    console.log('END updateUserIndex');
}));
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        return new Promise((resolve, reject) => {
            try {
                db.ref('server').child('/usersPublic').once('value', function (snapshot) {
                    let results = snapshot.val();
                    console.log(results);
                    if (results) {
                        let requests = Object.keys(results).map((key) => {
                            let user = results[key];
                            user.objectID = key;
                            return user;
                        });
                        resolve(requests);
                    }
                    resolve([]);
                });
            }
            catch (error) {
                reject([]);
            }
        });
    });
}
//# sourceMappingURL=userSearchEngine.js.map