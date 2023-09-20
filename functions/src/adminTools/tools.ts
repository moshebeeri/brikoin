const functions = require('firebase-functions');
const admin = require('firebase-admin');
import CornerStone from '../operations/contractsLatest/CornerStone.json';
import Disposition from '../operations/contractsLatest/Disposition.json';
import MortgageStone from '../operations/contractsLatest/MortgageStone.json';
import MortgageStoneStorage from '../operations/contractsLatest/MortgageStoneStorage.json';
import CornerStoneBase from '../operations/contractsLatest/CornerStoneBase.json';
import CornerStoneBaseStorage from '../operations/contractsLatest/CornerStoneBaseStorage.json';
import BrokerManager from '../operations/contractsLatest/BrokerManager.json';
import MortgageFactory from '../operations/contractsLatest/MortgageFactory.json';
import MortgageRequestFactory from '../operations/contractsLatest/MortgageRequestFactory.json';
import CornerTransaction from '../operations/contractsLatest/CornerTransaction.json';
import MortgageOperations from '../operations/contractsLatest/MortgageOperations.json';
import TradesHistory from '../operations/contractsLatest/TradesHistory.json';

import FeeManager from '../operations/contractsLatest/FeeManager.json';
import { getActiveRequest, getConfiguration, updateNonceAdmin } from '../operations/utils';
import { createAdmin, deployNewContractWithParams, getDeployedContracts, send } from '../operations/wallet';
const runtimeOpts = {
	timeoutSeconds: 450
};

