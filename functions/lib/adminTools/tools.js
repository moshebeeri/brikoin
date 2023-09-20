"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const CornerStone_json_1 = __importDefault(require("../operations/contractsLatest/CornerStone.json"));
const Disposition_json_1 = __importDefault(require("../operations/contractsLatest/Disposition.json"));
const MortgageStone_json_1 = __importDefault(require("../operations/contractsLatest/MortgageStone.json"));
const MortgageStoneStorage_json_1 = __importDefault(require("../operations/contractsLatest/MortgageStoneStorage.json"));
const CornerStoneBase_json_1 = __importDefault(require("../operations/contractsLatest/CornerStoneBase.json"));
const CornerStoneBaseStorage_json_1 = __importDefault(require("../operations/contractsLatest/CornerStoneBaseStorage.json"));
const BrokerManager_json_1 = __importDefault(require("../operations/contractsLatest/BrokerManager.json"));
const MortgageFactory_json_1 = __importDefault(require("../operations/contractsLatest/MortgageFactory.json"));
const MortgageRequestFactory_json_1 = __importDefault(require("../operations/contractsLatest/MortgageRequestFactory.json"));
const CornerTransaction_json_1 = __importDefault(require("../operations/contractsLatest/CornerTransaction.json"));
const MortgageOperations_json_1 = __importDefault(require("../operations/contractsLatest/MortgageOperations.json"));
const TradesHistory_json_1 = __importDefault(require("../operations/contractsLatest/TradesHistory.json"));
const FeeManager_json_1 = __importDefault(require("../operations/contractsLatest/FeeManager.json"));
const utils_1 = require("../operations/utils");
const wallet_1 = require("../operations/wallet");
const runtimeOpts = {
    timeoutSeconds: 450
};
exports.createNewContracts = functions
    .runWith(runtimeOpts)
    .database.ref(`server/operations/events/createNewContractsTrigger`)
    .onWrite((change, context) => __awaiter(this, void 0, void 0, function* () {
    let db = admin.database();
    let request = yield utils_1.getActiveRequest('createNewContracts');
    let configuration = yield utils_1.getConfiguration();
    console.log('STRATING INIT');
    if (request && request.key && configuration.resetSystem) {
        //create Operations Admins
        let initAdmin = yield createNewAdmin('init');
        console.log(`creating init admin ${JSON.stringify(initAdmin)}`);
        let mortgageAdmin = yield createNewAdmin('mortgage');
        let bidAskAdmin = yield createNewAdmin('bidAsk');
        let operationAdmin = yield createNewAdmin('operation');
        let projectAdmin = yield createNewAdmin('project');
        let tradeAdmin = yield createNewAdmin('trade');
        let response = yield initContracts(initAdmin.address, initAdmin.privateKey, 0);
        yield utils_1.updateNonceAdmin(response.nonce, 'init');
        yield initRoles(response.cornerStoneAddress, response.nonce, initAdmin, bidAskAdmin, mortgageAdmin, operationAdmin, projectAdmin, tradeAdmin);
        db
            .ref('server')
            .child('operations')
            .child('events')
            .child('createNewContracts')
            .child(request.key)
            .update({ active: false });
    }
}));
function createNewAdmin(adminUser) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let createdAdmin = yield wallet_1.createAdmin();
        console.log(`new adminCreated ${JSON.stringify(createdAdmin)}`);
        db.ref('server').child('admins').child(adminUser).set({
            accountId: createdAdmin.address,
            privateKey: createdAdmin.privateKey,
            nonce: 0,
            nonceDeploy: 0
        });
        return createdAdmin;
    });
}
function updateNewContractAddress(contract, contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = admin.database();
        let contractJson = {};
        contractJson[contract] = contractAddress;
        db.ref('server').child('admins').child('controlContracts').update(contractJson);
    });
}
function initContracts(adminAccount, adminPrivateKey, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('STRATING');
        // let nonce = 100
        console.log('adminAccount ' + adminAccount);
        let mortgageRequestFactoryAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, MortgageRequestFactory_json_1.default, '', nonce);
        nonce = nonce + 1;
        console.log('mortgageRequestFactoryAddress ' + mortgageRequestFactoryAddress);
        let mortgageFactoryAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, MortgageFactory_json_1.default, '', nonce);
        nonce = nonce + 1;
        console.log('mortgageFactoryAddress ' + mortgageFactoryAddress);
        let cornerStoneAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, CornerStone_json_1.default, '', nonce);
        nonce = nonce + 1;
        let cornerStone = yield wallet_1.getDeployedContracts('CornerStone', cornerStoneAddress);
        console.log('cornerStoneAddress ' + cornerStoneAddress);
        updateNewContractAddress('cornerStoneAddress', cornerStoneAddress);
        let dispositionAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, Disposition_json_1.default, '', nonce);
        nonce = nonce + 1;
        let disposition = yield wallet_1.getDeployedContracts('Disposition', dispositionAddress);
        console.log('ADD DISPOSITION CONTRACT');
        yield wallet_1.send(adminAccount, disposition.options.address, disposition.methods.addOwnership(cornerStoneAddress), adminPrivateKey, nonce);
        console.log('disposition ');
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStone.options.address, cornerStone.methods.setDispositionAddress(dispositionAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        // let tokenApproveFactory = this.deployNewContract(adminAccount, adminPrivateKey, TokenApproveFactory)
        let cornerStoneBaseStorageAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, CornerStoneBaseStorage_json_1.default, '', nonce);
        console.log('cornerStoneBaseStorageAddress ');
        nonce = nonce + 1;
        let cornerBaseAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, CornerStoneBase_json_1.default, '', nonce);
        console.log('cornerBaseAddress ');
        let cornerStoneBase = yield wallet_1.getDeployedContracts('CornerStoneBase', cornerBaseAddress);
        nonce = nonce + 1;
        let cornerStoneBaseStorage = yield wallet_1.getDeployedContracts('CornerStoneBaseStorage', cornerStoneBaseStorageAddress);
        console.log('cornerStoneBaseStorageAddress ' + cornerStoneBaseStorageAddress);
        updateNewContractAddress('cornerStoneBaseStorageAddress', cornerStoneBaseStorageAddress);
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.setCornerStoneBaseStorage(cornerStoneBaseStorageAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('cornerBaseAddress ' + cornerBaseAddress);
        updateNewContractAddress('cornerBaseAddress', cornerBaseAddress);
        yield wallet_1.send(adminAccount, cornerStoneBaseStorage.options.address, cornerStoneBaseStorage.methods.addOwnership(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.init(), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let mortgageStoneAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, MortgageStone_json_1.default, '', nonce);
        nonce = nonce + 1;
        let mortgageStoneStorageAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, MortgageStoneStorage_json_1.default, '', nonce);
        nonce = nonce + 1;
        let mortgageStoneStorage = yield wallet_1.getDeployedContracts('MortgageStoneStorage', mortgageStoneStorageAddress);
        let mortgageStone = yield wallet_1.getDeployedContracts('MortgageStone', mortgageStoneAddress);
        console.log('mortgageStoneStorageAddress ' + mortgageStoneStorageAddress);
        updateNewContractAddress('mortgageStoneStorageAddress', mortgageStoneStorageAddress);
        console.log('mortgageStoneAddress ' + mortgageStoneAddress);
        updateNewContractAddress('mortgageStoneAddress', mortgageStoneAddress);
        yield wallet_1.send(adminAccount, mortgageStoneStorage.options.address, mortgageStoneStorage.methods.addOwnership(mortgageStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, mortgageStoneStorage.options.address, mortgageStoneStorage.methods.addOwnership(cornerStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, mortgageStone.options.address, mortgageStone.methods.setStorageAddress(mortgageStoneStorageAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let mortgageOperationAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, MortgageOperations_json_1.default, '', nonce);
        let mortgageOperation = yield wallet_1.getDeployedContracts('MortgageOperations', mortgageOperationAddress);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, mortgageOperation.options.address, mortgageOperation.methods.addOwnership(mortgageStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.addOwnership(mortgageStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.addOwnership(cornerStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('mortgageOperationAddress ' + mortgageOperationAddress);
        updateNewContractAddress('mortgageOperationAddress', mortgageOperationAddress);
        yield wallet_1.send(adminAccount, mortgageStone.options.address, mortgageStone.methods.setStoneBaseAddress(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, mortgageStone.options.address, mortgageStone.methods.addOwnership(cornerStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, mortgageStone.options.address, mortgageStone.methods.setMortgageOperationAddress(mortgageOperationAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStone.options.address, cornerStone.methods.setBaseStoneAddress(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, cornerStone.options.address, cornerStone.methods.setMortgageStoneAddress(mortgageStoneAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let brokerManagerAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, BrokerManager_json_1.default, '', nonce);
        nonce = nonce + 1;
        let brokerManager = yield wallet_1.getDeployedContracts('BrokerManager', brokerManagerAddress);
        yield wallet_1.send(adminAccount, brokerManager.options.address, brokerManager.methods.addOwnership(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('brokerManagerAddress ' + brokerManagerAddress);
        updateNewContractAddress('brokerManagerAddress', brokerManagerAddress);
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.setNewBrokerManager(brokerManagerAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let feeManagerAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, FeeManager_json_1.default, '', nonce);
        nonce = nonce + 1;
        let feeManager = yield wallet_1.getDeployedContracts('FeeManager', feeManagerAddress);
        yield wallet_1.send(adminAccount, feeManager.options.address, feeManager.methods.addOwnership(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('feeManagerAddress ' + feeManagerAddress);
        updateNewContractAddress('feeManagerAddress', feeManagerAddress);
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.setNewFeeManager(feeManagerAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let tradeHistoryAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, TradesHistory_json_1.default, '', nonce);
        let tradeHistory = yield wallet_1.getDeployedContracts('TradesHistory', tradeHistoryAddress);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, tradeHistory.options.address, tradeHistory.methods.addOwnership(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('tradeHistoryAddress ' + tradeHistoryAddress);
        updateNewContractAddress('tradeHistoryAddress', tradeHistoryAddress);
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.setNewTraderHistory(tradeHistoryAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        let cornerTransactionAddress = yield wallet_1.deployNewContractWithParams(adminAccount, adminPrivateKey, CornerTransaction_json_1.default, '', nonce);
        nonce = nonce + 1;
        let cornerTransaction = yield wallet_1.getDeployedContracts('CornerTransaction', cornerTransactionAddress);
        yield wallet_1.send(adminAccount, cornerTransaction.options.address, cornerTransaction.methods.addOwnership(cornerBaseAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log('cornerTransactionAddress ' + cornerTransactionAddress);
        updateNewContractAddress('cornerTransactionAddress', cornerTransactionAddress);
        yield wallet_1.send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.setNewCornerTransaction(cornerTransactionAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        console.log(nonce);
        console.log('finish init');
        return { nonce: nonce, cornerStoneAddress: cornerStoneAddress };
    });
}
function addContractRole(adminAccount, adminPrivateKey, nonce, cornerStoneAddress, ownerAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = yield wallet_1.getDeployedContracts('CornerStone', cornerStoneAddress);
        console.log('ownerAddress ' + ownerAddress);
        yield wallet_1.send(adminAccount, contract.options.address, contract.methods.addOwnership(ownerAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        return nonce;
    });
}
function addMorttgagetRole(adminAccount, adminPrivateKey, nonce, cornerStoneAddress, ownerAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = yield wallet_1.getDeployedContracts('CornerStone', cornerStoneAddress);
        yield wallet_1.send(adminAccount, contract.options.address, contract.methods.addMortgageOperatorRole(ownerAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        yield wallet_1.send(adminAccount, contract.options.address, contract.methods.addMortgageFinanceRole(ownerAddress), adminPrivateKey, nonce);
        nonce = nonce + 1;
        return nonce;
    });
}
function initRoles(cornerStone, adminNonce, adminAccount, bidAsk, mortgage, operation, project, trade) {
    return __awaiter(this, void 0, void 0, function* () {
        let nonce = yield addContractRole(adminAccount.address, adminAccount.privateKey, adminNonce, cornerStone, bidAsk.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
        nonce = yield addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, mortgage.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
        nonce = yield addMorttgagetRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, mortgage.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
        nonce = yield addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, operation.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
        nonce = yield addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, project.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
        nonce = yield addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, trade.address);
        yield utils_1.updateNonceAdmin(nonce, 'init');
    });
}
//# sourceMappingURL=tools.js.map