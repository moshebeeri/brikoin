import CornerStone from './contractsLatest/CornerStone.json';
import SignedDocumentFactory from './contractsLatest/SignedDocumentFactory.json';
import OrganizationFactory from './contractsLatest/OrganizationFactory.json';
import Organization from './contractsLatest/Organization.json';
import Estimation from './contractsLatest/Estimation.json';
import BrokerManager from './contractsLatest/BrokerManager.json';
import Terms from './contractsLatest/Terms.json';
import Property from './contractsLatest/Property.json';
import Manager from './contractsLatest/Manager.json';
import SignedDocument from './contractsLatest/SignedDocument.json';
import Mortgage from './contractsLatest/Mortgage.json';
import Disposition from '../operations/contractsLatest/Disposition.json';
import Project from './contractsLatest/Project.json';
import StoneCoinStorage from './contractsLatest/StoneCoinStorage.json';
import Registrar from './contractsLatest/Registrar.json';
import Trustee from './contractsLatest/Trustee.json';
import CornerStoneBase from './contractsLatest/CornerStoneBase.json';
import CornerStoneBaseStorage from './contractsLatest/CornerStoneBaseStorage.json';
import StoneCoin from './contractsLatest/StoneCoin.json';
import ProjectGroups from './contractsLatest/ProjectGroups.json';
import ProjectGroupsStorage from './contractsLatest/ProjectGroupsStorage.json';
import ProjectGroupsVotingStorage from './contractsLatest/ProjectGroupsVotingStorage.json';
import StoneCoinMortgageStorage from './contractsLatest/StoneCoinMortgageStorage.json';
import MortgageFactory from './contractsLatest/MortgageFactory.json';
import MortgageRequestFactory from './contractsLatest/MortgageRequestFactory.json';
import MortgageRequest from './contractsLatest/MortgageRequest.json';
import StoneCoinMortgage from './contractsLatest/StoneCoinMortgage.json';
import CornerTransaction from './contractsLatest/CornerTransaction.json';
import MortgageStoneStorage from './contractsLatest/MortgageStoneStorage.json';
import MortgageStone from './contractsLatest/MortgageStone.json';
import AssetManager from './contractsLatest/AssetManager.json';
import AssetFactory from './contractsLatest/AssetFactory.json';
import TradesHistory from './contractsLatest/TradesHistory.json';
import MortgageOperations from './contractsLatest/MortgageOperations.json';

import FeeManager from './contractsLatest/FeeManager.json';
import {
	getConfiguration,
	getAccountNonce,
	getAdminAccount,
	getAdminAccountId,
	getCornerStone,
	getGroup,
	getProjects,
	getUserActiveAccount,
	getUserNonce,
	setAccountNonce,
	updateNonce,
	updateNonceAdmin,
	updateNonceDeployAdmin,
	updateNonceUser
} from './utils';
// const utils = ethers.utils
const ethers = require('ethers');
const Web3 = require('web3');
const web3 = new Web3(
	new Web3.providers.HttpProvider('https://brikoin.blockchain.azure.com:3200/dGKjxI0_quzj101eJEB6f3tX')
);
const EthereumTx = require('ethereumjs-tx');
// const HDWalletProvider = require('truffle-hdwallet-provider')
//
// const rpcEndpoint = 'http://ethoncwg4-dns-reg1.eastus.cloudapp.azure.com:8540'
// const mnemonic = 'liar tragic valid cable ready thrive symbol bag mansion suggest envelope kiss'
// const web3 = new Web3(new Web3.providers.HttpProvider('http://ethoncwg4-dns-reg1.eastus.cloudapp.azure.com:8540'))
//const web3 = new Web3(new Web3.providers.HttpProvider('http://104.155.20.229:8400'))
const MIL = 1000000;

export async function createAccount() {
	console.log('create account');
	let account = await web3.eth.accounts.create();
	// console.log('accountPrivateKey ' + JSON.stringify(accountPrivateKey))
	// let account = await web3.eth.personal.newAccount(accountPrivateKey.privateKey)
	await setAccountNonce(account.address, 0);
	return { address: account.address, privateKey: account.privateKey };
}

export async function transferEtherFromAdmin(userAccount) {
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
}

function transferEther(privateKey, address, amount) {
	return new Promise((resolve, reject) => {
		const wallet = new ethers.Wallet(privateKey);
		// We must pass in the amount as wei (1 ether = 1e18 wei), so we use
		// this convenience function to convert ether to wei.
		const etherAmount = ethers.parseEther(amount);
		const sendPromise = wallet.send(address, etherAmount);

		sendPromise
			.then(function(transactionHash) {
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

export async function depositCoins(userAccountId, amount) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerContract = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
	console.log('Start deposit');

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.deposit(userAccountId, amount * MIL),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(adminAccount.nonce + 1, 'operation');
	console.log(' deposit done');

	let balance = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	return balance;
}

export async function depositCoinsProject(userAccountId, amount, projectAddress) {
	let adminAccount = <any>await getAdminAccount('trade');
	let cornerContract = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
	console.log('Start deposit');

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.depositProject(userAccountId, amount * MIL, projectAddress),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(adminAccount.nonce + 1, 'trade');
	console.log(' deposit done');

	let balance = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	return balance;
}

export async function withdrawCoins(userAccountId, amount, projectAddress) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerContract = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
	console.log('Start deposit');

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.withdraw(userAccountId, amount * MIL),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.withdrawApprove(userAccountId, amount * MIL, projectAddress),
		adminAccount.privateKey,
		parseInt(adminAccount.nonce) + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce + 2), 'operation');
	console.log(' withdraw done');

	let balance = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	return balance;
}

export async function payIncome(projectAddress, payIncome) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerContract = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerContract.cornerStoneAddress);
	console.log('pay yield');
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.payIncome(projectAddress, payIncome * MIL),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(adminAccount.nonce + 1, 'operation');
}

export async function createProjectInitialAsk(adminAccount, stoneCoinAddress, target) {
	let contracts = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', contracts.cornerStoneAddress);
	console.log('current nonce: ' + adminAccount.nonce);
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.initialAskAdmin(adminAccount.accountId, stoneCoinAddress, target),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(adminAccount.nonce + 1, 'project');
}

export async function projectCancelOrder(userAccountId, userPrivateKey, stoneCoinAddress) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('bidAsk');

	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.askCancelAdmin(userAccountId, stoneCoinAddress),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'bidAsk');

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress),
		adminAccount.privateKey,
		parseInt(adminAccount.nonce) + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'bidAsk');

	return { success: true };
}

export async function getUserTransactions(userAccountId, startingIndex) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');

	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.setTransactionManager(adminAccount.accountId),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	let transactionManagerAddress = await contract.methods
		.getTransactionManager()
		.call({ from: adminAccount.accountId });
	console.log('transactionManagerAddress ' + transactionManagerAddress);
	let cornerTransaction = getDeployedContracts('CornerTransaction', transactionManagerAddress);

	let userTransactionsLength = await cornerTransaction.methods
		.getTransactionsLength(userAccountId)
		.call({ from: adminAccount.accountId });
	console.log('userTransactionsLength ' + userTransactionsLength);

	let transactions = [];
	for (let i = startingIndex; i < userTransactionsLength; i++) {
		let transaction = <any>{};
		transaction.time = await cornerTransaction.methods
			.getTransactionsTime(userAccountId, i)
			.call({ from: adminAccount.accountId });
		transaction.amount = await cornerTransaction.methods
			.getTransaction(userAccountId, i)
			.call({ from: adminAccount.accountId });
		transaction.projectAddress = await cornerTransaction.methods
			.getTransactionsStoneCoin(userAccountId, i)
			.call({ from: adminAccount.accountId });
		transaction.isAdd = await cornerTransaction.methods
			.isAddTransaction(userAccountId, i)
			.call({ from: adminAccount.accountId });
		transaction.description = await cornerTransaction.methods
			.getTransactionDescription(userAccountId, i)
			.call({ from: adminAccount.accountId });
		console.log('transaction ' + transaction);

		transactions.push(transaction);
	}

	return transactions;
}

