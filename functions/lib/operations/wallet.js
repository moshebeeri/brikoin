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
const CornerStone_json_1 = __importDefault(require("./contractsLatest/CornerStone.json"));
const SignedDocumentFactory_json_1 = __importDefault(require("./contractsLatest/SignedDocumentFactory.json"));
const OrganizationFactory_json_1 = __importDefault(require("./contractsLatest/OrganizationFactory.json"));
const Organization_json_1 = __importDefault(require("./contractsLatest/Organization.json"));
const Estimation_json_1 = __importDefault(require("./contractsLatest/Estimation.json"));
const BrokerManager_json_1 = __importDefault(require("./contractsLatest/BrokerManager.json"));
const Terms_json_1 = __importDefault(require("./contractsLatest/Terms.json"));
const Property_json_1 = __importDefault(require("./contractsLatest/Property.json"));
const Manager_json_1 = __importDefault(require("./contractsLatest/Manager.json"));
const Mortgage_json_1 = __importDefault(require("./contractsLatest/Mortgage.json"));
const Disposition_json_1 = __importDefault(require("../operations/contractsLatest/Disposition.json"));
const Project_json_1 = __importDefault(require("./contractsLatest/Project.json"));
const StoneCoinStorage_json_1 = __importDefault(require("./contractsLatest/StoneCoinStorage.json"));
const Registrar_json_1 = __importDefault(require("./contractsLatest/Registrar.json"));
const Trustee_json_1 = __importDefault(require("./contractsLatest/Trustee.json"));
const CornerStoneBase_json_1 = __importDefault(require("./contractsLatest/CornerStoneBase.json"));
const CornerStoneBaseStorage_json_1 = __importDefault(require("./contractsLatest/CornerStoneBaseStorage.json"));
const StoneCoin_json_1 = __importDefault(require("./contractsLatest/StoneCoin.json"));
const ProjectGroups_json_1 = __importDefault(require("./contractsLatest/ProjectGroups.json"));
const ProjectGroupsStorage_json_1 = __importDefault(require("./contractsLatest/ProjectGroupsStorage.json"));
const ProjectGroupsVotingStorage_json_1 = __importDefault(require("./contractsLatest/ProjectGroupsVotingStorage.json"));
const StoneCoinMortgageStorage_json_1 = __importDefault(require("./contractsLatest/StoneCoinMortgageStorage.json"));
const MortgageFactory_json_1 = __importDefault(require("./contractsLatest/MortgageFactory.json"));
const MortgageRequestFactory_json_1 = __importDefault(require("./contractsLatest/MortgageRequestFactory.json"));
const MortgageRequest_json_1 = __importDefault(require("./contractsLatest/MortgageRequest.json"));
const StoneCoinMortgage_json_1 = __importDefault(require("./contractsLatest/StoneCoinMortgage.json"));
const CornerTransaction_json_1 = __importDefault(require("./contractsLatest/CornerTransaction.json"));
const MortgageStoneStorage_json_1 = __importDefault(require("./contractsLatest/MortgageStoneStorage.json"));
const MortgageStone_json_1 = __importDefault(require("./contractsLatest/MortgageStone.json"));
const AssetManager_json_1 = __importDefault(require("./contractsLatest/AssetManager.json"));
const AssetFactory_json_1 = __importDefault(require("./contractsLatest/AssetFactory.json"));
const TradesHistory_json_1 = __importDefault(require("./contractsLatest/TradesHistory.json"));
const MortgageOperations_json_1 = __importDefault(require("./contractsLatest/MortgageOperations.json"));
const FeeManager_json_1 = __importDefault(require("./contractsLatest/FeeManager.json"));
const utils_1 = require("./utils");
// const utils = ethers.utils
const ethers = require('ethers');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('https://brikoin.blockchain.azure.com:3200/dGKjxI0_quzj101eJEB6f3tX'));
const EthereumTx = require('ethereumjs-tx');
// const HDWalletProvider = require('truffle-hdwallet-provider')
//
// const rpcEndpoint = 'http://ethoncwg4-dns-reg1.eastus.cloudapp.azure.com:8540'
// const mnemonic = 'liar tragic valid cable ready thrive symbol bag mansion suggest envelope kiss'
// const web3 = new Web3(new Web3.providers.HttpProvider('http://ethoncwg4-dns-reg1.eastus.cloudapp.azure.com:8540'))
//const web3 = new Web3(new Web3.providers.HttpProvider('http://104.155.20.229:8400'))
const MIL = 1000000;
function createAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('create account');
        let account = yield web3.eth.accounts.create();
        // console.log('accountPrivateKey ' + JSON.stringify(accountPrivateKey))
        // let account = await web3.eth.personal.newAccount(accountPrivateKey.privateKey)
        yield utils_1.setAccountNonce(account.address, 0);
        return { address: account.address, privateKey: account.privateKey };
    });
}
exports.createAccount = createAccount;
function transferEtherFromAdmin(userAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log('TRANSFER FOUNDS')
        // // let myBalanceWei = parseInt(web3.eth.getBalance(web3.eth.defaultAccount))
        // // let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
        // // console.log(`Your wallet balance is currently ${myBalance} ETH`.green)
        // let admin = <any> await getAdminAccount('init')
        // let etherTransfer = <any> await getAdminAccount('etherTransfer')
        // web3.eth.defaultAccount = admin.accountId
        //
        // let userBalance = await web3.eth.getBalance(userAccount)
        // console.log('userBalance: ' + userBalance)
        // console.log('gasLimit ' +'0x2FAF070' )
        // if(parseInt(userBalance) < 10000) {
        //
        //     console.log('current nonce ' + etherTransfer.nonce )
        //     let details = {
        //         form: admin.accountId,
        //         nonce: etherTransfer.nonce,
        //         to: userAccount,
        //         gasLimit: '0x2FAF070',
        //         gas: '0x2FAF070',
        //         value: '0x00111111111'
        //         // EIP 155 chainId - mainnet: 1, ropsten: 3
        //     }
        //     console.log('start transacrtion')
        //
        //     const transaction = new EthereumTx(details)
        //     console.log('trasnnaction created')
        //     await transaction.sign(Buffer.from(admin.privateKey, 'hex'))
        //     console.log('transaction signed')
        //     const serializedTransaction = transaction.serialize()
        //     console.log('serializedTransaction ' + serializedTransaction)
        //     await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'))
        //     let userBalance = await web3.eth.getBalance(userAccount)
        //     console.log('userBalance ' + userBalance)
        //     await updateNonceAdmin(parseInt(etherTransfer.nonce) + 1, 'etherTransfer')
        //
        // }
    });
}
exports.transferEtherFromAdmin = transferEtherFromAdmin;
function transferEther(privateKey, address, amount) {
    return new Promise((resolve, reject) => {
        const wallet = new ethers.Wallet(privateKey);
        // We must pass in the amount as wei (1 ether = 1e18 wei), so we use
        // this convenience function to convert ether to wei.
        const etherAmount = ethers.parseEther(amount);
        const sendPromise = wallet.send(address, etherAmount);
        sendPromise
            .then(function (transactionHash) {
            // console.log(transactionHash)
            return resolve(transactionHash);
        })
            .catch((err) => {
            reject(err);
        });
    });
}
function getBalance(privateKey, address) {
    return new Promise((resolve, reject) => {
        if (!privateKey) {
            return reject(new Error('no privateKey'));
        }
        let provider = new ethers.providers.JsonRpcProvider();
        const wallet = new ethers.Wallet(privateKey, provider);
        // console.log(JSON.stringify(wallet))
        let balancePromise = wallet.getBalance();
        balancePromise
            .then((balance) => {
            resolve(ethers.utils.formatEther(balance));
        })
            .catch((err) => reject(err));
    });
}
function getContractAddress(networks) {
    if (Object.keys(networks).length > 0) {
        let networksList = Object.keys(networks).map((key) => networks[key]);
        return networksList[Object.keys(networks).length - 1].address;
    }
    return 0;
}
function depositCoins(userAccountId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerContract = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
        console.log('Start deposit');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.deposit(userAccountId, amount * MIL), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(adminAccount.nonce + 1, 'operation');
        console.log(' deposit done');
        let balance = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        return balance;
    });
}
exports.depositCoins = depositCoins;
function depositCoinsProject(userAccountId, amount, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('trade');
        let cornerContract = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
        console.log('Start deposit');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.depositProject(userAccountId, amount * MIL, projectAddress), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(adminAccount.nonce + 1, 'trade');
        console.log(' deposit done');
        let balance = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        return balance;
    });
}
exports.depositCoinsProject = depositCoinsProject;
function withdrawCoins(userAccountId, amount, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerContract = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
        console.log('Start deposit');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.withdraw(userAccountId, amount * MIL), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.withdrawApprove(userAccountId, amount * MIL, projectAddress), adminAccount.privateKey, parseInt(adminAccount.nonce) + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce + 2), 'operation');
        console.log(' withdraw done');
        let balance = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        return balance;
    });
}
exports.withdrawCoins = withdrawCoins;
function payIncome(projectAddress, payIncome) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerContract = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
        console.log('pay yield');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.payIncome(projectAddress, payIncome * MIL), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(adminAccount.nonce + 1, 'operation');
    });
}
exports.payIncome = payIncome;
function createProjectInitialAsk(adminAccount, stoneCoinAddress, target) {
    return __awaiter(this, void 0, void 0, function* () {
        let contracts = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', contracts.cornerStoneAddress);
        console.log('current nonce: ' + adminAccount.nonce);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.initialAskAdmin(adminAccount.accountId, stoneCoinAddress, target), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(adminAccount.nonce + 1, 'project');
    });
}
exports.createProjectInitialAsk = createProjectInitialAsk;
function projectCancelOrder(userAccountId, userPrivateKey, stoneCoinAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('bidAsk');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.askCancelAdmin(userAccountId, stoneCoinAddress), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'bidAsk');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress), adminAccount.privateKey, parseInt(adminAccount.nonce) + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'bidAsk');
        return { success: true };
    });
}
exports.projectCancelOrder = projectCancelOrder;
function getUserTransactions(userAccountId, startingIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.setTransactionManager(adminAccount.accountId), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        let transactionManagerAddress = yield contract.methods
            .getTransactionManager()
            .call({ from: adminAccount.accountId });
        console.log('transactionManagerAddress ' + transactionManagerAddress);
        let cornerTransaction = getDeployedContracts('CornerTransaction', transactionManagerAddress);
        let userTransactionsLength = yield cornerTransaction.methods
            .getTransactionsLength(userAccountId)
            .call({ from: adminAccount.accountId });
        console.log('userTransactionsLength ' + userTransactionsLength);
        let transactions = [];
        for (let i = startingIndex; i < userTransactionsLength; i++) {
            let transaction = {};
            transaction.time = yield cornerTransaction.methods
                .getTransactionsTime(userAccountId, i)
                .call({ from: adminAccount.accountId });
            transaction.amount = yield cornerTransaction.methods
                .getTransaction(userAccountId, i)
                .call({ from: adminAccount.accountId });
            transaction.projectAddress = yield cornerTransaction.methods
                .getTransactionsStoneCoin(userAccountId, i)
                .call({ from: adminAccount.accountId });
            transaction.isAdd = yield cornerTransaction.methods
                .isAddTransaction(userAccountId, i)
                .call({ from: adminAccount.accountId });
            transaction.description = yield cornerTransaction.methods
                .getTransactionDescription(userAccountId, i)
                .call({ from: adminAccount.accountId });
            console.log('transaction ' + transaction);
            transactions.push(transaction);
        }
        return transactions;
    });
}
exports.getUserTransactions = getUserTransactions;
function projectBidRequest(userAccountId, stoneCoinAddress, target, limit, signDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('bidAsk');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        console.log('userAccountId ' +
            userAccountId +
            ' stoneCoinAddress ' +
            stoneCoinAddress +
            ' target ' +
            target +
            ' limit ' +
            limit);
        let nonce = adminAccount.nonce;
        // await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceAdmin(nonce, 'bidAsk');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.bidAdmin(userAccountId, stoneCoinAddress, target, limit * MIL, signDocument || 0), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceAdmin(nonce, 'bidAsk');
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter };
    });
}
exports.projectBidRequest = projectBidRequest;
function cancelBidReqeust(userAccountId, stoneCoinAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('bidAsk');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        let nonce = adminAccount.nonce;
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceAdmin(nonce, 'bidAsk');
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter };
    });
}
exports.cancelBidReqeust = cancelBidReqeust;
function getProjectReservedPrice(stoneCoinAddress, userAccountId) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('StoneCoin', stoneCoinAddress);
        let reservedPrice = yield contract.methods.getReservedPrice().call({ from: userAccountId });
        return reservedPrice / MIL;
    });
}
exports.getProjectReservedPrice = getProjectReservedPrice;
function setProjectReserved(adminAccount, adminPrivateKey, nonce, stoneCoinAddress, reservedPrice) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('StoneCoin', stoneCoinAddress);
        console.log('SET Project Reserved');
        yield sendAdminTransaction(adminAccount, contract.options.address, contract.methods.setReservedPrice(reservedPrice), adminPrivateKey, nonce);
    });
}
exports.setProjectReserved = setProjectReserved;
function projectBidReserve(userAccountId, userPrivateKey, stoneCoinAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        console.log('userAccountId ' + userAccountId + ' stoneCoinAddress ' + stoneCoinAddress);
        let userNonce = yield utils_1.getUserNonce(userAccountId);
        let privateKey = userPrivateKey.substring(2);
        let nonce = userNonce ? userNonce.nonce : 0;
        yield transferEtherFromAdmin(userAccountId);
        // await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
        yield sendAdminTransaction(userAccountId, contract.options.address, contract.methods.cancelReserveBid(stoneCoinAddress), privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceUser(nonce, userAccountId);
        yield sendAdminTransaction(userAccountId, contract.options.address, contract.methods.reservedBid(stoneCoinAddress), privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceUser(nonce, userAccountId);
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter };
    });
}
exports.projectBidReserve = projectBidReserve;
function cancelProjectBidReserve(userAccountId, userPrivateKey, stoneCoinAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        console.log('userAccountId ' + userAccountId + ' stoneCoinAddress ' + stoneCoinAddress);
        let userNonce = yield utils_1.getUserNonce(userAccountId);
        let privateKey = userPrivateKey.substring(2);
        let nonce = userNonce ? userNonce.nonce : 0;
        yield transferEtherFromAdmin(userAccountId);
        // await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
        yield sendAdminTransaction(userAccountId, contract.options.address, contract.methods.cancelReserveBid(stoneCoinAddress), privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceUser(nonce, userAccountId);
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter };
    });
}
exports.cancelProjectBidReserve = cancelProjectBidReserve;
function projectBidMortgageRequest(userAccountId, userPrivateKey, request, adminAccountId, adminPrivatekey, signDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let bidAccount = yield utils_1.getAdminAccount('bidAsk');
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        try {
            console.log('START BID TRANSACTION');
            console.log(JSON.stringify(request));
            console.log('Creating Mortgage');
            let limit = Number(request.price) * MIL;
            let bid = {
                mortgageRequestAddress: request.mortgageRequestAddress,
                stoneCoinAddress: request.projectId,
                downPaymentMicros: Number(request.downPayment) * MIL,
                amount: request.size,
                limit_micros: limit,
                signDocument: signDocument || 0
            };
            console.log(JSON.stringify(bid));
            console.log('BID TRANSACTION');
            yield sendAdminTransaction(bidAccount.accountId, contract.options.address, contract.methods.bidMortgagedAdmin(userAccountId, request.mortgageRequestAddress, request.projectId, Number(request.downPayment) * MIL, request.size, limit, signDocument || 0), bidAccount.privateKey, bidAccount.nonce);
            yield utils_1.updateNonceAdmin(parseInt(bidAccount.nonce + 1), 'bidAsk');
            console.log('DONE BID TRANSACTION');
            return { success: true };
        }
        catch (error) {
            console.log(JSON.stringify(error));
            console.log('FAILED');
            return { success: false };
        }
    });
}
exports.projectBidMortgageRequest = projectBidMortgageRequest;
function projectAskMortgageRequest(userAccountId, userPrivateKey, tradeRequest, signDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let bidAsk = yield utils_1.getAdminAccount('bidAsk');
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        console.log('ASK AMOUNT REQUEST: ' + tradeRequest.size);
        let askAmount = yield contract.methods
            .askAmount(tradeRequest.projectId, userAccountId)
            .call({ from: userAccountId });
        console.log('ASK AMOUNT BEFORE ' + askAmount);
        console.log('ASK TRADE REQUEST ' + JSON.stringify(tradeRequest));
        yield sendAdminTransaction(bidAsk.accountId, contract.options.address, contract.methods.askCancel(tradeRequest.projectId), bidAsk.privateKey, bidAsk.nonce);
        yield utils_1.updateNonceAdmin(parseInt(bidAsk.nonce) + 1, 'bidAsk');
        yield sendAdminTransaction(bidAsk.accountId, contract.options.address, contract.methods.askMortgagedAdmin(userAccountId, tradeRequest.mortgageAddress, tradeRequest.projectId, tradeRequest.size, tradeRequest.price * MIL, signDocument || 0), bidAsk.privateKey, parseInt(bidAsk.nonce) + 1);
        yield utils_1.updateNonceAdmin(parseInt(bidAsk.nonce) + 2, 'bidAsk');
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        askAmount = yield contract.methods.askAmount(tradeRequest.projectId, userAccountId).call({ from: userAccountId });
        console.log('ASK AMOUNT AFTER  ' + askAmount);
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter, askAmount: askAmount };
    });
}
exports.projectAskMortgageRequest = projectAskMortgageRequest;
function addProjectDocument(assetManagerAddress, role, documentMd5) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('AssetManager', assetManagerAddress);
        let adminAccount = yield utils_1.getAdminAccount('init');
        console.log(`adding new document to ${assetManagerAddress} role : ${role} documentMd5 : ${documentMd5}`);
        yield sendAdminTransactionWithGas(adminAccount.accountId, contract.options.address, contract.methods.addProjectDocument(role, 'test'), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
        console.log('adding new document done ');
        return true;
    });
}
exports.addProjectDocument = addProjectDocument;
function addProjectRole(assetManagerAddress, role, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let contract = getDeployedContracts('AssetManager', assetManagerAddress);
        let adminAccount = yield utils_1.getAdminAccount('init');
        console.log(`adding user role ${assetManagerAddress} role : ${role} user : ${userAccount.accountId}`);
        yield sendAdminTransactionWithGas(adminAccount.accountId, contract.options.address, contract.methods.addProjectOfficial(role, userAccount.accountId), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
        // console.log(`adding user role ${assetManagerAddress} role : ${role} user : ${userAccount.accountId}`)
        //
        // let nonce = <any> await getUserNonce(userAccount.accountId)
        // await send(userAccount.accountId, contract.options.address, contract.methods.addProjectOfficial(role, userAccount.accountId), userAccount.privateKey, nonce.nonce)
        // await updateNonceUser(userAccount.accountId, parseInt(nonce.nonce) + 1)
        console.log('adding user role done ');
        return true;
    });
}
exports.addProjectRole = addProjectRole;
function setMortgagePayment(mortgageAddress, index, payment) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('mortgage');
        let mortgage = getDeployedContracts('Mortgage', mortgageAddress);
        yield sendAdminTransaction(adminAccount.accountId, mortgage.options.address, mortgage.methods.addPaymentSchedule(index, parseFloat(payment.interestRate) * 1000, parseFloat(payment.scheduledMonthlyPayment) * MIL, parseFloat(payment.interest) * 1000, parseFloat(payment.principal) * MIL, parseFloat(payment.principalTotal) * MIL, 0, parseFloat(payment.paymentTotal) * MIL, new Date(payment.paymentDate).getTime(), parseFloat(payment.remainingLoanBalnce) * MIL, Number(payment.loanMonth), Number(payment.loanYear)), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(adminAccount.nonce + 1, 'mortgage');
        return true;
    });
}
exports.setMortgagePayment = setMortgagePayment;
function addMortgageCondition(condition, mortgageeAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('MortgageRequestFactory', cornerStone.mortgageRequestFactoryAddress);
        let cornerStoneContract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        let userNonce = yield utils_1.getUserNonce(mortgageeAccount.accountId);
        let nonce = userNonce ? userNonce.nonce : 0;
        console.log('nonce ' + nonce);
        let privateKey = mortgageeAccount.privateKey.substring(2);
        yield sendAdminTransaction(mortgageeAccount.accountId, cornerStone.mortgageRequestFactoryAddress, contract.methods.createMortgageeCondition(false, condition.project, parseFloat(condition.maxMortgage) * MIL, parseFloat(condition.interestRateArm) * 1000, parseFloat(condition.interestRateFixed) * 1000, parseFloat(condition.downPayment) * 1000, parseInt(condition.maxYears) * 12, 0, 0, 0, 0), privateKey, nonce);
        yield utils_1.updateNonceUser(parseInt(nonce) + 1, mortgageeAccount.accountId);
        let conditionAddress = yield contract.methods
            .getLastMortgageConditionTest()
            .call({ from: mortgageeAccount.accountId });
        let mortgageeAveFunds = yield cornerStoneContract.methods
            .mortgageeBalanceOf(mortgageeAccount.accountId)
            .call({ from: mortgageeAccount.accountId });
        return { conditionAddress: conditionAddress, mortgageeAveFunds: mortgageeAveFunds };
    });
}
exports.addMortgageCondition = addMortgageCondition;
function addMortgageRequest(request, userAccount) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('MortgageRequestFactory', cornerStone.mortgageRequestFactoryAddress);
        let downPaymentPercentMill = parseInt(request.downPayment) *
            MIL /
            (parseInt(request.downPayment) * MIL + parseInt(request.amount) * MIL) *
            100 *
            1000;
        console.log('downPaymentPercentMill: ' + downPaymentPercentMill);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? userNonce.nonce : 0;
        let privateKey = userAccount.privateKey.substring(2);
        yield sendAdminTransaction(userAccount.accountId, contract.options.address, contract.methods.createMortgageRequest(userAccount.accountId, request.project, request.mortgageConditionAddress, parseFloat(request.amount) * MIL, parseFloat(request.downPayment) * MIL, parseInt(request.years) * 12, downPaymentPercentMill, request.mortgagee), privateKey, nonce);
        yield utils_1.updateNonceUser(parseInt(nonce) + 1, userAccount.accountId);
        let mortgageRequestAddress = yield contract.methods
            .lastMortgageRequest(userAccount.accountId)
            .call({ from: userAccount.accountId });
        return mortgageRequestAddress;
    });
}
exports.addMortgageRequest = addMortgageRequest;
function saveEntity(contractName, adminAccount, entity) {
    return __awaiter(this, void 0, void 0, function* () {
        let contractObj = this.getContractByName(contractName);
        let contract = yield this.deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, contractObj, entity, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
        return contract;
    });
}
exports.saveEntity = saveEntity;
function deployNewContractWithParams(adminAccount, adminPrivateKey, contractObj, parameters, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStoneContract = new web3.eth.Contract(contractObj.abi, { from: adminAccount });
        let code = contractObj.bytecode;
        console.log('FROM ACCOUNT : ' + adminAccount);
        web3.eth.defaultAccount = adminAccount;
        let values;
        // console.log('parameters')
        // console.log(parameters)
        if (parameters) {
            values = Object.keys(parameters).map(function (key) {
                return parameters[key];
            });
        }
        // console.log(values)
        let transaction = values
            ? yield cornerStoneContract.deploy({ data: code, arguments: values, from: adminAccount })
            : yield cornerStoneContract.deploy({ data: code, from: adminAccount });
        let gas = yield transaction.estimateGas({ from: adminAccount });
        console.log(gas);
        let options = {
            nonce: nonce,
            from: adminAccount,
            to: transaction._parent._address,
            data: transaction.encodeABI(),
            gas: gas
        };
        console.log(options);
        let signedTransaction = yield web3.eth.accounts.signTransaction(options, adminPrivateKey);
        console.log('tran');
        console.log('DEFAULT ACCOUNT ' + JSON.stringify(web3.eth.defaultAccount));
        let handle = yield web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        console.log('after handle');
        return handle.contractAddress;
    });
}
exports.deployNewContractWithParams = deployNewContractWithParams;
function approveMortgageRequest(request, userAccount, userPrivateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('MortgageRequest', request.mortgageRequestAddress);
        let adminAccount = yield utils_1.getCornerStone();
        let mortgageAccount = yield utils_1.getAdminAccount('mortgage');
        console.log('approving');
        console.log('contract: ' + JSON.stringify(contract));
        let mortgagee = yield contract.methods.getMortgagee().call({ from: userAccount });
        console.log('mortgagee ' + mortgagee);
        console.log('userAccount ' + userAccount);
        console.log('privateKey Before ' + userPrivateKey);
        let privateKey = userPrivateKey.substring(2);
        console.log('privateKey After ' + privateKey);
        let mortgageCondition = yield contract.methods.getMortgageCondition().call({ from: userAccount });
        console.log('mortgageCondition ' + mortgageCondition);
        let userNonce = yield utils_1.getUserNonce(userAccount);
        let nonce = userNonce ? userNonce.nonce : 0;
        yield transferEtherFromAdmin(userAccount);
        yield sendAdminTransaction(userAccount, request.mortgageRequestAddress, contract.methods.approve(), privateKey, nonce);
        nonce = parseInt(nonce) + 1;
        yield utils_1.updateNonceUser(nonce, userAccount);
        console.log('Mortgage creating');
        let mortgageAddress = yield deployNewContractWithParams(mortgageAccount.accountId, mortgageAccount.privateKey, Mortgage_json_1.default, {
            _stoneCoinAddress: request.projectId,
            _mortgagee: mortgagee,
            _buyer: userAccount,
            _mortgageRequest: request.mortgageRequestAddress,
            _mortgageeCondition: request.mortgageConditionAddress,
            _isExternal: false
        }, mortgageAccount.nonceDeploy);
        yield utils_1.updateNonceDeployAdmin(parseInt(mortgageAccount.nonceDeploy) + 1, 'mortgage');
        console.log(`new Mortgage Address  ${mortgageAddress}`);
        let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
        console.log(`add owner : ${adminAccount.mortgageOperationAddress}`);
        // await sendAdminTransaction(mortgageAccount.accountId, mortgageContract.options.address, mortgageContract.methods.addOwnership(
        //     adminAccount.mortgageOperationAddress
        // ), mortgageAccount.privateKey, parseInt(mortgageAccount.nonce) + 1)
        //
        yield send(mortgageAccount.accountId, mortgageContract.options.address, mortgageContract.methods.addOwnership(adminAccount.mortgageOperationAddress), mortgageAccount.privateKey, parseInt(mortgageAccount.nonceDeploy) + 1);
        yield utils_1.updateNonceDeployAdmin(parseInt(mortgageAccount.nonceDeploy) + 2, 'mortgage');
        console.log('ownership added');
        yield sendAdminTransaction(userAccount, mortgageContract.options.address, mortgageContract.methods.setMortgageRegistrar(toBlockChainString('url'), toBlockChainString('urlMD5')), privateKey, nonce);
        nonce = parseInt(nonce) + 1;
        yield utils_1.updateNonceUser(nonce, userAccount);
        console.log('approve yeyy');
        return { success: true, mortgageAddress: mortgageAddress };
    });
}
exports.approveMortgageRequest = approveMortgageRequest;
function setMortgageeAmount(userAccountId, mortgageRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('mortgage');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        let MortgageFactory = getDeployedContracts('MortgageFactory', cornerStone.mortgageFactoryAddress);
        let balanceBefore = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        console.log('balanceBefore: ' + balanceBefore);
        console.log('amount: ' + mortgageRequest.amount);
        let mortgageeAddress = yield MortgageFactory.methods.mortgageeAddress(userAccountId).call({ from: userAccountId });
        console.log('mortgageeAddress: ' + mortgageeAddress);
        console.log('new version2');
        if (mortgageeAddress === '0x0000000000000000000000000000000000000000') {
            // console.log('CREATING NEW')
            yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
            yield sendAdminTransaction(adminAccount.accountId, MortgageFactory.options.address, MortgageFactory.methods.createMortgagee(userAccountId, Number(mortgageRequest.amount * MIL), toBlockChainString(mortgageRequest.name), toBlockChainString(mortgageRequest.type), toBlockChainString(mortgageRequest.city), toBlockChainString(mortgageRequest.country), toBlockChainString(mortgageRequest.address), toBlockChainString(mortgageRequest.businessIndentifier)), adminAccount.privateKey, adminAccount.nonce);
            // console.log('CREATING DONE')
            mortgageeAddress = yield MortgageFactory.methods
                .mortgageeAddress(userAccountId)
                .call({ from: adminAccount.accountId });
            // console.log('mortgageeAddress: ' + mortgageeAddress)
            yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addMortgegeeAdmin(userAccountId, Number(mortgageRequest.amount * MIL), Number(mortgageRequest.amount * MIL), mortgageeAddress), adminAccount.privateKey, parseInt(adminAccount.nonce) + 1);
            yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'mortgage');
        }
        else {
            yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addMortgegeeAdmin(userAccountId, Number(mortgageRequest.amount * MIL), Number(mortgageRequest.amount * MIL), mortgageeAddress), adminAccount.privateKey, adminAccount.nonce);
            yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
        }
        // console.log(mortgageeAddress)
        let balanceAfter = yield contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
        let success = true;
        if (balanceBefore === balanceAfter) {
            success = false;
        }
        // console.log('balanceAfter: ' + balanceAfter)
        console.log(JSON.stringify({ success: success, balance: balanceAfter, mortgageeAddress: mortgageeAddress }));
        return { success: success, balance: balanceAfter, mortgageeAddress: mortgageeAddress };
    });
}
exports.setMortgageeAmount = setMortgageeAmount;
function getUserCurrentBalance(userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        let balance = yield contract.methods.balanceOf(userAccountAddress).call({ from: userAccountAddress });
        return balance;
    });
}
exports.getUserCurrentBalance = getUserCurrentBalance;
function getUserMortgageeBalance(userAccountAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        let balance = yield contract.methods.mortgageeBalanceOf(userAccountAddress).call({ from: userAccountAddress });
        return balance;
    });
}
exports.getUserMortgageeBalance = getUserMortgageeBalance;
function getBrokerFeeTransaction(brokerAccountAddress, userAccountAddress, index) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let adminAccount = yield utils_1.getCornerStone();
            let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
            let brokerManagerAddress = yield contract.methods.getBrokerManager().call({ from: brokerAccountAddress });
            let brokerManagerContract = getDeployedContracts('BrokerManager', brokerManagerAddress);
            let fee = yield brokerManagerContract.methods
                .getBrokerHistoryFee(brokerAccountAddress, userAccountAddress, index, 0)
                .call({ from: brokerAccountAddress });
            let amount = yield brokerManagerContract.methods
                .getBrokerHistoryAmount(brokerAccountAddress, userAccountAddress, index, 0)
                .call({ from: brokerAccountAddress });
            let price = yield brokerManagerContract.methods
                .getBrokerHistoryBuyingPrice(brokerAccountAddress, userAccountAddress, index, 0)
                .call({ from: brokerAccountAddress });
            let time = yield brokerManagerContract.methods
                .getBrokerHistoryTime(brokerAccountAddress, userAccountAddress, index, 0)
                .call({ from: brokerAccountAddress });
            let projectAddress = yield brokerManagerContract.methods
                .getBrokerHistoryProject(brokerAccountAddress, userAccountAddress, index, 0)
                .call({ from: brokerAccountAddress });
            return { fee: fee, amount: amount, price: price, time: time, projectAddress: projectAddress };
        }
        catch (error) {
            return false;
        }
    });
}
exports.getBrokerFeeTransaction = getBrokerFeeTransaction;
function getUserHoldings(userAccountAddress, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // console.log('start holdings')
            let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
            // console.log('get contract holdings')
            let balance = yield stonCoinContract.methods.balanceOf(userAccountAddress).call({ from: userAccountAddress });
            // console.log('end contract holdings')
            return balance;
        }
        catch (error) {
            // console.log('ERROR ' + JSON.stringify(error))
            return 0;
        }
    });
}
exports.getUserHoldings = getUserHoldings;
function getUserRemainingMortgage(mortgageAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
        let remainingMortgage = yield mortgageContract.methods.getRemainingLoanBalance().call({ from: userAddress });
        return remainingMortgage;
    });
}
exports.getUserRemainingMortgage = getUserRemainingMortgage;
function getMortgageeBalance(userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        let mortgageeBalance = yield contract.methods.mortgageeBalanceOf(userAddress).call({ from: userAddress });
        return mortgageeBalance;
    });
}
exports.getMortgageeBalance = getMortgageeBalance;
function clearMortgage(mortgageAddress, userAccountId, userPrivateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        yield sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.clearAllMortgage(mortgageAddress), userPrivateKey);
        let remainingMortgage = yield getUserRemainingMortgage(mortgageAddress, userAccountId);
        return remainingMortgage;
    });
}
exports.clearMortgage = clearMortgage;
function createSignedDocument(approveByAdmin, url, md5, adminAccountId) {
    return __awaiter(this, void 0, void 0, function* () {
        let request = {
            approveByAdmin: approveByAdmin,
            url: toBlockChainString(url),
            md5: toBlockChainString(md5)
        };
        let signedDocument = yield saveEntity('SignedDocument', adminAccountId, request);
        return signedDocument;
    });
}
exports.createSignedDocument = createSignedDocument;
function shouldSignAdminDocument(documentAddress, userAddress, role, adminAccountId, adminPrivateLey) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContract('SignedDocumentFactory');
        let adminAccount = yield utils_1.getAdminAccountId();
        try {
            yield utils_1.updateNonce(adminAccount.nonce + 1);
            yield sendAdmin(adminAccountId, contract.options.address, contract.methods.shouldSign(documentAddress, userAddress, toBlockChainString(role)), adminPrivateLey, adminAccount.nonce);
            return { success: true };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.shouldSignAdminDocument = shouldSignAdminDocument;
function assignNewBroker(userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        console.log(`adding new role ${userAddress}`);
        console.log(`admin ${JSON.stringify(adminAccount)}`);
        console.log(`contract ${JSON.stringify(contract.options)}`);
        try {
            yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addBroker(userAddress), adminAccount.privateKey, adminAccount.nonce);
            console.log(`success`);
        }
        catch (eror) {
            console.log(`ERROR ${JSON.stringify(eror)}`);
            return { success: false };
        }
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        return { success: true };
    });
}
exports.assignNewBroker = assignNewBroker;
function addOrganization(name, phoneNumber, email) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        console.log('start adding Organization');
        let organizationAddress = yield deployNewContractWithParams(adminAccount.accountId, adminAccount.privateKey, Organization_json_1.default, {
            name: toBlockChainString(name),
            phoneNumber: toBlockChainString(phoneNumber),
            email: toBlockChainString(email)
        }, adminAccount.nonceDeploy);
        yield utils_1.updateNonceDeployAdmin(parseInt(adminAccount.nonceDeploy) + 1, 'operation');
        console.log('organizationAddress: ' + organizationAddress);
        return { success: true, organizationAddress: organizationAddress };
    });
}
exports.addOrganization = addOrganization;
function inviteUserGroup(creator, groupAddress, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(creator);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let invitedUser = yield utils_1.getUserActiveAccount(user);
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.inviteMember(invitedUser.accountId), userAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
    });
}
exports.inviteUserGroup = inviteUserGroup;
function joinGroup(groupAddress, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.joinGroup(), userAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
    });
}
exports.joinGroup = joinGroup;
function isVotingMember(groupAddress, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        let result = yield projectGroupsContract.methods.isVotingMember().call({ from: userAccount.accountId });
        return result;
    });
}
exports.isVotingMember = isVotingMember;
function hasGroupOffer(groupAddress, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        let result = yield projectGroupsContract.methods.getOffer().call({ from: userAccount.accountId });
        return result > 0;
    });
}
exports.hasGroupOffer = hasGroupOffer;
function isGroupRepresentative(groupAddress, user) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        let result = yield projectGroupsContract.methods
            .isGroupRepresentative(userAccount.accountId)
            .call({ from: userAccount.accountId });
        return result;
    });
}
exports.isGroupRepresentative = isGroupRepresentative;
function updatePaymentStatus(groupAddress, user, trustee, amount, addOperation) {
    return __awaiter(this, void 0, void 0, function* () {
        let trusteeAccount = yield utils_1.getUserActiveAccount(trustee);
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let userNonce = yield utils_1.getUserNonce(trusteeAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(trusteeAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.paymentStatus(userAccount.accountId, amount, addOperation), trusteeAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, trusteeAccount.accountId);
        let isVotingMember = yield projectGroupsContract.methods
            .isVotingMember()
            .call({ from: userAccount.accountId });
        return isVotingMember;
    });
}
exports.updatePaymentStatus = updatePaymentStatus;
function setUserOffer(groupId, user, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let group = yield utils_1.getGroup(groupId);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', group.groupAddress);
        console.log(`userNonce : ${userNonce} user nonoce: ${nonce}`);
        console.log(`group : ${JSON.stringify(group)} `);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.setOffer(amount), userAccount.privateKey, nonce);
        console.log(`update nonce ${userAccount.accountId} : ${nonce + 1} `);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
    });
}
exports.setUserOffer = setUserOffer;
function addGroupVote(documentMd5, type, groupAddress, groupCreator) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(groupCreator);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.setVotingType(documentMd5, type), userAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
    });
}
exports.addGroupVote = addGroupVote;
function addGroupRpresentive(groupAddress, groupCreator, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(groupCreator);
        let representativeAccount = yield utils_1.getUserActiveAccount(userId);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.addGroupRepresentation(representativeAccount.accountId), userAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
    });
}
exports.addGroupRpresentive = addGroupRpresentive;
function vote(user, documentMd5, voteResult, groupAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(user);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, projectGroupsContract.options.address, projectGroupsContract.methods.vote(documentMd5, voteResult), userAccount.privateKey, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
        let votingResult = yield projectGroupsContract.methods
            .getVotingResult(documentMd5)
            .call({ from: userAccount.accountId });
        let voters = yield projectGroupsContract.methods
            .getNumberOfVoters(documentMd5)
            .call({ from: userAccount.accountId });
        let positiveVoters = yield projectGroupsContract.methods
            .getVotingPositiveResult(documentMd5)
            .call({ from: userAccount.accountId });
        return { numberOfVoters: voters, numberOfPositiveVoters: positiveVoters, votingResult: votingResult };
    });
}
exports.vote = vote;
function createGroup(creator, projectAddress, isOpen) {
    return __awaiter(this, void 0, void 0, function* () {
        let userAccount = yield utils_1.getUserActiveAccount(creator);
        let userNonce = yield utils_1.getUserNonce(userAccount.accountId);
        let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
        console.log('start adding group');
        console.log(`nonce ${nonce}`);
        console.log(`groups params: ${JSON.stringify({
            projectAddress: projectAddress,
            creator: userAccount.accountId,
            isOpen: isOpen
        })}`);
        let groupAddress = yield deployNewContractWithParams(userAccount.accountId, userAccount.privateKey, ProjectGroups_json_1.default, {
            projectAddress: projectAddress,
            creator: userAccount.accountId,
            isOpen: isOpen
        }, nonce);
        yield utils_1.updateNonceUser(nonce + 1, userAccount.accountId);
        let projectGroupsStorageAddress = yield deployNewContractWithParams(userAccount.accountId, userAccount.privateKey, ProjectGroupsStorage_json_1.default, {}, nonce + 1);
        yield utils_1.updateNonceUser(nonce + 2, userAccount.accountId);
        let projectGroupsVotingStorageAddress = yield deployNewContractWithParams(userAccount.accountId, userAccount.privateKey, ProjectGroupsVotingStorage_json_1.default, {}, nonce + 2);
        yield utils_1.updateNonceUser(nonce + 3, userAccount.accountId);
        let projectGroupStorageContract = getDeployedContracts('ProjectGroupsStorage', projectGroupsStorageAddress);
        yield send(userAccount.accountId, projectGroupStorageContract.options.address, projectGroupStorageContract.methods.addOwnership(groupAddress), userAccount.privateKey, nonce + 3);
        yield utils_1.updateNonceUser(nonce + 4, userAccount.accountId);
        yield send(userAccount.accountId, projectGroupStorageContract.options.address, projectGroupStorageContract.methods.addOwnership(projectGroupsVotingStorageAddress), userAccount.privateKey, nonce + 4);
        yield utils_1.updateNonceUser(nonce + 5, userAccount.accountId);
        let projectGroupStorageVotingContract = getDeployedContracts('ProjectGroupsVotingStorage', projectGroupsVotingStorageAddress);
        yield send(userAccount.accountId, projectGroupStorageVotingContract.options.address, projectGroupStorageVotingContract.methods.addOwnership(groupAddress), userAccount.privateKey, nonce + 5);
        yield utils_1.updateNonceUser(nonce + 6, userAccount.accountId);
        yield send(userAccount.accountId, projectGroupStorageVotingContract.options.address, projectGroupStorageVotingContract.methods.addOwnership(projectGroupsStorageAddress), userAccount.privateKey, nonce + 6);
        yield utils_1.updateNonceUser(nonce + 7, userAccount.accountId);
        yield send(userAccount.accountId, projectGroupStorageVotingContract.options.address, projectGroupStorageVotingContract.methods.setProjectGroupStorageAddress(projectGroupsStorageAddress), userAccount.privateKey, nonce + 7);
        yield utils_1.updateNonceUser(nonce + 8, userAccount.accountId);
        let ProjectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
        yield send(userAccount.accountId, ProjectGroupsContract.options.address, ProjectGroupsContract.methods.setProjectGroupsStorage(projectGroupsStorageAddress), userAccount.privateKey, nonce + 8);
        yield utils_1.updateNonceUser(nonce + 9, userAccount.accountId);
        yield send(userAccount.accountId, ProjectGroupsContract.options.address, ProjectGroupsContract.methods.setProjectGroupsVotingStorage(projectGroupsVotingStorageAddress), userAccount.privateKey, nonce + 9);
        yield utils_1.updateNonceUser(nonce + 10, userAccount.accountId);
        yield send(userAccount.accountId, ProjectGroupsContract.options.address, ProjectGroupsContract.methods.init(), userAccount.privateKey, nonce + 10);
        yield utils_1.updateNonceUser(nonce + 11, userAccount.accountId);
        console.log('groupAddress: ' + groupAddress);
        return { success: true, groupAddress: groupAddress };
    });
}
exports.createGroup = createGroup;
function assignProjectToOrg(projectAddress, organization) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('StoneCoin', projectAddress);
        let adminAccount = yield utils_1.getAdminAccount('project');
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.setOrganization(organization), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');
        return { success: true };
    });
}
exports.assignProjectToOrg = assignProjectToOrg;
function updateProjectTarget(projectAddress, dilution, units) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('StoneCoin', projectAddress);
        let adminAccount = yield utils_1.getAdminAccount('project');
        let ownerBalance = yield contract.methods.getOwnerBalance().call({ from: adminAccount.accountId });
        let stones = yield contract.methods.STONES().call({ from: adminAccount.accountId });
        if (dilution) {
            yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.dilutionStoneCoin(units), adminAccount.privateKey, adminAccount.nonce);
            yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');
        }
        else {
            if (ownerBalance >= units) {
                yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.removeStoneCoin(units), adminAccount.privateKey, adminAccount.nonce);
                yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');
            }
        }
        console.log(`project stones updated `);
        ownerBalance = yield contract.methods.getOwnerBalance().call({ from: adminAccount.accountId });
        let newStones = yield contract.methods.STONES().call({ from: adminAccount.accountId });
        if (newStones !== stones) {
            console.log(`project ask updating `);
            adminAccount = (yield utils_1.getAdminAccount('project'));
            yield createProjectInitialAsk(adminAccount, projectAddress, stones);
            console.log(`project ask updating done`);
        }
        return { success: true, ownerBalance: ownerBalance, target: stones };
    });
}
exports.updateProjectTarget = updateProjectTarget;
function payBroker(userAddress, payment) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        try {
            console.log('PAY BROKER');
            yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.payBroker(userAddress, payment, 0), adminAccount.privateKey, adminAccount.nonce);
            yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
            let brokerManagerAddress = yield contract.methods.getBrokerManager().call({ from: userAddress });
            let brokerManagerContract = getDeployedContracts('BrokerManager', brokerManagerAddress);
            let brokerPayment = yield brokerManagerContract.methods
                .getBrokerPayments(userAddress, 0)
                .call({ from: userAddress });
            return { success: true, payment: brokerPayment };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.payBroker = payBroker;
