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
function duplicateProperty(propertyId) {
    return __awaiter(this, void 0, void 0, function* () {
        let propery = yield getPropertyAttributes(propertyId);
        propery['projectName'] = `copy Of ${propery['projectName']}`;
        propery['key'] = '';
        propery['approved'] = false;
        propery['reviewed'] = false;
        console.log(`new project ${JSON.stringify(propery)}`);
        let db = admin.database();
        let result = yield db.ref('server').child('loadingProperties').push(propery);
        let newPropertyId = result.getKey();
        console.log(`newPropertyId : ${newPropertyId}`);
        yield db.ref('server').child('loadingProperties').child(newPropertyId).update({
            projectId: newPropertyId,
            id: newPropertyId
        });
        return 'done';
    });
}
exports.duplicateProperty = duplicateProperty;
function deleteProperty(propertyId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let property = yield getPropertyAttributes(propertyId);
        let isUserAdmin = yield isAdmin(userId);
        if (property.userId === userId || isUserAdmin) {
            let db = admin.database();
            db.ref('server').child('loadingProperties/').child(propertyId).remove();
        }
        return 'done';
    });
}
exports.deleteProperty = deleteProperty;
function propertyReviewed(propertyId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let property = yield getPropertyAttributes(propertyId);
        let isUserAdmin = yield isAdmin(userId);
        console.log(`isUserAdmin ${isUserAdmin}`);
        console.log(`property user ${property.userId}`);
        if (isUserAdmin) {
            let db = admin.database();
            db.ref('server').child('loadingProperties/').child(propertyId).update({ reviewed: true });
        }
        return 'done';
    });
}
exports.propertyReviewed = propertyReviewed;
function propertyApproved(propertyId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let property = yield getPropertyAttributes(propertyId);
        let isUserAdmin = yield isAdmin(userId);
        console.log(`isUserAdmin ${isUserAdmin}`);
        console.log(`property user ${property.userId}`);
        if (isUserAdmin) {
            let db = admin.database();
            db.ref('server').child('loadingProperties/').child(propertyId).update({ approved: true });
            db.ref('server').child('operations/events/loadProject/').push({
                active: true,
                projectRequestId: propertyId
            });
            db.ref('server').child('server/operations/events/loadProjectTrigger/').update({
                time: new Date().getTime()
            });
        }
        return 'done';
    });
}
exports.propertyApproved = propertyApproved;
exports.assignProjectToParentEvent = functions.database
    .ref(`server/operations/events/loadingPropertiesSyncTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('loadingPropertiesSync');
    if (request) {
        console.log(`request  ${JSON.stringify(request)}`);
        let propery = yield getPropertyAttributes(request.propertyId);
        console.log(`propery ${JSON.stringify(propery)}`);
        if (propery.parentProject) {
            yield assignProjectToParent(propery.parentProject, request.propertyId);
        }
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('loadingPropertiesSync')
            .child(request.key)
            .update({ active: false });
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('loadingPropertiesSyncTrigger')
            .set({ time: new Date().getTime() });
    }
}));
function assignProjectToParent(parentId, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`parentId ${JSON.stringify(parentId)} projectId ${JSON.stringify(projectId)}`);
        let propery = yield getPropertyAttributes(parentId);
        console.log(`propery ${JSON.stringify(propery)}`);
        let projects = propery['projects'];
        if (projects) {
            console.log(`propery projects ${JSON.stringify(projects)}`);
            let sameProject = Object.keys(projects).filter((key) => projects[key].project === projectId);
            if (sameProject.length > 0) {
                return 'Already Exist';
            }
        }
        let db = admin.database();
        db.ref('server').child('loadingProperties').child(parentId).child('projects').push({ project: projectId });
        return 'done';
    });
}
exports.assignProjectToParent = assignProjectToParent;
function getLoadingProjects(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let isAdminUser = yield isAdmin(userId);
        if (isAdminUser) {
            return new Promise((resolve, reject) => {
                let db = admin.database();
                try {
                    db.ref('server').child('loadingProperties').once('value', function (snapshot) {
                        let results = snapshot.val();
                        if (results) {
                            let result = Object.keys(results).map((key) => {
                                let property = results[key];
                                property.key = key;
                                return property;
                            });
                            resolve(result);
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
        }
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('loadingProperties')
                    .orderByChild('userId')
                    .equalTo(userId)
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let property = results[key];
                            property.key = key;
                            return property;
                        });
                        resolve(result);
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
exports.getLoadingProjects = getLoadingProjects;
function isAdmin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let admins = yield utils_1.getAdminsIds();
        let adminsIds = Object.keys(admins);
        return adminsIds.includes(userId);
    });
}
function saveEstimation(estimation) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        console.log(JSON.stringify(estimation));
        if (estimation) {
            let estimationAddress = new Date().getTime();
            console.log('SAVING to BLOCKCHAIN DONE');
            console.log(estimationAddress);
            estimation.address = estimationAddress;
            db.ref('server').child('projectsCollections/estimations').push(estimation);
            return estimation;
        }
    });
}
function saveProperty(property) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(JSON.stringify(property));
        let db = admin.database();
        if (property) {
            let propertyAddress = new Date().getTime();
            console.log('SAVING to BLOCKCHAIN DONE');
            console.log(propertyAddress);
            property.address = propertyAddress;
            db.ref('server').child('projectsCollections/properties').push(property);
            return property;
        }
    });
}
function saveRegistrar(registrar) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        if (registrar) {
            let registrarAddress = new Date().getTime();
            console.log('SAVING to BLOCKCHAIN DONE');
            console.log(registrarAddress);
            registrar.address = registrarAddress;
            db.ref('server').child('projectsCollections/registrars').push(registrar);
            return registrar;
        }
    });
}
function saveTrustee(trustee) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let trusteeAddress = new Date().getTime();
        trustee.address = trusteeAddress;
        db.ref('server').child('projectsCollections/trustees').push(trustee);
        return trustee;
    });
}
function saveTerms(term) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('TERM');
        console.log(term);
        let db = admin.database();
        let termAddress = new Date().getTime();
        console.log('TERM ADDRESS');
        console.log(termAddress);
        term.address = termAddress;
        console.log(term);
        db.ref('server').child('projectsCollections/terms').push(term);
        return term;
    });
}
function saveManager(manager) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let managerAddress = new Date().getTime();
        manager.address = managerAddress;
        db.ref('server').child('projectsCollections/managers').push(manager);
        return manager;
    });
}
function createAssetManager(manager, estimation, registrar, trustee, terms, property) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = admin.database();
        let assetManager = {};
        let assetManagerObject = {
            estimation: estimation.address,
            manager: manager.address,
            property: property.address,
            registrar: registrar.address,
            terms: terms.address,
            trustee: trustee.address,
            address: ''
        };
        let adminAccountId = yield utils_1.getAdminAccountId();
        let assetManagerAddress = yield wallet_1.saveEntity('AssetManager', adminAccountId, assetManager);
        assetManagerObject.address = assetManagerAddress;
        yield db.ref('server').child('projectsCollections/assetManagers').push(assetManagerObject);
        if (manager.user) {
            yield wallet_1.addProjectRole(assetManagerAddress, 'MANAGER', manager.user);
            yield wallet_1.addProjectDocument(assetManagerAddress, 'MANAGER', manager.pdfMd5);
        }
        if (estimation.urlMD5) {
            yield wallet_1.addProjectDocument(assetManagerAddress, 'ESTIMATION', estimation.urlMD5);
        }
        if (registrar.pdfMd5) {
            yield wallet_1.addProjectDocument(assetManagerAddress, 'REGISTRAR', registrar.pdfMd5);
        }
        if (trustee.user) {
            yield wallet_1.addProjectRole(assetManagerAddress, 'TRUSTEE', trustee.user);
            yield wallet_1.addProjectDocument(assetManagerAddress, 'TRUSTEE', trustee.pdfMd5);
        }
        if (terms.pdfMd5) {
            yield wallet_1.addProjectDocument(assetManagerAddress, 'TERMS', terms.pdfMd5);
        }
        if (property.pdfMd5) {
            yield wallet_1.addProjectDocument(assetManagerAddress, 'RENT', property.rentMd5);
        }
        return assetManagerAddress;
    });
}
function createProject(assetManager, project) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccountId = yield utils_1.getAdminAccountId();
        let adminProject = yield utils_1.getAdminAccount('project');
        let cornerStone = yield utils_1.getCornerStone();
        const db = admin.database();
        project.timestamp = new Date().getTime();
        project.assetManager = assetManager;
        const result = {
            _name: wallet_1.toBlockChainString(''),
            _symbol: wallet_1.toBlockChainString(project.symbol),
            _target: project.target ? project.target : 1,
            _startTimestamp: project.startTimestamp,
            _durationSeconds: project.durationSeconds,
            _assetManager: assetManager,
            _url: wallet_1.toBlockChainString('0'),
            _urlMD5: wallet_1.toBlockChainString('0'),
            _signDocument: false,
            _minBulkSize: 1
        };
        let configuration = yield utils_1.getConfiguration();
        console.log('result: ' + JSON.stringify(result));
        let projectAddress = yield createNewProject(adminAccountId, cornerStone, result, adminProject.accountId);
        console.log('projectAddress: ' + projectAddress.address);
        console.log('Admin nonce: ' + projectAddress.nonce);
        if (configuration.useBlockchain) {
            yield utils_1.updateNonceAdmin(projectAddress.nonce, 'init');
            yield wallet_1.setProjectReserved(adminProject.accountId, adminProject.privateKey, adminProject.nonce, projectAddress.address, parseInt(project.reservedBid));
            console.log('adminProject nonce: ' + adminProject.nonce);
            yield utils_1.updateNonceAdmin(parseInt(adminProject.nonce) + 1, 'project');
        }
        if (project.tradeMethod === 'auction') {
            let dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + project.tradeDurationMonth);
            const auctionRef = yield db.ref('server').child('projects').child('events').child('auctionOrdersRequest');
            auctionRef.push({
                state: 'initial',
                projectId: projectAddress.address,
                active: true,
                type: 'english',
                dueDate: dueDate.getTime()
            });
        }
        const ref = yield db.ref('server').child('operations').child('project').child('initialOffer');
        const initialOffer = {
            amount: parseInt(project.target),
            executed: false,
            name: project.name,
            projectId: projectAddress.address,
            userId: 'admin'
        };
        yield ref.push(initialOffer);
        project.address = projectAddress.address;
        console.log(JSON.stringify(project));
        let refernce = yield db.ref('server').child('projectsCollections/projects').push(project);
        let id = yield refernce.getKey();
        project.id = id;
        return project;
    });
}
function createNewProject(adminAccount, cornerStone, parameters, projectOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        let configuration = yield utils_1.getConfiguration();
        if (!configuration.useBlockchain) {
            return { address: new Date().getTime(), nonce: 0 };
        }
        let nonce = parseInt(adminAccount.nonce);
        console.log('admin Nonce ' + nonce);
        let stoneCoinMortgage = yield wallet_1.deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, wallet_1.getContractByName('StoneCoinMortgage'), null, nonce);
        let stoneCoinMortgageContract = yield wallet_1.getDeployedContracts('StoneCoinMortgage', stoneCoinMortgage);
        let stoneCoinMortgageOwner = yield stoneCoinMortgageContract.methods.owner().call({ from: adminAccount.accountId });
        console.log('stoneCoinMortgageOwner: ' + stoneCoinMortgageOwner);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        let stoneCoinMortgageStorageAddress = yield wallet_1.deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, wallet_1.getContractByName('StoneCoinMortgageStorage'), null, nonce);
        let stoneCoinMortgageStorage = yield wallet_1.getDeployedContracts('StoneCoinMortgageStorage', stoneCoinMortgageStorageAddress);
        let stoneCoinMortgageStoragewner = yield stoneCoinMortgageStorage.methods
            .owner()
            .call({ from: adminAccount.accountId });
        console.log('stoneCoinMortgageStoragewner: ' + stoneCoinMortgageStoragewner);
        console.log('adminAccount: ' + adminAccount.accountId);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinMortgageContract.options.address, stoneCoinMortgageContract.methods.setStoneCoinMortgageStorage(stoneCoinMortgageStorageAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        let stoneCoinMortgageAddress = yield stoneCoinMortgageContract.methods
            .getAddress()
            .call({ from: adminAccount.accountId });
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinMortgageStorage.options.address, stoneCoinMortgageStorage.methods.addOwnership(stoneCoinMortgageAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        let stoneCoinAddress = yield wallet_1.deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, wallet_1.getContractByName('StoneCoin'), parameters, nonce);
        let stoneCoinContract = yield wallet_1.getDeployedContracts('StoneCoin', stoneCoinAddress);
        let owner = yield stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });
        console.log('owner: ' + owner);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        let stoneCoinStorageAddress = yield wallet_1.deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, wallet_1.getContractByName('StoneCoinStorage'), null, nonce);
        let stoneCoinStorage = yield wallet_1.getDeployedContracts('StoneCoinStorage', stoneCoinStorageAddress);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        console.log('base address ' + cornerStone.cornerBaseAddress);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.setStoneCoinStorageAddress(stoneCoinStorageAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.addOwnership(cornerStone.cornerBaseAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.addOwnership(projectOwner), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinStorage.options.address, stoneCoinStorage.methods.addOwnership(stoneCoinAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinMortgageContract.options.address, stoneCoinMortgageContract.methods.addOwnership(stoneCoinAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.setStoneCoinMortgageAddress(stoneCoinMortgageAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('admin Nonce ' + nonce);
        console.log('OWNER address: ' + adminAccount.accountId);
        console.log('BEFore INIT');
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.setOwner(projectOwner), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('nonce' + nonce);
        owner = yield stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });
        console.log('owner: ' + owner);
        yield wallet_1.sendAdminTransactionWithGas(adminAccount.accountId, stoneCoinContract.options.address, stoneCoinContract.methods.init(), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        console.log('nonce' + nonce);
        // let contract = this.getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress)
        // console.log('nonce' + nonce)
        // await this.send(adminAccount.accountId, contract.options.address, contract.methods.initialAskAdmin(adminAccount.accountId, stoneCoinAddress, parameters._target), adminAccount.privateKey, nonce)
        // nonce = nonce + 1
        let balanceOfAdmin = yield stoneCoinContract.methods
            .balanceOf(adminAccount.accountId)
            .call({ from: adminAccount.accountId });
        console.log('ADMIN BALANCE: ' + balanceOfAdmin);
        console.log('nonce' + nonce);
        owner = yield stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });
        console.log('owner: ' + owner);
        return { address: stoneCoinAddress, nonce: nonce };
    });
}
function getPropertyAttributes(requestKey) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db.ref('server').child('loadingProperties').child(requestKey).once('value', function (snapshot) {
                    let result = snapshot.val();
                    result.key = requestKey;
                    resolve(result);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
exports.getPropertyAttributes = getPropertyAttributes;
function getParentProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let db = admin.database();
            try {
                db
                    .ref('server')
                    .child('loadingProperties')
                    .orderByChild('type')
                    .equalTo('parentProject')
                    .once('value', function (snapshot) {
                    let results = snapshot.val();
                    if (results) {
                        let result = Object.keys(results).map((key) => {
                            let property = results[key];
                            property.key = key;
                            return property;
                        });
                        resolve(result.filter((property) => !property.approved));
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
exports.getParentProjects = getParentProjects;
function createTerm(propertyAttributes) {
    // if(propertyAttributes.term){
    //
    // }
    return {
        rental: propertyAttributes.rental || '',
        pdf: propertyAttributes.terms || '',
        pdfMd5: propertyAttributes.termsMd5 || ''
    };
}
function createManager(propertyAttributes) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            urlCode: propertyAttributes.managementUrlCode || '',
            pdf: propertyAttributes.officials &&
                propertyAttributes.officials.management &&
                propertyAttributes.officials.management.document
                ? propertyAttributes.officials.management.document
                : '',
            pdfMd5: propertyAttributes.officials &&
                propertyAttributes.officials.management &&
                propertyAttributes.officials.management.documentMd5
                ? propertyAttributes.officials.management.documentMd5
                : '',
            role: propertyAttributes.officials &&
                propertyAttributes.officials.management &&
                propertyAttributes.officials.management.role
                ? propertyAttributes.officials.management.role
                : '',
            user: propertyAttributes.officials &&
                propertyAttributes.officials.management &&
                propertyAttributes.officials.management.user
                ? propertyAttributes.officials.management.user
                : ''
        };
    });
}
function createRegistrar(propertyAttributes) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            name: propertyAttributes.registrarName || '',
            licenseNumber: propertyAttributes.registrarLicenseNumber || '',
            country: propertyAttributes.registrarCountry || '',
            address1: propertyAttributes.registrarAddress1 || '',
            phoneNumber: propertyAttributes.registrarPhoneNumber || '',
            faxNumber: propertyAttributes.registrarFaxNumber || '',
            email: propertyAttributes.registrarEmail || '',
            url: propertyAttributes.registrarSite || '',
            pdf: propertyAttributes.registrar || ''
        };
    });
}
function createEstimation(propertyAttributes) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            price: propertyAttributes.estimationPrice
                ? propertyAttributes.estimationPrice
                : propertyAttributes.targetPrice ? propertyAttributes.targetPrice : 0,
            currency: propertyAttributes.projectCurrency || 'USD',
            rental: propertyAttributes.projectRent || 0,
            expectedYield: propertyAttributes.projectYield || 0,
            urlCode: propertyAttributes.estimationUrlCode || '',
            urlMD5: propertyAttributes.estimationPdfMd5 || '',
            pdf: propertyAttributes.estimation || ''
        };
    });
}
function createTrustee(propertyAttributes) {
    return __awaiter(this, void 0, void 0, function* () {
        return {
            pdf: propertyAttributes.officials &&
                propertyAttributes.officials.TRUSTEE &&
                propertyAttributes.officials.TRUSTEE.document
                ? propertyAttributes.officials.TRUSTEE.document
                : '',
            pdfMd5: propertyAttributes.officials &&
                propertyAttributes.officials.TRUSTEE &&
                propertyAttributes.officials.TRUSTEE.documentMd5
                ? propertyAttributes.officials.TRUSTEE.documentMd5
                : '',
            role: propertyAttributes.officials &&
                propertyAttributes.officials.TRUSTEE &&
                propertyAttributes.officials.TRUSTEE.role
                ? propertyAttributes.officials.TRUSTEE.role
                : '',
            user: propertyAttributes.officials &&
                propertyAttributes.officials.TRUSTEE &&
                propertyAttributes.officials.TRUSTEE.user
                ? propertyAttributes.officials.TRUSTEE.user
                : ''
        };
    });
}
function createProperty(managerAddress, estimationAddress, registrarAddress, trusteeAddress, propertyAttributes) {
    return {
        name: propertyAttributes.projectName || '',
        manager: managerAddress,
        trustee: trusteeAddress,
        registrar: registrarAddress,
        estimation: estimationAddress,
        constraction: propertyAttributes.officials ? propertyAttributes.officials.CONSTRUCTION || '' : '',
        bank: propertyAttributes.officials ? propertyAttributes.officials.BANK || '' : '',
        entrepreneur: propertyAttributes.officials ? propertyAttributes.officials.ENTREPRENEUR || '' : '',
        lawyer: propertyAttributes.officials ? propertyAttributes.officials.LAWYER || '' : '',
        country: '',
        address1: propertyAttributes.projectAddress || '',
        lang: {
            He: {
                address1: propertyAttributes.projectAddress || ''
            }
        },
        address2: '',
        state: '',
        pdf: propertyAttributes.rent || '',
        pdfMd5: propertyAttributes.rentMd5 || '',
        lat: propertyAttributes.projectAddressLocationLat || '',
        lon: propertyAttributes.projectAddressLocationLng || '',
        pictures: propertyAttributes.pictures || '',
        type: propertyAttributes.projectType || ''
    };
}
function add_months(dt, n) {
    return new Date(dt.setMonth(dt.getMonth() + n));
}
function createProjectFeatures(propertyAttributes) {
    let features = {};
    if (propertyAttributes.sqrt) {
        features['Sqrt'] = propertyAttributes.sqrt;
    }
    if (propertyAttributes.floor) {
        features['floor'] = propertyAttributes.floor;
    }
    if (propertyAttributes.projectRent) {
        features['rented'] = propertyAttributes.projectRent;
    }
    if (propertyAttributes.projectBalcony) {
        features['balcony'] = propertyAttributes.projectBalcony;
    }
    if (propertyAttributes.projectShelter) {
        features['shelter'] = propertyAttributes.projectShelter;
    }
    if (propertyAttributes.projectStorage) {
        features['storage'] = propertyAttributes.projectStorage;
    }
    if (propertyAttributes.projectType) {
        features['type'] = propertyAttributes.projectType;
    }
    if (propertyAttributes.projectYield) {
        features['yield'] = propertyAttributes.projectYield + '%';
    }
    features['secondMarket'] = propertyAttributes.secondMarket || true;
    return features;
}
function createProjectObject(propertyAttributes, assetManager) {
    let project = {
        name: propertyAttributes.projectName,
        symbol: propertyAttributes.projectSymbol,
        currency: propertyAttributes.projectCurrency,
        description: propertyAttributes.description,
        lang: {
            He: {
                name: propertyAttributes.projectName,
                description: propertyAttributes.description
            }
        },
        features: propertyAttributes.features,
        youTube: propertyAttributes.youTube ? propertyAttributes.youTube : '',
        secondFeatures: propertyAttributes.secondFeatures,
        tradeDurationMonth: propertyAttributes.tradeDurationMonth || 3,
        target: propertyAttributes.targetPrice ? propertyAttributes.targetPrice : 1,
        startTimestamp: new Date().getTime(),
        durationSeconds: propertyAttributes.durationSeconds || add_months(new Date(), 3).getTime(),
        assetManager: assetManager,
        url: '',
        urlMD5: '',
        reservedBid: propertyAttributes.projectReservedBid || 500,
        structureType: propertyAttributes.structureType || '',
        maxOwners: propertyAttributes.maxOwners || 35,
        structure: propertyAttributes.projectType,
        tradeMethod: propertyAttributes.tradeMethod || '',
        flowType: propertyAttributes.flowType || '',
        signDocument: false,
        trustee: propertyAttributes.officials && propertyAttributes.officials.TRUSTEE
            ? {
                user: propertyAttributes.officials.TRUSTEE.user,
                features: propertyAttributes.officials.TRUSTEE.officialsFeatures
                    ? propertyAttributes.officials.TRUSTEE.officialsFeatures
                    : ''
            }
            : '',
        management: propertyAttributes.officials && propertyAttributes.officials.management
            ? {
                user: propertyAttributes.officials.management.user,
                features: propertyAttributes.officials.management.officialsFeatures
                    ? propertyAttributes.officials.management.officialsFeatures
                    : ''
            }
            : '',
        mortgagee: propertyAttributes.officials && propertyAttributes.officials.mortgagee
            ? {
                user: propertyAttributes.officials.mortgagee.user,
                features: propertyAttributes.officials.mortgagee.officialsFeatures
                    ? propertyAttributes.officials.mortgagee.officialsFeatures
                    : ''
            }
            : '',
        appraisal: propertyAttributes.officials && propertyAttributes.officials.appraisal
            ? {
                user: propertyAttributes.officials.appraisal.user,
                features: propertyAttributes.officials.appraisal.officialsFeatures
                    ? propertyAttributes.officials.appraisal.officialsFeatures
                    : ''
            }
            : '',
        constraction: propertyAttributes.officials && propertyAttributes.officials.CONSTRUCTION
            ? {
                user: propertyAttributes.officials.CONSTRUCTION.user,
                features: propertyAttributes.officials.CONSTRUCTION.officialsFeatures
                    ? propertyAttributes.officials.CONSTRUCTION.officialsFeatures
                    : ''
            }
            : '',
        entrepreneur: propertyAttributes.officials && propertyAttributes.officials.ENTREPRENEUR
            ? {
                user: propertyAttributes.officials.ENTREPRENEUR.user,
                features: propertyAttributes.officials.ENTREPRENEUR.officialsFeatures
                    ? propertyAttributes.officials.ENTREPRENEUR.officialsFeatures
                    : ''
            }
            : '',
        projectBank: propertyAttributes.officials && propertyAttributes.officials.BANK
            ? {
                user: propertyAttributes.officials.BANK.user,
                features: propertyAttributes.officials.BANK.officialsFeatures
                    ? propertyAttributes.officials.BANK.officialsFeatures
                    : ''
            }
            : '',
        projectLawyer: propertyAttributes.officials && propertyAttributes.officials.LAWYER
            ? {
                user: propertyAttributes.officials.LAWYER.user,
                features: propertyAttributes.officials.LAWYER.officialsFeatures
                    ? propertyAttributes.officials.LAWYER.officialsFeatures
                    : ''
            }
            : '',
        projectMarketing: propertyAttributes.officials && propertyAttributes.officials.MARKETING
            ? {
                user: propertyAttributes.officials.MARKETING.user,
                features: propertyAttributes.officials.MARKETING.officialsFeatures
                    ? propertyAttributes.officials.MARKETING.officialsFeatures
                    : ''
            }
            : '',
        location: {
            lat: propertyAttributes.projectAddressLocationLat,
            lng: propertyAttributes.projectAddressLocationLng
        },
        subProjects: {
            map: propertyAttributes.map || ''
        },
        projectAggregator: propertyAttributes.projectType === 'Apartments' ? true : false,
        maxBulkSize: propertyAttributes.maxBulkSize || '',
        minBulkSize: propertyAttributes.minBulkSize || 1,
        type: propertyAttributes.projectType === 'Apartments' ? 'parentProject' : ''
    };
    if (propertyAttributes.projectType === 'parentProject') {
        project.subProjects.map = propertyAttributes.map;
        project.type = 'parentProject';
        project.projectAggregator = true;
    }
    console.log(`projectype is ${project.type}`);
    console.log(`projectAggregator is ${project.projectAggregator}`);
    return project;
}
const runtimeOpts = {
    timeoutSeconds: 450
};
exports.loadProject = functions
    .runWith(runtimeOpts)
    .database.ref(`server/operations/events/loadProjectTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('loadProject');
    console.log('START Loading   Project Request');
    if (request && request.key) {
        let propertyAttributes = yield getPropertyAttributes(request.projectRequestId);
        console.log(`projectype is ${propertyAttributes.projectType}`);
        if (propertyAttributes) {
            console.log(propertyAttributes);
            console.log('LOADING TERMS');
            let terms = yield saveTerms(createTerm(propertyAttributes));
            console.log('FINSH TERMS LOADING ' + terms);
            console.log('LOADING MANAGER');
            let manager = yield saveManager(yield createManager(propertyAttributes));
            console.log('FINISH LOADING MANAGER ' + manager);
            console.log('LOADING Registrar');
            let registrar = yield saveRegistrar(yield createRegistrar(propertyAttributes));
            console.log('FINISH LOADING REGISTRAR ' + registrar);
            console.log('LOADING Estimation');
            let estimation = yield saveEstimation(yield createEstimation(propertyAttributes));
            console.log('FINISH LOADING ESTIMATION ' + estimation);
            console.log('LOADING TRUSTEE');
            let trustee = yield saveTrustee(yield createTrustee(propertyAttributes));
            console.log('FINISH LOADING TRUSTEE ' + estimation);
            console.log('LOADING PROPERTY');
            let property = yield saveProperty(createProperty(manager, estimation, registrar, trustee, propertyAttributes));
            console.log('FINISH LOADING PROPERTY ' + estimation);
            console.log('LOADING ASSET MANAGER');
            let assetManager = yield createAssetManager(manager, estimation, registrar, trustee, terms, property);
            console.log('FINISH LOADING ASSET MANAGER ' + assetManager);
            let project = yield createProject(assetManager, createProjectObject(propertyAttributes, assetManager));
            console.log('END Loading Project');
            if (project.type === 'parentProject') {
                updateSubProject(project.id, propertyAttributes.projects);
            }
            db.ref('server/loadingProperties/').child(request.projectRequestId).update({
                address: project.address,
                projectId: project.id
            });
        }
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('loadProject')
            .child(request.key)
            .update({ active: false });
        db.ref('server/operations/events/loadProjectTrigger').set({ time: new Date().getTime() });
    }
}));
function updateSubProject(parentId, projects) {
    let db = admin.database();
    if (projects && Object.keys(projects).length > 0) {
        Object.keys(projects).forEach((key) => __awaiter(this, void 0, void 0, function* () {
            let propertyAttributes = yield getPropertyAttributes(projects[key].project);
            let projectId = propertyAttributes.projectId;
            if (projectId) {
                db.ref('server').child('projectsCollections/projects').child(projectId).update({
                    parentProjectId: parentId
                });
            }
        }));
    }
}
exports.replaceAdmin = functions
    .runWith(runtimeOpts)
    .database.ref(`server/operations/events/replaceAdminTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('replaceAdmin');
    if (request && request.key) {
        let newAdmin = yield wallet_1.replaceAdmin(request.admin);
        db.ref('server').child('admins').child(request.admin).set({
            accountId: newAdmin.address,
            privateKey: newAdmin.privateKey,
            nonce: 0,
            nonceDeploy: 0
        });
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('replaceAdmin')
            .child(request.key)
            .update({ active: false });
    }
}));
//# sourceMappingURL=collections.js.map