export async function projectBidRequest(userAccountId, stoneCoinAddress, target, limit, signDocument) {
	let adminAccount = <any>await getAdminAccount('bidAsk');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	console.log(
		'userAccountId ' +
			userAccountId +
			' stoneCoinAddress ' +
			stoneCoinAddress +
			' target ' +
			target +
			' limit ' +
			limit
	);
	let nonce = adminAccount.nonce;
	// await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceAdmin(nonce, 'bidAsk');
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.bidAdmin(userAccountId, stoneCoinAddress, target, limit * MIL, signDocument || 0),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceAdmin(nonce, 'bidAsk');

	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });

	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter };
}

export async function cancelBidReqeust(userAccountId, stoneCoinAddress) {
	let adminAccount = <any>await getAdminAccount('bidAsk');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	let nonce = adminAccount.nonce;
	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.bidCancelAdmin(userAccountId, stoneCoinAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceAdmin(nonce, 'bidAsk');

	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });

	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter };
}

export async function getProjectReservedPrice(stoneCoinAddress, userAccountId) {
	let contract = getDeployedContracts('StoneCoin', stoneCoinAddress);
	let reservedPrice = await contract.methods.getReservedPrice().call({ from: userAccountId });
	return reservedPrice / MIL;
}

export async function setProjectReserved(adminAccount, adminPrivateKey, nonce, stoneCoinAddress, reservedPrice) {
	let contract = getDeployedContracts('StoneCoin', stoneCoinAddress);
	console.log('SET Project Reserved');
	await sendAdminTransaction(
		adminAccount,
		contract.options.address,
		contract.methods.setReservedPrice(reservedPrice),
		adminPrivateKey,
		nonce
	);
}

export async function projectBidReserve(userAccountId, userPrivateKey, stoneCoinAddress) {
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	console.log('userAccountId ' + userAccountId + ' stoneCoinAddress ' + stoneCoinAddress);
	let userNonce = <any>await getUserNonce(userAccountId);
	let privateKey = userPrivateKey.substring(2);
	let nonce = userNonce ? userNonce.nonce : 0;
	await transferEtherFromAdmin(userAccountId);
	// await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
	await sendAdminTransaction(
		userAccountId,
		contract.options.address,
		contract.methods.cancelReserveBid(stoneCoinAddress),
		privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceUser(nonce, userAccountId);
	await sendAdminTransaction(
		userAccountId,
		contract.options.address,
		contract.methods.reservedBid(stoneCoinAddress),
		privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceUser(nonce, userAccountId);
	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });

	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter };
}

export async function cancelProjectBidReserve(userAccountId, userPrivateKey, stoneCoinAddress) {
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	console.log('userAccountId ' + userAccountId + ' stoneCoinAddress ' + stoneCoinAddress);
	let userNonce = <any>await getUserNonce(userAccountId);
	let privateKey = userPrivateKey.substring(2);
	let nonce = userNonce ? userNonce.nonce : 0;
	await transferEtherFromAdmin(userAccountId);
	// await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.bidCancel(stoneCoinAddress), userPrivateKey)
	await sendAdminTransaction(
		userAccountId,
		contract.options.address,
		contract.methods.cancelReserveBid(stoneCoinAddress),
		privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceUser(nonce, userAccountId);
	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });

	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter };
}

export async function projectBidMortgageRequest(
	userAccountId,
	userPrivateKey,
	request,
	adminAccountId,
	adminPrivatekey,
	signDocument
) {
	let adminAccount = <any>await getCornerStone();
	let bidAccount = <any>await getAdminAccount('bidAsk');
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
		await sendAdminTransaction(
			bidAccount.accountId,
			contract.options.address,
			contract.methods.bidMortgagedAdmin(
				userAccountId,
				request.mortgageRequestAddress,
				request.projectId,
				Number(request.downPayment) * MIL,
				request.size,
				limit,
				signDocument || 0
			),
			bidAccount.privateKey,
			bidAccount.nonce
		);
		await updateNonceAdmin(parseInt(bidAccount.nonce + 1), 'bidAsk');

		console.log('DONE BID TRANSACTION');
		return { success: true };
	} catch (error) {
		console.log(JSON.stringify(error));
		console.log('FAILED');
		return { success: false };
	}
}

export async function projectAskMortgageRequest(userAccountId, userPrivateKey, tradeRequest, signDocument) {
	let adminAccount = <any>await getCornerStone();
	let bidAsk = <any>await getAdminAccount('bidAsk');
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	console.log('ASK AMOUNT REQUEST: ' + tradeRequest.size);
	let askAmount = await contract.methods
		.askAmount(tradeRequest.projectId, userAccountId)
		.call({ from: userAccountId });
	console.log('ASK AMOUNT BEFORE ' + askAmount);
	console.log('ASK TRADE REQUEST ' + JSON.stringify(tradeRequest));
	await sendAdminTransaction(
		bidAsk.accountId,
		contract.options.address,
		contract.methods.askCancel(tradeRequest.projectId),
		bidAsk.privateKey,
		bidAsk.nonce
	);
	await updateNonceAdmin(parseInt(bidAsk.nonce) + 1, 'bidAsk');

	await sendAdminTransaction(
		bidAsk.accountId,
		contract.options.address,
		contract.methods.askMortgagedAdmin(
			userAccountId,
			tradeRequest.mortgageAddress,
			tradeRequest.projectId,
			tradeRequest.size,
			tradeRequest.price * MIL,
			signDocument || 0
		),
		bidAsk.privateKey,
		parseInt(bidAsk.nonce) + 1
	);
	await updateNonceAdmin(parseInt(bidAsk.nonce) + 2, 'bidAsk');

	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	askAmount = await contract.methods.askAmount(tradeRequest.projectId, userAccountId).call({ from: userAccountId });
	console.log('ASK AMOUNT AFTER  ' + askAmount);
	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter, askAmount: askAmount };
}

export async function addProjectDocument(assetManagerAddress, role, documentMd5) {
	let contract = getDeployedContracts('AssetManager', assetManagerAddress);
	let adminAccount = <any>await getAdminAccount('init');
	console.log(`adding new document to ${assetManagerAddress} role : ${role} documentMd5 : ${documentMd5}`);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addProjectDocument(role, 'test'),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
	console.log('adding new document done ');
	return true;
}

export async function addProjectRole(assetManagerAddress, role, user) {
	let userAccount = <any>await getUserActiveAccount(user);
	let contract = getDeployedContracts('AssetManager', assetManagerAddress);
	let adminAccount = <any>await getAdminAccount('init');
	console.log(`adding user role ${assetManagerAddress} role : ${role} user : ${userAccount.accountId}`);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addProjectOfficial(role, userAccount.accountId),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
	// console.log(`adding user role ${assetManagerAddress} role : ${role} user : ${userAccount.accountId}`)
	//
	// let nonce = <any> await getUserNonce(userAccount.accountId)
	// await send(userAccount.accountId, contract.options.address, contract.methods.addProjectOfficial(role, userAccount.accountId), userAccount.privateKey, nonce.nonce)
	// await updateNonceUser(userAccount.accountId, parseInt(nonce.nonce) + 1)

	console.log('adding user role done ');
	return true;
}

