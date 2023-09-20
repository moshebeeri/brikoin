const functions = require('firebase-functions');
const admin = require('firebase-admin');
import {
	getActiveRequest,
	getAdminAccount,
	getAdminAccountId,
	getCornerStone,
	updateNonceAdmin,
	getConfiguration,
	getAdminsIds
} from './utils';
import {
	addProjectDocument,
	addProjectRole,
	deployNewContractWithParams,
	getContractByName,
	getDeployedContracts,
	replaceAdmin,
	saveEntity,
	sendAdminTransactionWithGas,
	setProjectReserved,
	toBlockChainString
} from './wallet';

export async function duplicateProperty(propertyId) {
	let propery = await getPropertyAttributes(propertyId);
	propery['projectName'] = `copy Of ${propery['projectName']}`;
	propery['key'] = '';
	propery['approved'] = false;
	propery['reviewed'] = false;
	console.log(`new project ${JSON.stringify(propery)}`);
	let db = admin.database();
	let result = await db.ref('server').child('loadingProperties').push(propery);

	let newPropertyId = result.getKey();
	console.log(`newPropertyId : ${newPropertyId}`);
	await db.ref('server').child('loadingProperties').child(newPropertyId).update({
		projectId: newPropertyId,
		id: newPropertyId
	});
	return 'done';
}

export async function deleteProperty(propertyId, userId) {
	let property = <any>await getPropertyAttributes(propertyId);
	let isUserAdmin = await isAdmin(userId);
	if (property.userId === userId || isUserAdmin) {
		let db = admin.database();
		db.ref('server').child('loadingProperties/').child(propertyId).remove();
	}
	return 'done';
}

export async function propertyReviewed(propertyId, userId) {
	let property = <any>await getPropertyAttributes(propertyId);
	let isUserAdmin = await isAdmin(userId);
	console.log(`isUserAdmin ${isUserAdmin}`);
	console.log(`property user ${property.userId}`);
	if (isUserAdmin) {
		let db = admin.database();
		db.ref('server').child('loadingProperties/').child(propertyId).update({ reviewed: true });
	}
	return 'done';
}