function assignUserToBroker(brokerAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        try {
            yield utils_1.updateNonce(parseInt(adminAccount.nonce) + 1);
            yield sendAdmin(adminAccount.accountId, contract.options.address, contract.methods.addUserToBroker(userAddress, brokerAddress, 0), adminAccount.privateKey, adminAccount.nonce);
            return { success: true };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.assignUserToBroker = assignUserToBroker;
function shouldSignDocument(documentAddress, userAddress, role, userPrivateLey) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContract('SignedDocumentFactory');
        try {
            yield sendInternalAccountRequest(userAddress, contract.options.address, contract.methods.shouldSign(documentAddress, userAddress, toBlockChainString(role)), userPrivateLey);
            return { success: true };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.shouldSignDocument = shouldSignDocument;
function signDocument(documentAddress, userAccountId, userPrivateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContract('SignedDocumentFactory');
        try {
            // console.log('documentAddress ' + documentAddress + 'userAccountId ' + userAccountId + 'userPrivateKey ' + userPrivateKey)
            yield sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.sign(documentAddress), userPrivateKey);
            return { success: true };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.signDocument = signDocument;
function signAdminDocument(documentAddress, adminAccountId, adminPrivateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContract('SignedDocumentFactory');
        let adminAccount = yield utils_1.getAdminAccountId();
        try {
            yield utils_1.updateNonce(parseInt(adminAccount.nonce) + 1);
            yield sendAdmin(adminAccountId, contract.options.address, contract.methods.sign(documentAddress), adminPrivateKey, adminAccount.nonce);
            return { success: true };
        }
        catch (error) {
            // console.log(JSON.stringify(error))
            return { success: false };
        }
    });
}
exports.signAdminDocument = signAdminDocument;
function setUserDisposition(userAddress, dispositionState) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.setUserDispositionState(userAddress, dispositionState), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        return { success: true };
    });
}
exports.setUserDisposition = setUserDisposition;
function setUserFeeStatus(userAddress, feesState) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addFeeManagerRole(adminAccount.accountId), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        let feeManagerContract = yield contract.methods.getFeeManager().call({ from: adminAccount.accountId });
        let feeManager = getDeployedContracts('FeeManager', feeManagerContract);
        yield sendAdminTransaction(adminAccount.accountId, feeManager.options.address, feeManager.methods.setUserFeeStatus(userAddress, feesState, 0), adminAccount.privateKey, parseInt(adminAccount.nonce) + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');
        return { success: true };
    });
}
exports.setUserFeeStatus = setUserFeeStatus;
function clearFees() {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addFeeManagerRole(adminAccount.accountId), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        let feeManagerContract = yield contract.methods.getFeeManager().call({ from: adminAccount.accountId });
        let feeManager = getDeployedContracts('FeeManager', feeManagerContract);
        yield sendAdminTransaction(adminAccount.accountId, feeManager.options.address, feeManager.methods.clearFees(), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');
        return { success: true };
    });
}
exports.clearFees = clearFees;
function getTotalFees() {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addFeeManagerRole(adminAccount.accountId), adminAccount.accountId, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        let feeManagerContract = yield contract.methods.getFeeManager().call({ from: adminAccount.accountId });
        let feeManager = getDeployedContracts('FeeManager', feeManagerContract);
        let totalFees = yield feeManager.methods.getTotalFees().call({ from: adminAccount.accountId });
        return { success: true, totalFees: totalFees };
    });
}
exports.getTotalFees = getTotalFees;
function setUserFeeRatio(buyingFee, sellingFee) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('operation');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addFeeManagerRole(adminAccount.accountId), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
        let feeManagerContract = yield contract.methods.getFeeManager().call({ from: adminAccount.accountId });
        let feeManager = getDeployedContracts('FeeManager', feeManagerContract);
        yield sendAdminTransaction(adminAccount.accountId, feeManager.options.address, feeManager.methods.setFeeRatio(buyingFee, sellingFee, 0), adminAccount.privateKey, parseInt(adminAccount.nonce) + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');
        return { success: true };
    });
}
exports.setUserFeeRatio = setUserFeeRatio;
function projectTradeRequest(buyer, seller, amount, price, adminAccountId, adminPrivateLey, projectAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('trade');
        let cornerSone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerSone.cornerStoneAddress);
        console.log('PROJECT ADDRESS: ' + projectAddress);
        let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
        let balanceBefore = yield contract.methods.balanceOf(buyer).call({ from: buyer });
        console.log('balanceBefore: ' + balanceBefore);
        let sellerBalance = yield stonCoinContract.methods.balanceOf(seller).call({ from: seller });
        let buyerBalance = yield stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
        console.log('BUYYER Stones: ' + buyerBalance);
        console.log('SELLER Stones: ' + sellerBalance);
        console.log('buyer ' +
            buyer +
            ' ' +
            'seller ' +
            seller +
            ' ' +
            'amount ' +
            amount +
            'price ' +
            price +
            ' ' +
            'adminAccountId ' +
            adminAccountId +
            ' ' +
            'projectAddress ' +
            projectAddress);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.trade(projectAddress, buyer, seller, amount, price * MIL, 0), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'trade');
        sellerBalance = yield stonCoinContract.methods.balanceOf(seller).call({ from: seller });
        buyerBalance = yield stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
        console.log('BUYYER Stones: ' + buyerBalance);
        console.log('SELLER Stones: ' + sellerBalance);
        console.log(' END TRADE: ' + buyerBalance);
        return { success: true, balance: buyerBalance };
    });
}
exports.projectTradeRequest = projectTradeRequest;
function addMortgageOperatorRole(userAccountAddress, adminAccountId, adminPrivateLey) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('mortgage');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        // console.log('mortgageAddress :' + mortgageAddress)
        // console.log('marketPriceMills :' + marketPriceMills)
        // console.log('PAYMENT ##### :' + nextPayment)
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.addMortgageOperatorRole(userAccountAddress), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
        let success = true;
        return { success: success };
    });
}
exports.addMortgageOperatorRole = addMortgageOperatorRole;
function payMortgageNextPayment(mortgageAddress, marketPriceMills) {
    return __awaiter(this, void 0, void 0, function* () {
        let cornerStone = yield utils_1.getCornerStone();
        let adminAccount = yield utils_1.getAdminAccount('mortgage');
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
        console.log('mortgageAddress :' + mortgageAddress);
        console.log('marketPriceMills :' + marketPriceMills);
        let nextPayment = yield mortgageContract.methods.getNextPayment().call({ from: adminAccount.accountId });
        let nextPaymentMortgage = yield mortgageContract.methods.getNextPayment().call({ from: adminAccount.accountId });
        let nextPaymentIndex = yield mortgageContract.methods.getNextPaymentIndex().call({ from: adminAccount.accountId });
        let buyer = yield mortgageContract.methods.getBuyer().call({ from: adminAccount.accountId });
        let buyerFunds = yield contract.methods.balanceOf(buyer).call({ from: adminAccount.accountId });
        console.log('PAYMENT ##### :' + nextPayment);
        console.log('PAYMENT ##### :' + nextPaymentMortgage);
        console.log('buyer ##### :' + buyer);
        console.log('buyerFunds ##### :' + buyerFunds);
        console.log('nextPaymentIndex ##### :' + nextPaymentIndex);
        console.log('PAYMENT Request ##### :' + mortgageAddress + ' , ' + marketPriceMills);
        yield sendAdminTransaction(adminAccount.accountId, contract.options.address, contract.methods.mortgagePayment(mortgageAddress, marketPriceMills), adminAccount.privateKey, parseInt(adminAccount.nonce));
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 3, 'mortgage');
        let defaults = yield mortgageContract.methods.getDefaultStatus().call({ from: adminAccount.accountId });
        let getLastPayedIndex = yield mortgageContract.methods.getLastPayedIndex().call({ from: adminAccount.accountId });
        let success = true;
        return { success: success, nextPayment: nextPayment, defaults: defaults, lastPayedIndex: getLastPayedIndex };
    });
}
exports.payMortgageNextPayment = payMortgageNextPayment;
function mortgageRemainingBalance(mortgageAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('Mortgage', mortgageAddress);
        let remainingBalance = yield contract.methods.getRemainingLoanBalance().call({ from: userAddress });
        return remainingBalance;
    });
}
exports.mortgageRemainingBalance = mortgageRemainingBalance;
function getMortgageNextPaymentIndex(mortgageAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('Mortgage', mortgageAddress);
        let nextPaymentIndex = yield contract.methods.getNextPaymentIndex().call({ from: userAddress });
        return nextPaymentIndex;
    });
}
exports.getMortgageNextPaymentIndex = getMortgageNextPaymentIndex;
function mortgageShouldRefinance(mortgageAddress, userAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let contract = getDeployedContracts('Mortgage', mortgageAddress);
        let shouldRefinance = yield contract.methods.shouldRefinance().call({ from: userAddress });
        return shouldRefinance;
    });
}
exports.mortgageShouldRefinance = mortgageShouldRefinance;
function getUserBalance(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
        let balance = yield contract.methods.balanceOf(user).call({ from: user });
        return balance;
    });
}
exports.getUserBalance = getUserBalance;
function projectTradeMortgageRequest(buyer, seller, amount, price, adminAccountId, adminPrivateLey, projectAddress, buyerMortgageAddress, sellerMortgageAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminTrade = yield utils_1.getAdminAccount('trade');
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        console.log('PROJECT ADDRESS: ' + projectAddress);
        let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
        let balanceBefore = yield contract.methods.balanceOf(buyer).call({ from: buyer });
        console.log('balanceBefore: ' + balanceBefore);
        let sellerBalance = yield stonCoinContract.methods.balanceOf(seller).call({ from: seller });
        let buyerBalance = yield stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
        let bidAmount = yield contract.methods.bidAmount(projectAddress, buyer).call({ from: buyer });
        let askAmount = yield contract.methods.askAmount(projectAddress, seller).call({ from: seller });
        let askAmountId = yield contract.methods.askAmount(projectAddress, adminAccountId).call({ from: adminAccountId });
        console.log('BUYYER Stones: ' + buyerBalance);
        console.log('SELLER Stones: ' + sellerBalance);
        console.log('BID Amount: ' + bidAmount);
        console.log('ASK BID INITIAL: ' + seller + ' Ask Amount: ' + askAmount);
        console.log('ASK adminAccountId  BID INITIAL: ' + adminAccountId + ' Ask adminAccountId Amount: ' + askAmountId);
        let key = new Date().getTime();
        console.log('TRADE PART A  ' +
            key +
            ' ' +
            projectAddress +
            ' ' +
            buyer +
            ' ' +
            seller +
            ' ' +
            buyerMortgageAddress +
            ' ' +
            sellerMortgageAddress +
            ' ' +
            amount +
            ' ' +
            price * MIL);
        yield sendAdminTransaction(adminTrade.accountId, contract.options.address, contract.methods.createTradeMortgage(key, projectAddress, buyer, seller, buyerMortgageAddress, sellerMortgageAddress, amount, price * MIL, 0), adminTrade.privateKey, adminTrade.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminTrade.nonce) + 1, 'trade');
        console.log('TRADE DONE');
        // await send(adminAccountId, contract.options.address, contract.methods.tradeMortgaged(key), adminPrivateLey)
        // console.log('TRADE PART B Done')
        let sellerTotalClearances = 0;
        if (sellerMortgageAddress) {
            let mortgageContract = getDeployedContracts('Mortgage', sellerMortgageAddress);
            sellerTotalClearances = yield mortgageContract.methods.getTotalClearances().call({ from: seller });
            console.log('Sellet Clerannces ' + sellerTotalClearances);
        }
        sellerBalance = yield stonCoinContract.methods.balanceOf(seller).call({ from: seller });
        buyerBalance = yield stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
        // console.log('BUYYER Stones: ' + buyerBalance)
        // console.log('SELLER Stones: ' + sellerBalance)
        let balanceAfter = yield contract.methods.balanceOf(buyer).call({ from: buyer });
        // console.log('balanceAfter: ' + balanceAfter)
        return { success: true, balance: balanceAfter, sellerTotalClearances: sellerTotalClearances };
    });
}
exports.projectTradeMortgageRequest = projectTradeMortgageRequest;
function projectAskRequest(userAccountId, stoneCoinAddress, target, limit, signDocument) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccount('bidAsk');
        let nonce = adminAccount.nonce;
        let cornerStone = yield utils_1.getCornerStone();
        let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
        yield sendAdminTransaction(userAccountId, contract.options.address, contract.methods.askCancelAdmin(userAccountId, stoneCoinAddress), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceAdmin(nonce, 'bidAsk');
        yield sendAdminTransaction(userAccountId, contract.options.address, contract.methods.askAdmin(userAccountId, stoneCoinAddress, target, limit * MIL, signDocument || 0), adminAccount.privateKey, nonce);
        nonce = nonce + 1;
        yield utils_1.updateNonceAdmin(nonce, 'bidAsk');
        // await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.askCancel(stoneCoinAddress), userPrivateKey)
        //     await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.ask(stoneCoinAddress, target, limit * MIL, 0), userPrivateKey)
        let askAmount = yield contract.methods.askAmount(stoneCoinAddress, userAccountId).call({ from: userAccountId });
        console.log('askAmount ' + askAmount);
        return { success: true };
    });
}
exports.projectAskRequest = projectAskRequest;
function sendAdmin(adminAccountId, contractAddress, transaction, privateKey, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                try {
                    console.log('Start Transaction ');
                    console.log('adminAccountId ' + adminAccountId);
                    if (!nonce) {
                        nonce = yield web3.eth.getTransactionCount(adminAccountId);
                    }
                    web3.eth.defaultAccount = adminAccountId;
                    // let myBalanceWei = parseInt(web3.eth.getBalance(web3.eth.defaultAccount))
                    // let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
                    // console.log(`Your wallet balance is currently ${myBalance} ETH`.green)
                    console.log('current nonnce ' + nonce);
                    let options = {
                        nonce: nonce,
                        from: adminAccountId,
                        to: contractAddress,
                        data: transaction.encodeABI(),
                        gas: 2000000
                    };
                    console.log(JSON.stringify(options));
                    let signedTransaction = yield web3.eth.accounts.signTransaction(options, privateKey);
                    console.log('transaction signed');
                    let tran = yield web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
                    console.log('Trannsaction result ' + JSON.stringify(tran));
                    resolve(tran);
                }
                catch (error) {
                    console.log('error during transaction');
                    // tryAgain(adminAccountId, contractAddress, transaction, privateKey, nonce -1)
                    console.log(error);
                    reject(error);
                }
            }
            catch (error) {
                console.log('Transaction timed out ');
                reject(error);
            }
        }));
    });
}
exports.sendAdmin = sendAdmin;
function sendNonTransaction(contractName, contractMethod, entity, adminAccountId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                try {
                    console.log('Start Transaction ' + contractMethod);
                    let contract = getDeployedContract(contractName);
                    contract.methods[contractMethod](...Object.values(entity))
                        .send({
                        from: adminAccountId,
                        gas: 2000000
                    })
                        .on('transactionHash', function (hash) {
                        // console.log('START TRANSACTION')
                        // console.log(hash)
                    })
                        .on('receipt', function (receipt) {
                        // console.log(receipt)
                        resolve(receipt);
                    })
                        .on('error', function (error) {
                        console.log('Transaction Failed ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity));
                        console.log(JSON.stringify(error));
                        reject(error);
                    });
                    console.log('end Transaction ' + contractMethod);
                }
                catch (error) {
                    console.log('Transaction Failed ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity));
                    console.log(JSON.stringify(error));
                    reject(error);
                }
            }
            catch (error) {
                console.log('Transaction timed out ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity));
                reject(error);
            }
        });
    });
}
exports.sendNonTransaction = sendNonTransaction;
function sendRequest(accountId, password, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            console.log('0x00000000');
            web3.eth.personal.unlockAccount(accountId, password, '0x00000000').then((result) => {
                console.log('RESULTS ' + result);
                if (result) {
                    console.log('Start Transaction ' + JSON.stringify(options));
                    web3.eth
                        .sendTransaction(options, (error, result) => { })
                        .on('transactionHash', function (hash) { })
                        .on('receipt', function (receipt) { })
                        .on('confirmation', function (confirmationNumber, receipt) { })
                        .on('error', function (error) {
                        console.log('Transaction error ' + JSON.stringify(error));
                        reject(error);
                    })
                        .then(function (receipt) {
                        resolve(receipt);
                    });
                    console.log('end Transaction ');
                }
                else {
                    console.log('Transaction failed ' + accountId + ' ' + ' ' + JSON.stringify(options));
                    let error = 'Unable to unlock account';
                    reject(error);
                }
            });
        });
    });
}
exports.sendRequest = sendRequest;
function sendInternalAccountRequest(accountId, contractAddress, transaction, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let nonce = yield utils_1.getAccountNonce(accountId);
        web3.eth.defaultAccount = accountId;
        // let myBalanceWei = parseInt(web3.eth.getBalance(web3.eth.defaultAccount))
        // let myBalance = web3.utils.fromWei(myBalanceWei, 'ether')
        // console.log(`Your wallet balance is currently ${myBalance} ETH`.green)
        // let nonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount)
        console.log('current user nonce: ' + nonce);
        // let options = {
        //     nonce: parseInt(nonce),
        //     from: accountId,
        //     to: contractAddress,
        //     gasPrice: 1,
        //     gas: 10000000,
        //     data: transaction.encodeABI()
        // }
        yield utils_1.setAccountNonce(accountId, parseInt(nonce) + 1);
        let response = yield sendAdmin(accountId, contractAddress, transaction, password, nonce);
        // let response = await sendRequest(accountId, password, options)
        return response;
    });
}
exports.sendInternalAccountRequest = sendInternalAccountRequest;
function toHexString(n) {
    if (n < 0) {
        n = 0xffffffff + n + 1;
    }
    return '0x' + ('00000000' + n.toString(16).toUpperCase()).substr(-8);
}
function sendAdminTransaction(from, contractAddress, transactionData, privateKey, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`gas limit test `);
        let gas = yield web3.eth.estimateGas({ from: from, to: contractAddress, data: transactionData.encodeABI() });
        console.log(`gas limit ${gas}`);
        let details = {
            nonce: toHexString(nonce),
            from: from,
            to: contractAddress,
            gasLimit: toHexString(gas),
            data: transactionData.encodeABI()
        };
        console.log(JSON.stringify(details));
        const transaction = new EthereumTx(details);
        console.log('trasnnaction created');
        yield transaction.sign(Buffer.from(privateKey, 'hex'));
        console.log('transaction signed');
        const serializedTransaction = transaction.serialize();
        yield web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'));
    });
}
exports.sendAdminTransaction = sendAdminTransaction;
function sendAdminTransactionWithGas(adminAccountId, contractAddress, transaction, privateKey, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        web3.eth.defaultAccount = adminAccountId;
        let currentNonce = yield web3.eth.getTransactionCount(web3.eth.defaultAccount);
        // let gas = await web3.eth.estimateGas({from: adminAccountId, to: contractAddress, data: transaction.encodeABI()})
        console.log('current nonce : ' + currentNonce);
        console.log('gas limit: ' + 6000);
        console.log('given nonce ' + nonce);
        let options = {
            nonce: nonce,
            from: adminAccountId,
            to: contractAddress,
            data: transaction.encodeABI(),
            gasLimit: toHexString(600000)
            // gas: 3000000
        };
        let signedTransaction = yield web3.eth.accounts.signTransaction(options, privateKey);
        let tran = yield web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        return tran;
    });
}
exports.sendAdminTransactionWithGas = sendAdminTransactionWithGas;
function send(adminAccountId, contractAddress, transaction, privateKey, nonce) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CHEKING GAS ');
        let gas = yield web3.eth.estimateGas({ from: adminAccountId, to: contractAddress, data: transaction.encodeABI() });
        console.log('gas limit: ' + gas);
        console.log('given nonce ' + nonce);
        let options = {
            nonce: nonce,
            from: adminAccountId,
            to: contractAddress,
            data: transaction.encodeABI(),
            gasLimit: toHexString(gas)
            // gas: 3000000
        };
        let signedTransaction = yield web3.eth.accounts.signTransaction(options, privateKey);
        let tran = yield web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        return tran;
    });
}
exports.send = send;
function toBlockChainString(string) {
    let asci = web3.utils.fromAscii(string);
    return asci.substring(0, 28);
}
exports.toBlockChainString = toBlockChainString;
function getDeployedContract(name) {
    return getDeployedContracts(name, 0);
}
function getContractByName(name) {
    switch (name) {
        case 'MortgageRequest':
            return MortgageRequest_json_1.default;
        case 'AssetManager':
            return AssetManager_json_1.default;
        case 'StoneCoinStorage':
            return StoneCoinStorage_json_1.default;
        case 'StoneCoinMortgage':
            return StoneCoinMortgage_json_1.default;
        case 'StoneCoinMortgageStorage':
            return StoneCoinMortgageStorage_json_1.default;
        case 'Estimation':
            return Estimation_json_1.default;
        case 'Terms':
            return Terms_json_1.default;
        case 'Property':
            return Property_json_1.default;
        case 'Manager':
            return Manager_json_1.default;
        case 'Project':
            return Project_json_1.default;
        case 'StoneCoin':
            return StoneCoin_json_1.default;
        case 'Registrar':
            return Registrar_json_1.default;
        case 'Trustee':
            return Trustee_json_1.default;
    }
    return null;
}
exports.getContractByName = getContractByName;
function getDeployedContracts(name, contractAddress) {
    let abi = null;
    let address = null;
    switch (name) {
        case 'CornerStone':
            abi = CornerStone_json_1.default.abi;
            address = contractAddress;
            break;
        case 'CornerStoneBase':
            abi = CornerStoneBase_json_1.default.abi;
            address = contractAddress;
            break;
        case 'MortgageOperations':
            abi = MortgageOperations_json_1.default.abi;
            address = contractAddress;
            break;
        case 'CornerStoneBaseStorage':
            abi = CornerStoneBaseStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'MortgageStoneStorage':
            abi = MortgageStoneStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'ProjectGroupsStorage':
            abi = ProjectGroupsStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'Disposition':
            abi = Disposition_json_1.default.abi;
            address = contractAddress;
            break;
        case 'TradesHistory':
            abi = TradesHistory_json_1.default.abi;
            address = contractAddress;
            break;
        case 'ProjectGroups':
            abi = ProjectGroups_json_1.default.abi;
            address = contractAddress;
            break;
        case 'ProjectGroupsVotingStorage':
            abi = ProjectGroupsVotingStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'StoneCoinMortgage':
            abi = StoneCoinMortgage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'MortgageStone':
            abi = MortgageStone_json_1.default.abi;
            address = contractAddress;
            break;
        case 'StoneCoinStorage':
            abi = StoneCoinStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'StoneCoinMortgageStorage':
            abi = StoneCoinMortgageStorage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'CornerTransaction':
            abi = CornerTransaction_json_1.default.abi;
            address = contractAddress;
            break;
        case 'MortgageRequest':
            abi = MortgageRequest_json_1.default.abi;
            address = contractAddress;
            break;
        case 'SignedDocumentFactory':
            abi = SignedDocumentFactory_json_1.default.abi;
            address = getContractAddress(SignedDocumentFactory_json_1.default.networks);
            break;
        case 'StoneCoin':
            abi = StoneCoin_json_1.default.abi;
            address = contractAddress;
            break;
        case 'BrokerManager':
            abi = BrokerManager_json_1.default.abi;
            address = contractAddress;
            break;
        case 'Estimation':
            abi = Estimation_json_1.default.abi;
            address = getContractAddress(Estimation_json_1.default.networks);
            break;
        case 'MortgageFactory':
            abi = MortgageFactory_json_1.default.abi;
            address = contractAddress;
            break;
        case 'MortgageRequestFactory':
            abi = MortgageRequestFactory_json_1.default.abi;
            address = contractAddress;
            break;
        case 'OrganizationFactory':
            abi = OrganizationFactory_json_1.default.abi;
            address = getContractAddress(OrganizationFactory_json_1.default.networks);
            break;
        case 'AssetManager':
            abi = AssetManager_json_1.default.abi;
            address = contractAddress;
            break;
        case 'Mortgage':
            abi = Mortgage_json_1.default.abi;
            address = contractAddress;
            break;
        case 'FeeManager':
            abi = FeeManager_json_1.default.abi;
            address = contractAddress;
            break;
        case 'AssetFactory':
            abi = AssetFactory_json_1.default.abi;
            address = getContractAddress(AssetFactory_json_1.default.networks);
            break;
    }
    if (abi === null) {
        return null;
    }
    // console.log('CONTRACT ADDRESS: ' + address)
    return new web3.eth.Contract(abi, address);
}
exports.getDeployedContracts = getDeployedContracts;
function asyncForEach(array, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < array.length; index++) {
            yield callback(array[index], index, array);
        }
    });
}
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('CREATI Wallet ');
        let newAdmin = yield web3.eth.accounts.create();
        console.log(`return account ${newAdmin}`);
        console.log(`return account ${JSON.stringify(newAdmin)}`);
        return newAdmin;
    });
}
exports.createAdmin = createAdmin;
function replaceAdmin(replaceAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccountId();
        let newAdmin = yield web3.eth.accounts.create();
        console.log(`new admin ${newAdmin.address}`);
        let oldAdmin = yield utils_1.getAdminAccount(replaceAdmin);
        let contractAddresses = yield utils_1.getCornerStone();
        console.log(`cornerStone address ${contractAddresses.cornerStoneAddress}`);
        let cornerStone = getDeployedContracts('CornerStone', contractAddresses.cornerStoneAddress);
        console.log(`cornerStone deployed address ${cornerStone.options.address}`);
        console.log('add role to new admin');
        yield send(adminAccount.accountId, cornerStone.options.address, cornerStone.methods.addOwnership(newAdmin.address), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
        console.log(`remove role from old admin ${oldAdmin.accountId}`);
        yield send(adminAccount.accountId, cornerStone.options.address, cornerStone.methods.removeOwnership(oldAdmin.accountId), adminAccount.privateKey, adminAccount.nonce + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'init');
        if (replaceAdmin === 'project' || replaceAdmin === 'init') {
            let projects = yield utils_1.getProjects();
            yield asyncForEach(projects, (projectAddress) => __awaiter(this, void 0, void 0, function* () {
                yield replaceProjectAdmin(projectAddress, newAdmin, oldAdmin);
            }));
        }
        console.log('role added');
        return newAdmin;
    });
}
exports.replaceAdmin = replaceAdmin;
function replaceProjectAdmin(projectAddress, newAdmin, oldAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        let adminAccount = yield utils_1.getAdminAccountId();
        console.log(`new admin ${newAdmin.address}`);
        let stoneCoin = yield getDeployedContracts('StoneCoin', projectAddress);
        console.log(`add project address ${projectAddress} owner role to ${newAdmin.address}`);
        yield send(adminAccount.accountId, stoneCoin.options.address, stoneCoin.methods.addOwnership(newAdmin.address), adminAccount.privateKey, adminAccount.nonce);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
        console.log(`remove project address ${projectAddress} owner role to ${oldAdmin.accountId}`);
        yield send(adminAccount.accountId, stoneCoin.options.address, stoneCoin.methods.removeOwnership(oldAdmin.accountId), adminAccount.privateKey, adminAccount.nonce + 1);
        yield utils_1.updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'init');
    });
}
//# sourceMappingURL=wallet.js.map