export async function setMortgagePayment(mortgageAddress, index, payment) {
	let adminAccount = <any>await getAdminAccount('mortgage');
	let mortgage = getDeployedContracts('Mortgage', mortgageAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		mortgage.options.address,
		mortgage.methods.addPaymentSchedule(
			index,
			parseFloat(payment.interestRate) * 1000,
			parseFloat(payment.scheduledMonthlyPayment) * MIL,
			parseFloat(payment.interest) * 1000,
			parseFloat(payment.principal) * MIL,
			parseFloat(payment.principalTotal) * MIL,
			0,
			parseFloat(payment.paymentTotal) * MIL,
			new Date(payment.paymentDate).getTime(),
			parseFloat(payment.remainingLoanBalnce) * MIL,
			Number(payment.loanMonth),
			Number(payment.loanYear)
		),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(adminAccount.nonce + 1, 'mortgage');

	return true;
}

export async function addMortgageCondition(condition, mortgageeAccount) {
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('MortgageRequestFactory', cornerStone.mortgageRequestFactoryAddress);
	let cornerStoneContract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	let userNonce = <any>await getUserNonce(mortgageeAccount.accountId);
	let nonce = userNonce ? userNonce.nonce : 0;
	console.log('nonce ' + nonce);
	let privateKey = mortgageeAccount.privateKey.substring(2);
	await sendAdminTransaction(
		mortgageeAccount.accountId,
		cornerStone.mortgageRequestFactoryAddress,
		contract.methods.createMortgageeCondition(
			false,
			condition.project,
			parseFloat(condition.maxMortgage) * MIL,
			parseFloat(condition.interestRateArm) * 1000,
			parseFloat(condition.interestRateFixed) * 1000,
			parseFloat(condition.downPayment) * 1000,
			parseInt(condition.maxYears) * 12,
			0,
			0,
			0,
			0
		),
		privateKey,
		nonce
	);
	await updateNonceUser(parseInt(nonce) + 1, mortgageeAccount.accountId);
	let conditionAddress = await contract.methods
		.getLastMortgageConditionTest()
		.call({ from: mortgageeAccount.accountId });
	let mortgageeAveFunds = await cornerStoneContract.methods
		.mortgageeBalanceOf(mortgageeAccount.accountId)
		.call({ from: mortgageeAccount.accountId });
	return { conditionAddress: conditionAddress, mortgageeAveFunds: mortgageeAveFunds };
}

export async function addMortgageRequest(request, userAccount) {
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('MortgageRequestFactory', cornerStone.mortgageRequestFactoryAddress);
	let downPaymentPercentMill =
		parseInt(request.downPayment) *
		MIL /
		(parseInt(request.downPayment) * MIL + parseInt(request.amount) * MIL) *
		100 *
		1000;
	console.log('downPaymentPercentMill: ' + downPaymentPercentMill);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? userNonce.nonce : 0;
	let privateKey = userAccount.privateKey.substring(2);
	await sendAdminTransaction(
		userAccount.accountId,
		contract.options.address,
		contract.methods.createMortgageRequest(
			userAccount.accountId,
			request.project,
			request.mortgageConditionAddress,
			parseFloat(request.amount) * MIL,
			parseFloat(request.downPayment) * MIL,
			parseInt(request.years) * 12,
			downPaymentPercentMill,
			request.mortgagee
		),
		privateKey,
		nonce
	);
	await updateNonceUser(parseInt(nonce) + 1, userAccount.accountId);

	let mortgageRequestAddress = await contract.methods
		.lastMortgageRequest(userAccount.accountId)
		.call({ from: userAccount.accountId });

	return mortgageRequestAddress;
}

export async function saveEntity(contractName, adminAccount, entity) {
	let contractObj = this.getContractByName(contractName);
	let contract = await this.deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		contractObj,
		entity,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
	return contract;
}

export async function deployNewContractWithParams(adminAccount, adminPrivateKey, contractObj, parameters, nonce) {
	let cornerStoneContract = new web3.eth.Contract(contractObj.abi, { from: adminAccount });
	let code = contractObj.bytecode;
	console.log('FROM ACCOUNT : ' + adminAccount);
	web3.eth.defaultAccount = adminAccount;
	let values;
	// console.log('parameters')
	// console.log(parameters)

	if (parameters) {
		values = Object.keys(parameters).map(function(key) {
			return parameters[key];
		});
	}
	// console.log(values)

	let transaction = values
		? await cornerStoneContract.deploy({ data: code, arguments: values, from: adminAccount })
		: await cornerStoneContract.deploy({ data: code, from: adminAccount });
	let gas = await transaction.estimateGas({ from: adminAccount });
	console.log(gas);

	let options = {
		nonce: nonce,
		from: adminAccount,
		to: transaction._parent._address,
		data: transaction.encodeABI(),
		gas: gas
	};
	console.log(options);
	let signedTransaction = await web3.eth.accounts.signTransaction(options, adminPrivateKey);
	console.log('tran');
	console.log('DEFAULT ACCOUNT ' + JSON.stringify(web3.eth.defaultAccount));
	let handle = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	console.log('after handle');
	return handle.contractAddress;
}

export async function approveMortgageRequest(request, userAccount, userPrivateKey) {
	let contract = getDeployedContracts('MortgageRequest', request.mortgageRequestAddress);
	let adminAccount = <any>await getCornerStone();
	let mortgageAccount = <any>await getAdminAccount('mortgage');
	console.log('approving');
	console.log('contract: ' + JSON.stringify(contract));
	let mortgagee = await contract.methods.getMortgagee().call({ from: userAccount });
	console.log('mortgagee ' + mortgagee);
	console.log('userAccount ' + userAccount);
	console.log('privateKey Before ' + userPrivateKey);
	let privateKey = userPrivateKey.substring(2);
	console.log('privateKey After ' + privateKey);
	let mortgageCondition = await contract.methods.getMortgageCondition().call({ from: userAccount });
	console.log('mortgageCondition ' + mortgageCondition);
	let userNonce = <any>await getUserNonce(userAccount);
	let nonce = userNonce ? userNonce.nonce : 0;
	await transferEtherFromAdmin(userAccount);
	await sendAdminTransaction(
		userAccount,
		request.mortgageRequestAddress,
		contract.methods.approve(),
		privateKey,
		nonce
	);
	nonce = parseInt(nonce) + 1;
	await updateNonceUser(nonce, userAccount);

	console.log('Mortgage creating');
	let mortgageAddress = await deployNewContractWithParams(
		mortgageAccount.accountId,
		mortgageAccount.privateKey,
		Mortgage,
		{
			_stoneCoinAddress: request.projectId,
			_mortgagee: mortgagee,
			_buyer: userAccount,
			_mortgageRequest: request.mortgageRequestAddress,
			_mortgageeCondition: request.mortgageConditionAddress,
			_isExternal: false
		},
		mortgageAccount.nonceDeploy
	);

	await updateNonceDeployAdmin(parseInt(mortgageAccount.nonceDeploy) + 1, 'mortgage');
	console.log(`new Mortgage Address  ${mortgageAddress}`);
	let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
	console.log(`add owner : ${adminAccount.mortgageOperationAddress}`);
	// await sendAdminTransaction(mortgageAccount.accountId, mortgageContract.options.address, mortgageContract.methods.addOwnership(
	//     adminAccount.mortgageOperationAddress
	// ), mortgageAccount.privateKey, parseInt(mortgageAccount.nonce) + 1)
	//
	await send(
		mortgageAccount.accountId,
		mortgageContract.options.address,
		mortgageContract.methods.addOwnership(adminAccount.mortgageOperationAddress),
		mortgageAccount.privateKey,
		parseInt(mortgageAccount.nonceDeploy) + 1
	);

	await updateNonceDeployAdmin(parseInt(mortgageAccount.nonceDeploy) + 2, 'mortgage');
	console.log('ownership added');
	await sendAdminTransaction(
		userAccount,
		mortgageContract.options.address,
		mortgageContract.methods.setMortgageRegistrar(toBlockChainString('url'), toBlockChainString('urlMD5')),
		privateKey,
		nonce
	);
	nonce = parseInt(nonce) + 1;
	await updateNonceUser(nonce, userAccount);
	console.log('approve yeyy');
	return { success: true, mortgageAddress: mortgageAddress };
}

export async function setMortgageeAmount(userAccountId, mortgageRequest) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('mortgage');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	let MortgageFactory = getDeployedContracts('MortgageFactory', cornerStone.mortgageFactoryAddress);
	let balanceBefore = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	console.log('balanceBefore: ' + balanceBefore);
	console.log('amount: ' + mortgageRequest.amount);
	let mortgageeAddress = await MortgageFactory.methods.mortgageeAddress(userAccountId).call({ from: userAccountId });
	console.log('mortgageeAddress: ' + mortgageeAddress);
	console.log('new version2');
	if (mortgageeAddress === '0x0000000000000000000000000000000000000000') {
		// console.log('CREATING NEW')
		await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
		await sendAdminTransaction(
			adminAccount.accountId,
			MortgageFactory.options.address,
			MortgageFactory.methods.createMortgagee(
				userAccountId,
				Number(mortgageRequest.amount * MIL),
				toBlockChainString(mortgageRequest.name),
				toBlockChainString(mortgageRequest.type),
				toBlockChainString(mortgageRequest.city),
				toBlockChainString(mortgageRequest.country),
				toBlockChainString(mortgageRequest.address),
				toBlockChainString(mortgageRequest.businessIndentifier)
			),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		// console.log('CREATING DONE')
		mortgageeAddress = await MortgageFactory.methods
			.mortgageeAddress(userAccountId)
			.call({ from: adminAccount.accountId });
		// console.log('mortgageeAddress: ' + mortgageeAddress)
		await sendAdminTransaction(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.addMortgegeeAdmin(
				userAccountId,
				Number(mortgageRequest.amount * MIL),
				Number(mortgageRequest.amount * MIL),
				mortgageeAddress
			),
			adminAccount.privateKey,
			parseInt(adminAccount.nonce) + 1
		);
		await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'mortgage');
	} else {
		await sendAdminTransaction(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.addMortgegeeAdmin(
				userAccountId,
				Number(mortgageRequest.amount * MIL),
				Number(mortgageRequest.amount * MIL),
				mortgageeAddress
			),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
	}

	// console.log(mortgageeAddress)
	let balanceAfter = await contract.methods.balanceOf(userAccountId).call({ from: userAccountId });
	let success = true;
	if (balanceBefore === balanceAfter) {
		success = false;
	}
	// console.log('balanceAfter: ' + balanceAfter)
	console.log(JSON.stringify({ success: success, balance: balanceAfter, mortgageeAddress: mortgageeAddress }));
	return { success: success, balance: balanceAfter, mortgageeAddress: mortgageeAddress };
}

export async function getUserCurrentBalance(userAccountAddress) {
	let adminAccount = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	let balance = await contract.methods.balanceOf(userAccountAddress).call({ from: userAccountAddress });
	return balance;
}

export async function getUserMortgageeBalance(userAccountAddress) {
	let adminAccount = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	let balance = await contract.methods.mortgageeBalanceOf(userAccountAddress).call({ from: userAccountAddress });
	return balance;
}

export async function getBrokerFeeTransaction(brokerAccountAddress, userAccountAddress, index) {
	try {
		let adminAccount = <any>await getCornerStone();
		let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
		let brokerManagerAddress = await contract.methods.getBrokerManager().call({ from: brokerAccountAddress });
		let brokerManagerContract = getDeployedContracts('BrokerManager', brokerManagerAddress);
		let fee = await brokerManagerContract.methods
			.getBrokerHistoryFee(brokerAccountAddress, userAccountAddress, index, 0)
			.call({ from: brokerAccountAddress });
		let amount = await brokerManagerContract.methods
			.getBrokerHistoryAmount(brokerAccountAddress, userAccountAddress, index, 0)
			.call({ from: brokerAccountAddress });
		let price = await brokerManagerContract.methods
			.getBrokerHistoryBuyingPrice(brokerAccountAddress, userAccountAddress, index, 0)
			.call({ from: brokerAccountAddress });
		let time = await brokerManagerContract.methods
			.getBrokerHistoryTime(brokerAccountAddress, userAccountAddress, index, 0)
			.call({ from: brokerAccountAddress });
		let projectAddress = await brokerManagerContract.methods
			.getBrokerHistoryProject(brokerAccountAddress, userAccountAddress, index, 0)
			.call({ from: brokerAccountAddress });
		return { fee: fee, amount: amount, price: price, time: time, projectAddress: projectAddress };
	} catch (error) {
		return false;
	}
}

export async function getUserHoldings(userAccountAddress, projectAddress) {
	try {
		// console.log('start holdings')
		let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
		// console.log('get contract holdings')
		let balance = await stonCoinContract.methods.balanceOf(userAccountAddress).call({ from: userAccountAddress });
		// console.log('end contract holdings')
		return balance;
	} catch (error) {
		// console.log('ERROR ' + JSON.stringify(error))
		return 0;
	}
}

export async function getUserRemainingMortgage(mortgageAddress, userAddress) {
	let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
	let remainingMortgage = await mortgageContract.methods.getRemainingLoanBalance().call({ from: userAddress });
	return remainingMortgage;
}

export async function getMortgageeBalance(userAddress) {
	let adminAccount = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	let mortgageeBalance = await contract.methods.mortgageeBalanceOf(userAddress).call({ from: userAddress });
	return mortgageeBalance;
}

export async function clearMortgage(mortgageAddress, userAccountId, userPrivateKey) {
	let adminAccount = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	await sendInternalAccountRequest(
		userAccountId,
		contract.options.address,
		contract.methods.clearAllMortgage(mortgageAddress),
		userPrivateKey
	);
	let remainingMortgage = await getUserRemainingMortgage(mortgageAddress, userAccountId);
	return remainingMortgage;
}

export async function createSignedDocument(approveByAdmin, url, md5, adminAccountId) {
	let request = {
		approveByAdmin: approveByAdmin,
		url: toBlockChainString(url),
		md5: toBlockChainString(md5)
	};
	let signedDocument = await saveEntity('SignedDocument', adminAccountId, request);
	return signedDocument;
}

export async function shouldSignAdminDocument(documentAddress, userAddress, role, adminAccountId, adminPrivateLey) {
	let contract = getDeployedContract('SignedDocumentFactory');
	let adminAccount = <any>await getAdminAccountId();
	try {
		await updateNonce(adminAccount.nonce + 1);

		await sendAdmin(
			adminAccountId,
			contract.options.address,
			contract.methods.shouldSign(documentAddress, userAddress, toBlockChainString(role)),
			adminPrivateLey,
			adminAccount.nonce
		);
		return { success: true };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function assignNewBroker(userAddress) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	console.log(`adding new role ${userAddress}`);
	console.log(`admin ${JSON.stringify(adminAccount)}`);
	console.log(`contract ${JSON.stringify(contract.options)}`);
	try {
		await sendAdminTransaction(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.addBroker(userAddress),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		console.log(`success`);
	} catch (eror) {
		console.log(`ERROR ${JSON.stringify(eror)}`);
		return { success: false };
	}
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	return { success: true };
}

export async function addOrganization(name, phoneNumber, email) {
	let adminAccount = <any>await getAdminAccount('operation');
	console.log('start adding Organization');
	let organizationAddress = await deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		Organization,
		{
			name: toBlockChainString(name),
			phoneNumber: toBlockChainString(phoneNumber),
			email: toBlockChainString(email)
		},
		adminAccount.nonceDeploy
	);
	await updateNonceDeployAdmin(parseInt(adminAccount.nonceDeploy) + 1, 'operation');
	console.log('organizationAddress: ' + organizationAddress);
	return { success: true, organizationAddress: organizationAddress };
}

export async function inviteUserGroup(creator, groupAddress, user) {
	let userAccount = <any>await getUserActiveAccount(creator);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let invitedUser = <any>await getUserActiveAccount(user);
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.inviteMember(invitedUser.accountId),
		userAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);
}

export async function joinGroup(groupAddress, user) {
	let userAccount = <any>await getUserActiveAccount(user);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.joinGroup(),
		userAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);
}