exports.createNewContracts = functions
	.runWith(runtimeOpts)
	.database.ref(`server/operations/events/createNewContractsTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let request = <any>await getActiveRequest('createNewContracts');
		let configuration = <any>await getConfiguration();
		console.log('STRATING INIT');
		if (request && request.key && configuration.resetSystem) {
			//create Operations Admins
			let initAdmin = <any>await createNewAdmin('init');
			console.log(`creating init admin ${JSON.stringify(initAdmin)}`);
			let mortgageAdmin = <any>await createNewAdmin('mortgage');
			let bidAskAdmin = <any>await createNewAdmin('bidAsk');
			let operationAdmin = <any>await createNewAdmin('operation');
			let projectAdmin = <any>await createNewAdmin('project');
			let tradeAdmin = <any>await createNewAdmin('trade');
			let response = <any>await initContracts(initAdmin.address, initAdmin.privateKey, 0);
			await updateNonceAdmin(response.nonce, 'init');
			await initRoles(
				response.cornerStoneAddress,
				response.nonce,
				initAdmin,
				bidAskAdmin,
				mortgageAdmin,
				operationAdmin,
				projectAdmin,
				tradeAdmin
			);
			db
				.ref('server')
				.child('operations')
				.child('events')
				.child('createNewContracts')
				.child(request.key)
				.update({ active: false });
		}
	});

async function createNewAdmin(adminUser) {
	let db = admin.database();
	let createdAdmin = <any>await createAdmin();
	console.log(`new adminCreated ${JSON.stringify(createdAdmin)}`);
	db.ref('server').child('admins').child(adminUser).set({
		accountId: createdAdmin.address,
		privateKey: createdAdmin.privateKey,
		nonce: 0,
		nonceDeploy: 0
	});
	return createdAdmin;
}

async function updateNewContractAddress(contract, contractAddress) {
	let db = admin.database();
	let contractJson = {};
	contractJson[contract] = contractAddress;
	db.ref('server').child('admins').child('controlContracts').update(contractJson);
}

async function initContracts(adminAccount, adminPrivateKey, nonce) {
	console.log('STRATING');
	// let nonce = 100
	console.log('adminAccount ' + adminAccount);

	let mortgageRequestFactoryAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		MortgageRequestFactory,
		'',
		nonce
	);
	nonce = nonce + 1;
	console.log('mortgageRequestFactoryAddress ' + mortgageRequestFactoryAddress);
	let mortgageFactoryAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		MortgageFactory,
		'',
		nonce
	);
	nonce = nonce + 1;
	console.log('mortgageFactoryAddress ' + mortgageFactoryAddress);

	let cornerStoneAddress = await deployNewContractWithParams(adminAccount, adminPrivateKey, CornerStone, '', nonce);
	nonce = nonce + 1;
	let cornerStone = await getDeployedContracts('CornerStone', cornerStoneAddress);
	console.log('cornerStoneAddress ' + cornerStoneAddress);
	updateNewContractAddress('cornerStoneAddress', cornerStoneAddress);

	let dispositionAddress = await deployNewContractWithParams(adminAccount, adminPrivateKey, Disposition, '', nonce);
	nonce = nonce + 1;
	let disposition = await getDeployedContracts('Disposition', dispositionAddress);
	console.log('ADD DISPOSITION CONTRACT');
	await send(
		adminAccount,
		disposition.options.address,
		disposition.methods.addOwnership(cornerStoneAddress),
		adminPrivateKey,
		nonce
	);
	console.log('disposition ');
	nonce = nonce + 1;
	await send(
		adminAccount,
		cornerStone.options.address,
		cornerStone.methods.setDispositionAddress(dispositionAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	// let tokenApproveFactory = this.deployNewContract(adminAccount, adminPrivateKey, TokenApproveFactory)
	let cornerStoneBaseStorageAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		CornerStoneBaseStorage,
		'',
		nonce
	);
	console.log('cornerStoneBaseStorageAddress ');
	nonce = nonce + 1;
	let cornerBaseAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		CornerStoneBase,
		'',
		nonce
	);
	console.log('cornerBaseAddress ');
	let cornerStoneBase = await getDeployedContracts('CornerStoneBase', cornerBaseAddress);
	nonce = nonce + 1;
	let cornerStoneBaseStorage = await getDeployedContracts('CornerStoneBaseStorage', cornerStoneBaseStorageAddress);
	console.log('cornerStoneBaseStorageAddress ' + cornerStoneBaseStorageAddress);
	updateNewContractAddress('cornerStoneBaseStorageAddress', cornerStoneBaseStorageAddress);

	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.setCornerStoneBaseStorage(cornerStoneBaseStorageAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;

	console.log('cornerBaseAddress ' + cornerBaseAddress);
	updateNewContractAddress('cornerBaseAddress', cornerBaseAddress);

	await send(
		adminAccount,
		cornerStoneBaseStorage.options.address,
		cornerStoneBaseStorage.methods.addOwnership(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(adminAccount, cornerStoneBase.options.address, cornerStoneBase.methods.init(), adminPrivateKey, nonce);
	nonce = nonce + 1;
	let mortgageStoneAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		MortgageStone,
		'',
		nonce
	);
	nonce = nonce + 1;
	let mortgageStoneStorageAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		MortgageStoneStorage,
		'',
		nonce
	);
	nonce = nonce + 1;
	let mortgageStoneStorage = await getDeployedContracts('MortgageStoneStorage', mortgageStoneStorageAddress);
	let mortgageStone = await getDeployedContracts('MortgageStone', mortgageStoneAddress);
	console.log('mortgageStoneStorageAddress ' + mortgageStoneStorageAddress);
	updateNewContractAddress('mortgageStoneStorageAddress', mortgageStoneStorageAddress);

	console.log('mortgageStoneAddress ' + mortgageStoneAddress);
	updateNewContractAddress('mortgageStoneAddress', mortgageStoneAddress);

	await send(
		adminAccount,
		mortgageStoneStorage.options.address,
		mortgageStoneStorage.methods.addOwnership(mortgageStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		mortgageStoneStorage.options.address,
		mortgageStoneStorage.methods.addOwnership(cornerStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		mortgageStone.options.address,
		mortgageStone.methods.setStorageAddress(mortgageStoneStorageAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	let mortgageOperationAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		MortgageOperations,
		'',
		nonce
	);
	let mortgageOperation = await getDeployedContracts('MortgageOperations', mortgageOperationAddress);

	nonce = nonce + 1;
	await send(
		adminAccount,
		mortgageOperation.options.address,
		mortgageOperation.methods.addOwnership(mortgageStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.addOwnership(mortgageStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.addOwnership(cornerStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('mortgageOperationAddress ' + mortgageOperationAddress);
	updateNewContractAddress('mortgageOperationAddress', mortgageOperationAddress);

	await send(
		adminAccount,
		mortgageStone.options.address,
		mortgageStone.methods.setStoneBaseAddress(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		mortgageStone.options.address,
		mortgageStone.methods.addOwnership(cornerStoneAddress),
		adminPrivateKey,
		nonce
	);

	nonce = nonce + 1;
	await send(
		adminAccount,
		mortgageStone.options.address,
		mortgageStone.methods.setMortgageOperationAddress(mortgageOperationAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		cornerStone.options.address,
		cornerStone.methods.setBaseStoneAddress(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	await send(
		adminAccount,
		cornerStone.options.address,
		cornerStone.methods.setMortgageStoneAddress(mortgageStoneAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	let brokerManagerAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		BrokerManager,
		'',
		nonce
	);
	nonce = nonce + 1;
	let brokerManager = await getDeployedContracts('BrokerManager', brokerManagerAddress);

	await send(
		adminAccount,
		brokerManager.options.address,
		brokerManager.methods.addOwnership(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('brokerManagerAddress ' + brokerManagerAddress);
	updateNewContractAddress('brokerManagerAddress', brokerManagerAddress);

	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.setNewBrokerManager(brokerManagerAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	let feeManagerAddress = await deployNewContractWithParams(adminAccount, adminPrivateKey, FeeManager, '', nonce);
	nonce = nonce + 1;
	let feeManager = await getDeployedContracts('FeeManager', feeManagerAddress);
	await send(
		adminAccount,
		feeManager.options.address,
		feeManager.methods.addOwnership(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;

	console.log('feeManagerAddress ' + feeManagerAddress);
	updateNewContractAddress('feeManagerAddress', feeManagerAddress);

	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.setNewFeeManager(feeManagerAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	let tradeHistoryAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		TradesHistory,
		'',
		nonce
	);
	let tradeHistory = await getDeployedContracts('TradesHistory', tradeHistoryAddress);

	nonce = nonce + 1;
	await send(
		adminAccount,
		tradeHistory.options.address,
		tradeHistory.methods.addOwnership(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('tradeHistoryAddress ' + tradeHistoryAddress);
	updateNewContractAddress('tradeHistoryAddress', tradeHistoryAddress);

	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.setNewTraderHistory(tradeHistoryAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	let cornerTransactionAddress = await deployNewContractWithParams(
		adminAccount,
		adminPrivateKey,
		CornerTransaction,
		'',
		nonce
	);
	nonce = nonce + 1;
	let cornerTransaction = await getDeployedContracts('CornerTransaction', cornerTransactionAddress);

	await send(
		adminAccount,
		cornerTransaction.options.address,
		cornerTransaction.methods.addOwnership(cornerBaseAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('cornerTransactionAddress ' + cornerTransactionAddress);
	updateNewContractAddress('cornerTransactionAddress', cornerTransactionAddress);

	await send(
		adminAccount,
		cornerStoneBase.options.address,
		cornerStoneBase.methods.setNewCornerTransaction(cornerTransactionAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log(nonce);
	console.log('finish init');
	return { nonce: nonce, cornerStoneAddress: cornerStoneAddress };
}

async function addContractRole(adminAccount, adminPrivateKey, nonce, cornerStoneAddress, ownerAddress) {
	let contract = await getDeployedContracts('CornerStone', cornerStoneAddress);
	console.log('ownerAddress ' + ownerAddress);
	await send(
		adminAccount,
		contract.options.address,
		contract.methods.addOwnership(ownerAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;

	return nonce;
}
async function addMorttgagetRole(adminAccount, adminPrivateKey, nonce, cornerStoneAddress, ownerAddress) {
	let contract = await getDeployedContracts('CornerStone', cornerStoneAddress);

	await send(
		adminAccount,
		contract.options.address,
		contract.methods.addMortgageOperatorRole(ownerAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;

	await send(
		adminAccount,
		contract.options.address,
		contract.methods.addMortgageFinanceRole(ownerAddress),
		adminPrivateKey,
		nonce
	);
	nonce = nonce + 1;
	return nonce;
}

async function initRoles(cornerStone, adminNonce, adminAccount, bidAsk, mortgage, operation, project, trade) {
	let nonce = await addContractRole(
		adminAccount.address,
		adminAccount.privateKey,
		adminNonce,
		cornerStone,
		bidAsk.address
	);
	await updateNonceAdmin(nonce, 'init');
	nonce = await addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, mortgage.address);
	await updateNonceAdmin(nonce, 'init');
	nonce = await addMorttgagetRole(
		adminAccount.address,
		adminAccount.privateKey,
		nonce,
		cornerStone,
		mortgage.address
	);
	await updateNonceAdmin(nonce, 'init');
	nonce = await addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, operation.address);
	await updateNonceAdmin(nonce, 'init');

	nonce = await addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, project.address);
	await updateNonceAdmin(nonce, 'init');

	nonce = await addContractRole(adminAccount.address, adminAccount.privateKey, nonce, cornerStone, trade.address);
	await updateNonceAdmin(nonce, 'init');
}