export async function propertyApproved(propertyId, userId) {
	let property = <any>await getPropertyAttributes(propertyId);
	let isUserAdmin = await isAdmin(userId);
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
}
exports.assignProjectToParentEvent = functions.database
	.ref(`server/operations/events/loadingPropertiesSyncTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let request = <any>await getActiveRequest('loadingPropertiesSync');
		if (request) {
			console.log(`request  ${JSON.stringify(request)}`);
			let propery = <any>await getPropertyAttributes(request.propertyId);
			console.log(`propery ${JSON.stringify(propery)}`);
			if (propery.parentProject) {
				await assignProjectToParent(propery.parentProject, request.propertyId);
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
	});

export async function assignProjectToParent(parentId, projectId) {
	console.log(`parentId ${JSON.stringify(parentId)} projectId ${JSON.stringify(projectId)}`);
	let propery = await getPropertyAttributes(parentId);
	console.log(`propery ${JSON.stringify(propery)}`);
	let projects = <any>propery['projects'];
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
}

export async function getLoadingProjects(userId) {
	let isAdminUser = await isAdmin(userId);
	if (isAdminUser) {
		return new Promise((resolve, reject) => {
			let db = admin.database();
			try {
				db.ref('server').child('loadingProperties').once('value', function(snapshot) {
					let results = snapshot.val();
					if (results) {
						let result = Object.keys(results).map((key) => {
							let property = results[key];
							property.key = key;
							return property;
						});
						resolve(result);
					} else {
						resolve([]);
					}
				});
			} catch (error) {
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
				.once('value', function(snapshot) {
					let results = snapshot.val();
					if (results) {
						let result = Object.keys(results).map((key) => {
							let property = results[key];
							property.key = key;
							return property;
						});
						resolve(result);
					} else {
						resolve([]);
					}
				});
		} catch (error) {
			reject(error);
		}
	});
}

async function isAdmin(userId) {
	let admins = <any>await getAdminsIds();
	let adminsIds = Object.keys(admins);
	return adminsIds.includes(userId);
}
async function saveEstimation(estimation) {
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
}

async function saveProperty(property) {
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
}

async function saveRegistrar(registrar) {
	let db = admin.database();
	if (registrar) {
		let registrarAddress = new Date().getTime();
		console.log('SAVING to BLOCKCHAIN DONE');
		console.log(registrarAddress);
		registrar.address = registrarAddress;
		db.ref('server').child('projectsCollections/registrars').push(registrar);
		return registrar;
	}
}

async function saveTrustee(trustee) {
	let db = admin.database();

	let trusteeAddress = new Date().getTime();
	trustee.address = trusteeAddress;
	db.ref('server').child('projectsCollections/trustees').push(trustee);
	return trustee;
}

async function saveTerms(term) {
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
}

async function saveManager(manager) {
	let db = admin.database();

	let managerAddress = new Date().getTime();
	manager.address = managerAddress;
	db.ref('server').child('projectsCollections/managers').push(manager);
	return manager;
}

async function createAssetManager(manager, estimation, registrar, trustee, terms, property) {
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

	let adminAccountId = <any>await getAdminAccountId();
	let assetManagerAddress = await saveEntity('AssetManager', adminAccountId, assetManager);
	assetManagerObject.address = assetManagerAddress;
	await db.ref('server').child('projectsCollections/assetManagers').push(assetManagerObject);

	if (manager.user) {
		await addProjectRole(assetManagerAddress, 'MANAGER', manager.user);
		await addProjectDocument(assetManagerAddress, 'MANAGER', manager.pdfMd5);
	}
	if (estimation.urlMD5) {
		await addProjectDocument(assetManagerAddress, 'ESTIMATION', estimation.urlMD5);
	}
	if (registrar.pdfMd5) {
		await addProjectDocument(assetManagerAddress, 'REGISTRAR', registrar.pdfMd5);
	}
	if (trustee.user) {
		await addProjectRole(assetManagerAddress, 'TRUSTEE', trustee.user);
		await addProjectDocument(assetManagerAddress, 'TRUSTEE', trustee.pdfMd5);
	}
	if (terms.pdfMd5) {
		await addProjectDocument(assetManagerAddress, 'TERMS', terms.pdfMd5);
	}
	if (property.pdfMd5) {
		await addProjectDocument(assetManagerAddress, 'RENT', property.rentMd5);
	}

	return assetManagerAddress;
}

async function createProject(assetManager, project) {
	let adminAccountId = <any>await getAdminAccountId();
	let adminProject = <any>await getAdminAccount('project');
	let cornerStone = await getCornerStone();
	const db = admin.database();

	project.timestamp = new Date().getTime();
	project.assetManager = assetManager;

	const result = {
		_name: toBlockChainString(''),
		_symbol: toBlockChainString(project.symbol),
		_target: project.target ? project.target : 1,
		_startTimestamp: project.startTimestamp,
		_durationSeconds: project.durationSeconds,
		_assetManager: assetManager,
		_url: toBlockChainString('0'),
		_urlMD5: toBlockChainString('0'),
		_signDocument: false,
		_minBulkSize: 1
	};
	let configuration = await (<any>getConfiguration());

	console.log('result: ' + JSON.stringify(result));
	let projectAddress = <any>await createNewProject(adminAccountId, cornerStone, result, adminProject.accountId);
	console.log('projectAddress: ' + projectAddress.address);
	console.log('Admin nonce: ' + projectAddress.nonce);
	if (configuration.useBlockchain) {
		await updateNonceAdmin(projectAddress.nonce, 'init');
		await setProjectReserved(
			adminProject.accountId,
			adminProject.privateKey,
			adminProject.nonce,
			projectAddress.address,
			parseInt(project.reservedBid)
		);
		console.log('adminProject nonce: ' + adminProject.nonce);
		await updateNonceAdmin(parseInt(adminProject.nonce) + 1, 'project');
	}
	if (project.tradeMethod === 'auction') {
		let dueDate = new Date();
		dueDate.setMonth(dueDate.getMonth() + project.tradeDurationMonth);
		const auctionRef = await db.ref('server').child('projects').child('events').child('auctionOrdersRequest');
		auctionRef.push({
			state: 'initial',
			projectId: projectAddress.address,
			active: true,
			type: 'english',
			dueDate: dueDate.getTime()
		});
	}
	const ref = await db.ref('server').child('operations').child('project').child('initialOffer');
	const initialOffer = {
		amount: parseInt(project.target),
		executed: false,
		name: project.name,
		projectId: projectAddress.address,
		userId: 'admin'
	};
	await ref.push(initialOffer);
	project.address = projectAddress.address;
	console.log(JSON.stringify(project));
	let refernce = await db.ref('server').child('projectsCollections/projects').push(project);
	let id = await refernce.getKey();
	project.id = id;
	return project;
}

async function createNewProject(adminAccount, cornerStone, parameters, projectOwner) {
	let configuration = <any>await getConfiguration();
	if (!configuration.useBlockchain) {
		return { address: new Date().getTime(), nonce: 0 };
	}
	let nonce = parseInt(adminAccount.nonce);
	console.log('admin Nonce ' + nonce);
	let stoneCoinMortgage = await deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		getContractByName('StoneCoinMortgage'),
		null,
		nonce
	);
	let stoneCoinMortgageContract = await getDeployedContracts('StoneCoinMortgage', stoneCoinMortgage);
	let stoneCoinMortgageOwner = await stoneCoinMortgageContract.methods.owner().call({ from: adminAccount.accountId });

	console.log('stoneCoinMortgageOwner: ' + stoneCoinMortgageOwner);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	let stoneCoinMortgageStorageAddress = await deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		getContractByName('StoneCoinMortgageStorage'),
		null,
		nonce
	);
	let stoneCoinMortgageStorage = await getDeployedContracts(
		'StoneCoinMortgageStorage',
		stoneCoinMortgageStorageAddress
	);

	let stoneCoinMortgageStoragewner = await stoneCoinMortgageStorage.methods
		.owner()
		.call({ from: adminAccount.accountId });

	console.log('stoneCoinMortgageStoragewner: ' + stoneCoinMortgageStoragewner);
	console.log('adminAccount: ' + adminAccount.accountId);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinMortgageContract.options.address,
		stoneCoinMortgageContract.methods.setStoneCoinMortgageStorage(stoneCoinMortgageStorageAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	let stoneCoinMortgageAddress = await stoneCoinMortgageContract.methods
		.getAddress()
		.call({ from: adminAccount.accountId });
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinMortgageStorage.options.address,
		stoneCoinMortgageStorage.methods.addOwnership(stoneCoinMortgageAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	let stoneCoinAddress = await deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		getContractByName('StoneCoin'),
		parameters,
		nonce
	);
	let stoneCoinContract = await getDeployedContracts('StoneCoin', stoneCoinAddress);

	let owner = await stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });

	console.log('owner: ' + owner);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	let stoneCoinStorageAddress = await deployNewContractWithParams(
		adminAccount.accountId,
		adminAccount.privateKey,
		getContractByName('StoneCoinStorage'),
		null,
		nonce
	);
	let stoneCoinStorage = await getDeployedContracts('StoneCoinStorage', stoneCoinStorageAddress);

	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	console.log('base address ' + cornerStone.cornerBaseAddress);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.setStoneCoinStorageAddress(stoneCoinStorageAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.addOwnership(cornerStone.cornerBaseAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.addOwnership(projectOwner),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinStorage.options.address,
		stoneCoinStorage.methods.addOwnership(stoneCoinAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinMortgageContract.options.address,
		stoneCoinMortgageContract.methods.addOwnership(stoneCoinAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.setStoneCoinMortgageAddress(stoneCoinMortgageAddress),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('admin Nonce ' + nonce);
	console.log('OWNER address: ' + adminAccount.accountId);

	console.log('BEFore INIT');
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.setOwner(projectOwner),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('nonce' + nonce);

	owner = await stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });

	console.log('owner: ' + owner);
	await sendAdminTransactionWithGas(
		adminAccount.accountId,
		stoneCoinContract.options.address,
		stoneCoinContract.methods.init(),
		adminAccount.privateKey,
		nonce
	);
	nonce = nonce + 1;
	console.log('nonce' + nonce);

	// let contract = this.getDeployedContracts('CornerStone', adminAccount.cornerStoneAddress)
	// console.log('nonce' + nonce)
	// await this.send(adminAccount.accountId, contract.options.address, contract.methods.initialAskAdmin(adminAccount.accountId, stoneCoinAddress, parameters._target), adminAccount.privateKey, nonce)
	// nonce = nonce + 1

	let balanceOfAdmin = await stoneCoinContract.methods
		.balanceOf(adminAccount.accountId)
		.call({ from: adminAccount.accountId });
	console.log('ADMIN BALANCE: ' + balanceOfAdmin);
	console.log('nonce' + nonce);
	owner = await stoneCoinContract.methods.owner().call({ from: adminAccount.accountId });

	console.log('owner: ' + owner);
	return { address: stoneCoinAddress, nonce: nonce };
}

export async function getPropertyAttributes(requestKey) {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db.ref('server').child('loadingProperties').child(requestKey).once('value', function(snapshot) {
				let result = snapshot.val();
				result.key = requestKey;
				resolve(result);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function getParentProjects() {
	return new Promise((resolve, reject) => {
		let db = admin.database();
		try {
			db
				.ref('server')
				.child('loadingProperties')
				.orderByChild('type')
				.equalTo('parentProject')
				.once('value', function(snapshot) {
					let results = snapshot.val();
					if (results) {
						let result = Object.keys(results).map((key) => {
							let property = results[key];
							property.key = key;
							return property;
						});
						resolve(result.filter((property) => !property.approved));
					} else {
						resolve([]);
					}
				});
		} catch (error) {
			reject(error);
		}
	});
}

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

async function createManager(propertyAttributes) {
	return {
		urlCode: propertyAttributes.managementUrlCode || '',
		pdf:
			propertyAttributes.officials &&
			propertyAttributes.officials.management &&
			propertyAttributes.officials.management.document
				? propertyAttributes.officials.management.document
				: '',
		pdfMd5:
			propertyAttributes.officials &&
			propertyAttributes.officials.management &&
			propertyAttributes.officials.management.documentMd5
				? propertyAttributes.officials.management.documentMd5
				: '',
		role:
			propertyAttributes.officials &&
			propertyAttributes.officials.management &&
			propertyAttributes.officials.management.role
				? propertyAttributes.officials.management.role
				: '',
		user:
			propertyAttributes.officials &&
			propertyAttributes.officials.management &&
			propertyAttributes.officials.management.user
				? propertyAttributes.officials.management.user
				: ''
	};
}

async function createRegistrar(propertyAttributes) {
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
}

async function createEstimation(propertyAttributes) {
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
}

async function createTrustee(propertyAttributes) {
	return {
		pdf:
			propertyAttributes.officials &&
			propertyAttributes.officials.TRUSTEE &&
			propertyAttributes.officials.TRUSTEE.document
				? propertyAttributes.officials.TRUSTEE.document
				: '',
		pdfMd5:
			propertyAttributes.officials &&
			propertyAttributes.officials.TRUSTEE &&
			propertyAttributes.officials.TRUSTEE.documentMd5
				? propertyAttributes.officials.TRUSTEE.documentMd5
				: '',
		role:
			propertyAttributes.officials &&
			propertyAttributes.officials.TRUSTEE &&
			propertyAttributes.officials.TRUSTEE.role
				? propertyAttributes.officials.TRUSTEE.role
				: '',
		user:
			propertyAttributes.officials &&
			propertyAttributes.officials.TRUSTEE &&
			propertyAttributes.officials.TRUSTEE.user
				? propertyAttributes.officials.TRUSTEE.user
				: ''
	};
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
		trustee:
			propertyAttributes.officials && propertyAttributes.officials.TRUSTEE
				? {
						user: propertyAttributes.officials.TRUSTEE.user,
						features: propertyAttributes.officials.TRUSTEE.officialsFeatures
							? propertyAttributes.officials.TRUSTEE.officialsFeatures
							: ''
					}
				: '',
		management:
			propertyAttributes.officials && propertyAttributes.officials.management
				? {
						user: propertyAttributes.officials.management.user,
						features: propertyAttributes.officials.management.officialsFeatures
							? propertyAttributes.officials.management.officialsFeatures
							: ''
					}
				: '',
		mortgagee:
			propertyAttributes.officials && propertyAttributes.officials.mortgagee
				? {
						user: propertyAttributes.officials.mortgagee.user,
						features: propertyAttributes.officials.mortgagee.officialsFeatures
							? propertyAttributes.officials.mortgagee.officialsFeatures
							: ''
					}
				: '',
		appraisal:
			propertyAttributes.officials && propertyAttributes.officials.appraisal
				? {
						user: propertyAttributes.officials.appraisal.user,
						features: propertyAttributes.officials.appraisal.officialsFeatures
							? propertyAttributes.officials.appraisal.officialsFeatures
							: ''
					}
				: '',
		constraction:
			propertyAttributes.officials && propertyAttributes.officials.CONSTRUCTION
				? {
						user: propertyAttributes.officials.CONSTRUCTION.user,
						features: propertyAttributes.officials.CONSTRUCTION.officialsFeatures
							? propertyAttributes.officials.CONSTRUCTION.officialsFeatures
							: ''
					}
				: '',
		entrepreneur:
			propertyAttributes.officials && propertyAttributes.officials.ENTREPRENEUR
				? {
						user: propertyAttributes.officials.ENTREPRENEUR.user,
						features: propertyAttributes.officials.ENTREPRENEUR.officialsFeatures
							? propertyAttributes.officials.ENTREPRENEUR.officialsFeatures
							: ''
					}
				: '',
		projectBank:
			propertyAttributes.officials && propertyAttributes.officials.BANK
				? {
						user: propertyAttributes.officials.BANK.user,
						features: propertyAttributes.officials.BANK.officialsFeatures
							? propertyAttributes.officials.BANK.officialsFeatures
							: ''
					}
				: '',
		projectLawyer:
			propertyAttributes.officials && propertyAttributes.officials.LAWYER
				? {
						user: propertyAttributes.officials.LAWYER.user,
						features: propertyAttributes.officials.LAWYER.officialsFeatures
							? propertyAttributes.officials.LAWYER.officialsFeatures
							: ''
					}
				: '',
		projectMarketing:
			propertyAttributes.officials && propertyAttributes.officials.MARKETING
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
	.onWrite(async (change, context) => {
		let db = admin.database();
		let request = <any>await getActiveRequest('loadProject');

		console.log('START Loading   Project Request');
		if (request && request.key) {
			let propertyAttributes = <any>await getPropertyAttributes(request.projectRequestId);
			console.log(`projectype is ${propertyAttributes.projectType}`);
			if (propertyAttributes) {
				console.log(propertyAttributes);
				console.log('LOADING TERMS');
				let terms = await saveTerms(createTerm(propertyAttributes));
				console.log('FINSH TERMS LOADING ' + terms);
				console.log('LOADING MANAGER');
				let manager = await saveManager(await createManager(propertyAttributes));
				console.log('FINISH LOADING MANAGER ' + manager);
				console.log('LOADING Registrar');
				let registrar = await saveRegistrar(await createRegistrar(propertyAttributes));
				console.log('FINISH LOADING REGISTRAR ' + registrar);
				console.log('LOADING Estimation');
				let estimation = await saveEstimation(await createEstimation(propertyAttributes));
				console.log('FINISH LOADING ESTIMATION ' + estimation);
				console.log('LOADING TRUSTEE');
				let trustee = await saveTrustee(await createTrustee(propertyAttributes));
				console.log('FINISH LOADING TRUSTEE ' + estimation);
				console.log('LOADING PROPERTY');
				let property = await saveProperty(
					createProperty(manager, estimation, registrar, trustee, propertyAttributes)
				);
				console.log('FINISH LOADING PROPERTY ' + estimation);
				console.log('LOADING ASSET MANAGER');
				let assetManager = await createAssetManager(manager, estimation, registrar, trustee, terms, property);
				console.log('FINISH LOADING ASSET MANAGER ' + assetManager);
				let project = await createProject(assetManager, createProjectObject(propertyAttributes, assetManager));
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
	});

function updateSubProject(parentId, projects) {
	let db = admin.database();
	if (projects && Object.keys(projects).length > 0) {
		Object.keys(projects).forEach(async (key) => {
			let propertyAttributes = <any>await getPropertyAttributes(projects[key].project);
			let projectId = propertyAttributes.projectId;
			if (projectId) {
				db.ref('server').child('projectsCollections/projects').child(projectId).update({
					parentProjectId: parentId
				});
			}
		});
	}
}

exports.replaceAdmin = functions
	.runWith(runtimeOpts)
	.database.ref(`server/operations/events/replaceAdminTrigger`)
	.onWrite(async (change, context) => {
		let db = admin.database();
		let request = <any>await getActiveRequest('replaceAdmin');
		if (request && request.key) {
			let newAdmin = <any>await replaceAdmin(request.admin);
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
	});