export async function isVotingMember(groupAddress, user) {
	let userAccount = <any>await getUserActiveAccount(user);
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	let result = await projectGroupsContract.methods.isVotingMember().call({ from: userAccount.accountId });
	return result;
}

export async function hasGroupOffer(groupAddress, user) {
	let userAccount = <any>await getUserActiveAccount(user);
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	let result = <any>await projectGroupsContract.methods.getOffer().call({ from: userAccount.accountId });
	return result > 0;
}

export async function isGroupRepresentative(groupAddress, user) {
	let userAccount = <any>await getUserActiveAccount(user);
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	let result = <any>await projectGroupsContract.methods
		.isGroupRepresentative(userAccount.accountId)
		.call({ from: userAccount.accountId });
	return result;
}

export async function updatePaymentStatus(groupAddress, user, trustee, amount, addOperation) {
	let trusteeAccount = <any>await getUserActiveAccount(trustee);
	let userAccount = <any>await getUserActiveAccount(user);
	let userNonce = <any>await getUserNonce(trusteeAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		trusteeAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.paymentStatus(userAccount.accountId, amount, addOperation),
		trusteeAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, trusteeAccount.accountId);
	let isVotingMember = <any>await projectGroupsContract.methods
		.isVotingMember()
		.call({ from: userAccount.accountId });
	return isVotingMember;
}

export async function setUserOffer(groupId, user, amount) {
	let userAccount = <any>await getUserActiveAccount(user);
	let group = <any>await getGroup(groupId);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', group.groupAddress);
	console.log(`userNonce : ${userNonce} user nonoce: ${nonce}`);
	console.log(`group : ${JSON.stringify(group)} `);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.setOffer(amount),
		userAccount.privateKey,
		nonce
	);
	console.log(`update nonce ${userAccount.accountId} : ${nonce + 1} `);
	await updateNonceUser(nonce + 1, userAccount.accountId);
}

export async function addGroupVote(documentMd5, type, groupAddress, groupCreator) {
	let userAccount = <any>await getUserActiveAccount(groupCreator);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.setVotingType(documentMd5, type),
		userAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);
}

export async function addGroupRpresentive(groupAddress, groupCreator, userId) {
	let userAccount = <any>await getUserActiveAccount(groupCreator);
	let representativeAccount = <any>await getUserActiveAccount(userId);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.addGroupRepresentation(representativeAccount.accountId),
		userAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);
}

export async function vote(user, documentMd5, voteResult, groupAddress) {
	let userAccount = <any>await getUserActiveAccount(user);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	let projectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);
	await send(
		userAccount.accountId,
		projectGroupsContract.options.address,
		projectGroupsContract.methods.vote(documentMd5, voteResult),
		userAccount.privateKey,
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);
	let votingResult = <any>await projectGroupsContract.methods
		.getVotingResult(documentMd5)
		.call({ from: userAccount.accountId });
	let voters = <any>await projectGroupsContract.methods
		.getNumberOfVoters(documentMd5)
		.call({ from: userAccount.accountId });
	let positiveVoters = <any>await projectGroupsContract.methods
		.getVotingPositiveResult(documentMd5)
		.call({ from: userAccount.accountId });
	return { numberOfVoters: voters, numberOfPositiveVoters: positiveVoters, votingResult: votingResult };
}

export async function createGroup(creator, projectAddress, isOpen) {
	let userAccount = <any>await getUserActiveAccount(creator);
	let userNonce = <any>await getUserNonce(userAccount.accountId);
	let nonce = userNonce ? parseInt(userNonce.nonce) : 0;
	console.log('start adding group');
	console.log(`nonce ${nonce}`);
	console.log(
		`groups params: ${JSON.stringify({
			projectAddress: projectAddress,
			creator: userAccount.accountId,
			isOpen: isOpen
		})}`
	);

	let groupAddress = await deployNewContractWithParams(
		userAccount.accountId,
		userAccount.privateKey,
		ProjectGroups,
		{
			projectAddress: projectAddress,
			creator: userAccount.accountId,
			isOpen: isOpen
		},
		nonce
	);
	await updateNonceUser(nonce + 1, userAccount.accountId);

	let projectGroupsStorageAddress = await deployNewContractWithParams(
		userAccount.accountId,
		userAccount.privateKey,
		ProjectGroupsStorage,
		{},
		nonce + 1
	);
	await updateNonceUser(nonce + 2, userAccount.accountId);

	let projectGroupsVotingStorageAddress = await deployNewContractWithParams(
		userAccount.accountId,
		userAccount.privateKey,
		ProjectGroupsVotingStorage,
		{},
		nonce + 2
	);
	await updateNonceUser(nonce + 3, userAccount.accountId);

	let projectGroupStorageContract = getDeployedContracts('ProjectGroupsStorage', projectGroupsStorageAddress);
	await send(
		userAccount.accountId,
		projectGroupStorageContract.options.address,
		projectGroupStorageContract.methods.addOwnership(groupAddress),
		userAccount.privateKey,
		nonce + 3
	);
	await updateNonceUser(nonce + 4, userAccount.accountId);

	await send(
		userAccount.accountId,
		projectGroupStorageContract.options.address,
		projectGroupStorageContract.methods.addOwnership(projectGroupsVotingStorageAddress),
		userAccount.privateKey,
		nonce + 4
	);
	await updateNonceUser(nonce + 5, userAccount.accountId);

	let projectGroupStorageVotingContract = getDeployedContracts(
		'ProjectGroupsVotingStorage',
		projectGroupsVotingStorageAddress
	);

	await send(
		userAccount.accountId,
		projectGroupStorageVotingContract.options.address,
		projectGroupStorageVotingContract.methods.addOwnership(groupAddress),
		userAccount.privateKey,
		nonce + 5
	);
	await updateNonceUser(nonce + 6, userAccount.accountId);

	await send(
		userAccount.accountId,
		projectGroupStorageVotingContract.options.address,
		projectGroupStorageVotingContract.methods.addOwnership(projectGroupsStorageAddress),
		userAccount.privateKey,
		nonce + 6
	);
	await updateNonceUser(nonce + 7, userAccount.accountId);

	await send(
		userAccount.accountId,
		projectGroupStorageVotingContract.options.address,
		projectGroupStorageVotingContract.methods.setProjectGroupStorageAddress(projectGroupsStorageAddress),
		userAccount.privateKey,
		nonce + 7
	);
	await updateNonceUser(nonce + 8, userAccount.accountId);

	let ProjectGroupsContract = getDeployedContracts('ProjectGroups', groupAddress);

	await send(
		userAccount.accountId,
		ProjectGroupsContract.options.address,
		ProjectGroupsContract.methods.setProjectGroupsStorage(projectGroupsStorageAddress),
		userAccount.privateKey,
		nonce + 8
	);
	await updateNonceUser(nonce + 9, userAccount.accountId);

	await send(
		userAccount.accountId,
		ProjectGroupsContract.options.address,
		ProjectGroupsContract.methods.setProjectGroupsVotingStorage(projectGroupsVotingStorageAddress),
		userAccount.privateKey,
		nonce + 9
	);
	await updateNonceUser(nonce + 10, userAccount.accountId);

	await send(
		userAccount.accountId,
		ProjectGroupsContract.options.address,
		ProjectGroupsContract.methods.init(),
		userAccount.privateKey,
		nonce + 10
	);
	await updateNonceUser(nonce + 11, userAccount.accountId);

	console.log('groupAddress: ' + groupAddress);
	return { success: true, groupAddress: groupAddress };
}

export async function assignProjectToOrg(projectAddress, organization) {
	let contract = getDeployedContracts('StoneCoin', projectAddress);
	let adminAccount = <any>await getAdminAccount('project');

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.setOrganization(organization),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');

	return { success: true };
}

export async function updateProjectTarget(projectAddress, dilution, units) {
	let contract = getDeployedContracts('StoneCoin', projectAddress);
	let adminAccount = <any>await getAdminAccount('project');
	let ownerBalance = await contract.methods.getOwnerBalance().call({ from: adminAccount.accountId });
	let stones = await contract.methods.STONES().call({ from: adminAccount.accountId });

	if (dilution) {
		await sendAdminTransaction(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.dilutionStoneCoin(units),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');
	} else {
		if (ownerBalance >= units) {
			await sendAdminTransaction(
				adminAccount.accountId,
				contract.options.address,
				contract.methods.removeStoneCoin(units),
				adminAccount.privateKey,
				adminAccount.nonce
			);
			await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'project');
		}
	}
	console.log(`project stones updated `);
	ownerBalance = await contract.methods.getOwnerBalance().call({ from: adminAccount.accountId });
	let newStones = await contract.methods.STONES().call({ from: adminAccount.accountId });
	if (newStones !== stones) {
		console.log(`project ask updating `);
		adminAccount = <any>await getAdminAccount('project');
		await createProjectInitialAsk(adminAccount, projectAddress, stones);
		console.log(`project ask updating done`);
	}
	return { success: true, ownerBalance: ownerBalance, target: stones };
}

export async function payBroker(userAddress, payment) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	try {
		console.log('PAY BROKER');

		await sendAdminTransaction(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.payBroker(userAddress, payment, 0),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

		let brokerManagerAddress = await contract.methods.getBrokerManager().call({ from: userAddress });
		let brokerManagerContract = getDeployedContracts('BrokerManager', brokerManagerAddress);
		let brokerPayment = await brokerManagerContract.methods
			.getBrokerPayments(userAddress, 0)
			.call({ from: userAddress });

		return { success: true, payment: brokerPayment };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function assignUserToBroker(brokerAddress, userAddress) {
	let adminAccount = <any>await getAdminAccount('operation');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	try {
		await updateNonce(parseInt(adminAccount.nonce) + 1);

		await sendAdmin(
			adminAccount.accountId,
			contract.options.address,
			contract.methods.addUserToBroker(userAddress, brokerAddress, 0),
			adminAccount.privateKey,
			adminAccount.nonce
		);
		return { success: true };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function shouldSignDocument(documentAddress, userAddress, role, userPrivateLey) {
	let contract = getDeployedContract('SignedDocumentFactory');
	try {
		await sendInternalAccountRequest(
			userAddress,
			contract.options.address,
			contract.methods.shouldSign(documentAddress, userAddress, toBlockChainString(role)),
			userPrivateLey
		);
		return { success: true };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function signDocument(documentAddress, userAccountId, userPrivateKey) {
	let contract = getDeployedContract('SignedDocumentFactory');
	try {
		// console.log('documentAddress ' + documentAddress + 'userAccountId ' + userAccountId + 'userPrivateKey ' + userPrivateKey)
		await sendInternalAccountRequest(
			userAccountId,
			contract.options.address,
			contract.methods.sign(documentAddress),
			userPrivateKey
		);
		return { success: true };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function signAdminDocument(documentAddress, adminAccountId, adminPrivateKey) {
	let contract = getDeployedContract('SignedDocumentFactory');
	let adminAccount = <any>await getAdminAccountId();

	try {
		await updateNonce(parseInt(adminAccount.nonce) + 1);

		await sendAdmin(
			adminAccountId,
			contract.options.address,
			contract.methods.sign(documentAddress),
			adminPrivateKey,
			adminAccount.nonce
		);

		return { success: true };
	} catch (error) {
		// console.log(JSON.stringify(error))
		return { success: false };
	}
}

export async function setUserDisposition(userAddress, dispositionState) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.setUserDispositionState(userAddress, dispositionState),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	return { success: true };
}

export async function setUserFeeStatus(userAddress, feesState) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addFeeManagerRole(adminAccount.accountId),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	let feeManagerContract = await contract.methods.getFeeManager().call({ from: adminAccount.accountId });
	let feeManager = getDeployedContracts('FeeManager', feeManagerContract);
	await sendAdminTransaction(
		adminAccount.accountId,
		feeManager.options.address,
		feeManager.methods.setUserFeeStatus(userAddress, feesState, 0),
		adminAccount.privateKey,
		parseInt(adminAccount.nonce) + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');

	return { success: true };
}

export async function clearFees() {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addFeeManagerRole(adminAccount.accountId),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	let feeManagerContract = await contract.methods.getFeeManager().call({ from: adminAccount.accountId });
	let feeManager = getDeployedContracts('FeeManager', feeManagerContract);

	await sendAdminTransaction(
		adminAccount.accountId,
		feeManager.options.address,
		feeManager.methods.clearFees(),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');

	return { success: true };
}

export async function getTotalFees() {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addFeeManagerRole(adminAccount.accountId),
		adminAccount.accountId,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');

	let feeManagerContract = await contract.methods.getFeeManager().call({ from: adminAccount.accountId });
	let feeManager = getDeployedContracts('FeeManager', feeManagerContract);

	let totalFees = await feeManager.methods.getTotalFees().call({ from: adminAccount.accountId });
	return { success: true, totalFees: totalFees };
}

export async function setUserFeeRatio(buyingFee, sellingFee) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('operation');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addFeeManagerRole(adminAccount.accountId),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'operation');
	let feeManagerContract = await contract.methods.getFeeManager().call({ from: adminAccount.accountId });
	let feeManager = getDeployedContracts('FeeManager', feeManagerContract);

	await sendAdminTransaction(
		adminAccount.accountId,
		feeManager.options.address,
		feeManager.methods.setFeeRatio(buyingFee, sellingFee, 0),
		adminAccount.privateKey,
		parseInt(adminAccount.nonce) + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'operation');
	return { success: true };
}

export async function projectTradeRequest(
	buyer,
	seller,
	amount,
	price,
	adminAccountId,
	adminPrivateLey,
	projectAddress
) {
	let adminAccount = <any>await getAdminAccount('trade');
	let cornerSone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerSone.cornerStoneAddress);
	console.log('PROJECT ADDRESS: ' + projectAddress);
	let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
	let balanceBefore = await contract.methods.balanceOf(buyer).call({ from: buyer });
	console.log('balanceBefore: ' + balanceBefore);
	let sellerBalance = await stonCoinContract.methods.balanceOf(seller).call({ from: seller });
	let buyerBalance = await stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
	console.log('BUYYER Stones: ' + buyerBalance);
	console.log('SELLER Stones: ' + sellerBalance);
	console.log(
		'buyer ' +
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
			projectAddress
	);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.trade(projectAddress, buyer, seller, amount, price * MIL, 0),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'trade');
	sellerBalance = await stonCoinContract.methods.balanceOf(seller).call({ from: seller });
	buyerBalance = await stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
	console.log('BUYYER Stones: ' + buyerBalance);
	console.log('SELLER Stones: ' + sellerBalance);
	console.log(' END TRADE: ' + buyerBalance);
	return { success: true, balance: buyerBalance };
}

export async function addMortgageOperatorRole(userAccountAddress, adminAccountId, adminPrivateLey) {
	let adminAccount = <any>await getAdminAccount('mortgage');
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	// console.log('mortgageAddress :' + mortgageAddress)
	// console.log('marketPriceMills :' + marketPriceMills)
	// console.log('PAYMENT ##### :' + nextPayment)

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.addMortgageOperatorRole(userAccountAddress),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'mortgage');
	let success = true;
	return { success: success };
}

export async function payMortgageNextPayment(mortgageAddress, marketPriceMills) {
	let cornerStone = <any>await getCornerStone();
	let adminAccount = <any>await getAdminAccount('mortgage');
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	let mortgageContract = getDeployedContracts('Mortgage', mortgageAddress);
	console.log('mortgageAddress :' + mortgageAddress);
	console.log('marketPriceMills :' + marketPriceMills);

	let nextPayment = await mortgageContract.methods.getNextPayment().call({ from: adminAccount.accountId });
	let nextPaymentMortgage = await mortgageContract.methods.getNextPayment().call({ from: adminAccount.accountId });
	let nextPaymentIndex = await mortgageContract.methods.getNextPaymentIndex().call({ from: adminAccount.accountId });
	let buyer = await mortgageContract.methods.getBuyer().call({ from: adminAccount.accountId });
	let buyerFunds = await contract.methods.balanceOf(buyer).call({ from: adminAccount.accountId });
	console.log('PAYMENT ##### :' + nextPayment);
	console.log('PAYMENT ##### :' + nextPaymentMortgage);
	console.log('buyer ##### :' + buyer);
	console.log('buyerFunds ##### :' + buyerFunds);
	console.log('nextPaymentIndex ##### :' + nextPaymentIndex);

	console.log('PAYMENT Request ##### :' + mortgageAddress + ' , ' + marketPriceMills);

	await sendAdminTransaction(
		adminAccount.accountId,
		contract.options.address,
		contract.methods.mortgagePayment(mortgageAddress, marketPriceMills),
		adminAccount.privateKey,
		parseInt(adminAccount.nonce)
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 3, 'mortgage');

	let defaults = await mortgageContract.methods.getDefaultStatus().call({ from: adminAccount.accountId });
	let getLastPayedIndex = await mortgageContract.methods.getLastPayedIndex().call({ from: adminAccount.accountId });

	let success = true;
	return { success: success, nextPayment: nextPayment, defaults: defaults, lastPayedIndex: getLastPayedIndex };
}

export async function mortgageRemainingBalance(mortgageAddress, userAddress) {
	let contract = getDeployedContracts('Mortgage', mortgageAddress);
	let remainingBalance = await contract.methods.getRemainingLoanBalance().call({ from: userAddress });
	return remainingBalance;
}

export async function getMortgageNextPaymentIndex(mortgageAddress, userAddress) {
	let contract = getDeployedContracts('Mortgage', mortgageAddress);
	let nextPaymentIndex = await contract.methods.getNextPaymentIndex().call({ from: userAddress });
	return nextPaymentIndex;
}

export async function mortgageShouldRefinance(mortgageAddress, userAddress) {
	let contract = getDeployedContracts('Mortgage', mortgageAddress);
	let shouldRefinance = await contract.methods.shouldRefinance().call({ from: userAddress });
	return shouldRefinance;
}

export async function getUserBalance(user) {
	let adminAccount = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress);
	let balance = await contract.methods.balanceOf(user).call({ from: user });
	return balance;
}

export async function projectTradeMortgageRequest(
	buyer,
	seller,
	amount,
	price,
	adminAccountId,
	adminPrivateLey,
	projectAddress,
	buyerMortgageAddress,
	sellerMortgageAddress
) {
	let adminTrade = <any>await getAdminAccount('trade');
	let cornerStone = <any>await getCornerStone();

	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	console.log('PROJECT ADDRESS: ' + projectAddress);
	let stonCoinContract = getDeployedContracts('StoneCoin', projectAddress);
	let balanceBefore = await contract.methods.balanceOf(buyer).call({ from: buyer });
	console.log('balanceBefore: ' + balanceBefore);
	let sellerBalance = await stonCoinContract.methods.balanceOf(seller).call({ from: seller });
	let buyerBalance = await stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
	let bidAmount = await contract.methods.bidAmount(projectAddress, buyer).call({ from: buyer });
	let askAmount = await contract.methods.askAmount(projectAddress, seller).call({ from: seller });
	let askAmountId = await contract.methods.askAmount(projectAddress, adminAccountId).call({ from: adminAccountId });
	console.log('BUYYER Stones: ' + buyerBalance);
	console.log('SELLER Stones: ' + sellerBalance);
	console.log('BID Amount: ' + bidAmount);
	console.log('ASK BID INITIAL: ' + seller + ' Ask Amount: ' + askAmount);
	console.log('ASK adminAccountId  BID INITIAL: ' + adminAccountId + ' Ask adminAccountId Amount: ' + askAmountId);
	let key = new Date().getTime();
	console.log(
		'TRADE PART A  ' +
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
			price * MIL
	);

	await sendAdminTransaction(
		adminTrade.accountId,
		contract.options.address,
		contract.methods.createTradeMortgage(
			key,
			projectAddress,
			buyer,
			seller,
			buyerMortgageAddress,
			sellerMortgageAddress,
			amount,
			price * MIL,
			0
		),
		adminTrade.privateKey,
		adminTrade.nonce
	);
	await updateNonceAdmin(parseInt(adminTrade.nonce) + 1, 'trade');

	console.log('TRADE DONE');
	// await send(adminAccountId, contract.options.address, contract.methods.tradeMortgaged(key), adminPrivateLey)
	// console.log('TRADE PART B Done')

	let sellerTotalClearances = 0;
	if (sellerMortgageAddress) {
		let mortgageContract = getDeployedContracts('Mortgage', sellerMortgageAddress);
		sellerTotalClearances = await mortgageContract.methods.getTotalClearances().call({ from: seller });
		console.log('Sellet Clerannces ' + sellerTotalClearances);
	}
	sellerBalance = await stonCoinContract.methods.balanceOf(seller).call({ from: seller });
	buyerBalance = await stonCoinContract.methods.balanceOf(buyer).call({ from: buyer });
	// console.log('BUYYER Stones: ' + buyerBalance)
	// console.log('SELLER Stones: ' + sellerBalance)
	let balanceAfter = await contract.methods.balanceOf(buyer).call({ from: buyer });
	// console.log('balanceAfter: ' + balanceAfter)
	return { success: true, balance: balanceAfter, sellerTotalClearances: sellerTotalClearances };
}

export async function projectAskRequest(userAccountId, stoneCoinAddress, target, limit, signDocument) {
	let adminAccount = <any>await getAdminAccount('bidAsk');
	let nonce = adminAccount.nonce;
	let cornerStone = <any>await getCornerStone();
	let contract = getDeployedContracts('CornerStone', cornerStone.cornerStoneAddress);
	await sendAdminTransaction(
		userAccountId,
		contract.options.address,
		contract.methods.askCancelAdmin(userAccountId, stoneCoinAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceAdmin(nonce, 'bidAsk');

	await sendAdminTransaction(
		userAccountId,
		contract.options.address,
		contract.methods.askAdmin(userAccountId, stoneCoinAddress, target, limit * MIL, signDocument || 0),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	await updateNonceAdmin(nonce, 'bidAsk');

	// await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.askCancel(stoneCoinAddress), userPrivateKey)
	//     await sendInternalAccountRequest(userAccountId, contract.options.address, contract.methods.ask(stoneCoinAddress, target, limit * MIL, 0), userPrivateKey)
	let askAmount = await contract.methods.askAmount(stoneCoinAddress, userAccountId).call({ from: userAccountId });
	console.log('askAmount ' + askAmount);
	return { success: true };
}

export async function sendAdmin(adminAccountId, contractAddress, transaction, privateKey, nonce) {
	return new Promise(async (resolve, reject) => {
		try {
			try {
				console.log('Start Transaction ');
				console.log('adminAccountId ' + adminAccountId);
				if (!nonce) {
					nonce = await web3.eth.getTransactionCount(adminAccountId);
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

				let signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
				console.log('transaction signed');
				let tran = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

				console.log('Trannsaction result ' + JSON.stringify(tran));
				resolve(tran);
			} catch (error) {
				console.log('error during transaction');
				// tryAgain(adminAccountId, contractAddress, transaction, privateKey, nonce -1)
				console.log(error);
				reject(error);
			}
		} catch (error) {
			console.log('Transaction timed out ');
			reject(error);
		}
	});
}

export async function sendNonTransaction(contractName, contractMethod, entity, adminAccountId) {
	return new Promise((resolve, reject) => {
		try {
			try {
				console.log('Start Transaction ' + contractMethod);
				let contract = getDeployedContract(contractName);
				contract.methods
					[contractMethod](...Object.values(entity))
					.send({
						from: adminAccountId,
						gas: 2000000
					})
					.on('transactionHash', function(hash) {
						// console.log('START TRANSACTION')
						// console.log(hash)
					})
					.on('receipt', function(receipt) {
						// console.log(receipt)
						resolve(receipt);
					})
					.on('error', function(error) {
						console.log(
							'Transaction Failed ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity)
						);
						console.log(JSON.stringify(error));
						reject(error);
					});
				console.log('end Transaction ' + contractMethod);
			} catch (error) {
				console.log('Transaction Failed ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity));
				console.log(JSON.stringify(error));
				reject(error);
			}
		} catch (error) {
			console.log('Transaction timed out ' + contractName + ' ' + contractMethod + ' ' + JSON.stringify(entity));

			reject(error);
		}
	});
}

export async function sendRequest(accountId, password, options) {
	return new Promise((resolve, reject) => {
		console.log('0x00000000');
		web3.eth.personal.unlockAccount(accountId, password, '0x00000000').then((result) => {
			console.log('RESULTS ' + result);
			if (result) {
				console.log('Start Transaction ' + JSON.stringify(options));
				web3.eth
					.sendTransaction(options, (error, result) => {})
					.on('transactionHash', function(hash) {})
					.on('receipt', function(receipt) {})
					.on('confirmation', function(confirmationNumber, receipt) {})
					.on('error', function(error) {
						console.log('Transaction error ' + JSON.stringify(error));
						reject(error);
					})
					.then(function(receipt) {
						resolve(receipt);
					});
				console.log('end Transaction ');
			} else {
				console.log('Transaction failed ' + accountId + ' ' + ' ' + JSON.stringify(options));
				let error = 'Unable to unlock account';
				reject(error);
			}
		});
	});
}

export async function sendInternalAccountRequest(accountId, contractAddress, transaction, password) {
	let nonce = <any>await getAccountNonce(accountId);
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

	await setAccountNonce(accountId, parseInt(nonce) + 1);
	let response = await sendAdmin(accountId, contractAddress, transaction, password, nonce);

	// let response = await sendRequest(accountId, password, options)

	return response;
}

function toHexString(n) {
	if (n < 0) {
		n = 0xffffffff + n + 1;
	}

	return '0x' + ('00000000' + n.toString(16).toUpperCase()).substr(-8);
}

export async function sendAdminTransaction(from, contractAddress, transactionData, privateKey, nonce) {
	console.log(`gas limit test `);
	let gas = await web3.eth.estimateGas({ from: from, to: contractAddress, data: transactionData.encodeABI() });
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
	await transaction.sign(Buffer.from(privateKey, 'hex'));
	console.log('transaction signed');
	const serializedTransaction = transaction.serialize();
	await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'));
}

export async function sendAdminTransactionWithGas(adminAccountId, contractAddress, transaction, privateKey, nonce) {
	web3.eth.defaultAccount = adminAccountId;
	let currentNonce = await web3.eth.getTransactionCount(web3.eth.defaultAccount);
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
	let signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
	let tran = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	return tran;
}

export async function send(adminAccountId, contractAddress, transaction, privateKey, nonce) {
	console.log('CHEKING GAS ');
	let gas = await web3.eth.estimateGas({ from: adminAccountId, to: contractAddress, data: transaction.encodeABI() });

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
	let signedTransaction = await web3.eth.accounts.signTransaction(options, privateKey);
	let tran = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
	return tran;
}

export function toBlockChainString(string) {
	let asci = web3.utils.fromAscii(string);
	return asci.substring(0, 28);
}

function getDeployedContract(name) {
	return getDeployedContracts(name, 0);
}

export function getContractByName(name) {
	switch (name) {
		case 'MortgageRequest':
			return MortgageRequest;
		case 'AssetManager':
			return AssetManager;
		case 'StoneCoinStorage':
			return StoneCoinStorage;
		case 'StoneCoinMortgage':
			return StoneCoinMortgage;
		case 'StoneCoinMortgageStorage':
			return StoneCoinMortgageStorage;

		case 'Estimation':
			return Estimation;

		case 'Terms':
			return Terms;

		case 'Property':
			return Property;

		case 'Manager':
			return Manager;

		case 'Project':
			return Project;
		case 'StoneCoin':
			return StoneCoin;
		case 'Registrar':
			return Registrar;

		case 'Trustee':
			return Trustee;
	}

	return null;
}

export function getDeployedContracts(name, contractAddress) {
	let abi = null;
	let address = null;
	switch (name) {
		case 'CornerStone':
			abi = CornerStone.abi;
			address = contractAddress;
			break;
		case 'CornerStoneBase':
			abi = CornerStoneBase.abi;
			address = contractAddress;
			break;
		case 'MortgageOperations':
			abi = MortgageOperations.abi;
			address = contractAddress;
			break;

		case 'CornerStoneBaseStorage':
			abi = CornerStoneBaseStorage.abi;
			address = contractAddress;
			break;
		case 'MortgageStoneStorage':
			abi = MortgageStoneStorage.abi;
			address = contractAddress;
			break;
		case 'ProjectGroupsStorage':
			abi = ProjectGroupsStorage.abi;
			address = contractAddress;
			break;
		case 'Disposition':
			abi = Disposition.abi;
			address = contractAddress;
			break;

		case 'TradesHistory':
			abi = TradesHistory.abi;
			address = contractAddress;
			break;
		case 'ProjectGroups':
			abi = ProjectGroups.abi;
			address = contractAddress;
			break;
		case 'ProjectGroupsVotingStorage':
			abi = ProjectGroupsVotingStorage.abi;
			address = contractAddress;
			break;
		case 'StoneCoinMortgage':
			abi = StoneCoinMortgage.abi;
			address = contractAddress;
			break;
		case 'MortgageStone':
			abi = MortgageStone.abi;
			address = contractAddress;
			break;

		case 'StoneCoinStorage':
			abi = StoneCoinStorage.abi;
			address = contractAddress;
			break;
		case 'StoneCoinMortgageStorage':
			abi = StoneCoinMortgageStorage.abi;
			address = contractAddress;
			break;
		case 'CornerTransaction':
			abi = CornerTransaction.abi;
			address = contractAddress;
			break;
		case 'MortgageRequest':
			abi = MortgageRequest.abi;
			address = contractAddress;
			break;
		case 'SignedDocumentFactory':
			abi = SignedDocumentFactory.abi;
			address = getContractAddress(SignedDocumentFactory.networks);
			break;
		case 'StoneCoin':
			abi = StoneCoin.abi;
			address = contractAddress;
			break;
		case 'BrokerManager':
			abi = BrokerManager.abi;
			address = contractAddress;
			break;
		case 'Estimation':
			abi = Estimation.abi;
			address = getContractAddress(Estimation.networks);
			break;
		case 'MortgageFactory':
			abi = MortgageFactory.abi;
			address = contractAddress;
			break;
		case 'MortgageRequestFactory':
			abi = MortgageRequestFactory.abi;
			address = contractAddress;
			break;

		case 'OrganizationFactory':
			abi = OrganizationFactory.abi;
			address = getContractAddress(OrganizationFactory.networks);
			break;
		case 'AssetManager':
			abi = AssetManager.abi;
			address = contractAddress;
			break;
		case 'Mortgage':
			abi = Mortgage.abi;
			address = contractAddress;
			break;
		case 'FeeManager':
			abi = FeeManager.abi;
			address = contractAddress;
			break;
		case 'AssetFactory':
			abi = AssetFactory.abi;
			address = getContractAddress(AssetFactory.networks);
			break;
	}

	if (abi === null) {
		return null;
	}
	// console.log('CONTRACT ADDRESS: ' + address)
	return new web3.eth.Contract(abi, address);
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}

export async function createAdmin() {
	console.log('CREATI Wallet ');
	let newAdmin = <any>await web3.eth.accounts.create();
	console.log(`return account ${newAdmin}`);
	console.log(`return account ${JSON.stringify(newAdmin)}`);
	return newAdmin;
}
export async function replaceAdmin(replaceAdmin) {
	let adminAccount = <any>await getAdminAccountId();
	let newAdmin = <any>await web3.eth.accounts.create();
	console.log(`new admin ${newAdmin.address}`);
	let oldAdmin = <any>await getAdminAccount(replaceAdmin);
	let contractAddresses = <any>await getCornerStone();
	console.log(`cornerStone address ${contractAddresses.cornerStoneAddress}`);
	let cornerStone = getDeployedContracts('CornerStone', contractAddresses.cornerStoneAddress);
	console.log(`cornerStone deployed address ${cornerStone.options.address}`);
	console.log('add role to new admin');
	await send(
		adminAccount.accountId,
		cornerStone.options.address,
		cornerStone.methods.addOwnership(newAdmin.address),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');

	console.log(`remove role from old admin ${oldAdmin.accountId}`);
	await send(
		adminAccount.accountId,
		cornerStone.options.address,
		cornerStone.methods.removeOwnership(oldAdmin.accountId),
		adminAccount.privateKey,
		adminAccount.nonce + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'init');

	if (replaceAdmin === 'project' || replaceAdmin === 'init') {
		let projects = <any>await getProjects();
		await asyncForEach(projects, async (projectAddress) => {
			await replaceProjectAdmin(projectAddress, newAdmin, oldAdmin);
		});
	}
	console.log('role added');
	return newAdmin;
}

async function replaceProjectAdmin(projectAddress, newAdmin, oldAdmin) {
	let adminAccount = <any>await getAdminAccountId();
	console.log(`new admin ${newAdmin.address}`);
	let stoneCoin = <any>await getDeployedContracts('StoneCoin', projectAddress);
	console.log(`add project address ${projectAddress} owner role to ${newAdmin.address}`);
	await send(
		adminAccount.accountId,
		stoneCoin.options.address,
		stoneCoin.methods.addOwnership(newAdmin.address),
		adminAccount.privateKey,
		adminAccount.nonce
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 1, 'init');
	console.log(`remove project address ${projectAddress} owner role to ${oldAdmin.accountId}`);
	await send(
		adminAccount.accountId,
		stoneCoin.options.address,
		stoneCoin.methods.removeOwnership(oldAdmin.accountId),
		adminAccount.privateKey,
		adminAccount.nonce + 1
	);
	await updateNonceAdmin(parseInt(adminAccount.nonce) + 2, 'init');
}
