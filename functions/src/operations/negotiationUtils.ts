import { updatePendingOrder, updateOperationDone, addNotificationWithParams, getOperationByid } from './utils';
const admin = require('firebase-admin');

export async function sendOffer(operation, offer, userId) {
	let db = admin.database();
	let offerRequest = {
		active: true,
		time: new Date().getTime(),
		amount: offer,
		side: operation.side,
		userId: userId
	};
	if (validateRequest(userId, offerRequest, operation)) {
		await db.ref('server').child(`/negotiation/${operation.flowInstance}`).push(offerRequest);
		await addNotificationWithParams(userId, 'negotiation', 'offerSended', {
			project: operation.project,
			flowId: operation.flowInstance
		});
		await addNotificationWithParams(operation.seller, 'negotiation', 'offerAccepted', {
			project: operation.project,
			flowId: operation.flowInstance
		});
		return 'DONE';
	}
	return 'FAILED';
}

export async function approveOffer(operation, offerId, userId) {
	let db = admin.database();
	let offer = <any>await getOfferById(operation.flowInstance, offerId);
	if (await validateRequest(userId, offer, operation)) {
		await db.ref('server').child(`/negotiation/${operation.flowInstance}/${offerId}`).update({
			active: false,
			time: new Date().getTime(),
			status: 'APPROVED'
		});
		await updatePendingOrder(
			{
				active: true,
				status: 'APPROVED',
				project: operation.project,
				investPrice: offer.investPrice || 1,
				investAmount: offer.amount
			},
			operation.buyer || userId
		);

		let buyerOperation =
			operation.side === 'BUYER'
				? operation
				: <any>await getOperationByUser('simpleNegotiation', operation.buyer, operation.flowInstance);
		console.log(`buyerOperation ${JSON.stringify(buyerOperation)}`);

		await addNotificationWithParams(buyerOperation.userId, 'negotiation', 'offerApproved', {
			project: buyerOperation.project,
			flowId: operation.flowInstance
		});
		let sellerOperation =
			operation.side === 'SELLER'
				? operation
				: <any>await getOperationByUser('simpleNegotiation', operation.seller, operation.flowInstance);
		await addNotificationWithParams(sellerOperation.userId, 'negotiation', 'offerApproved', {
			project: sellerOperation.project,
			flowId: operation.flowInstance
		});
		console.log(`sellerOperation ${JSON.stringify(sellerOperation)}`);
		await updateOperationDone(
			{
				id: buyerOperation.id,
				operationId: operation.side === 'BUYER' ? operation.operationId : operation.buyerOperationId,
				flowInstance: operation.flowInstance
			},
			operation.side === 'BUYER' ? userId : operation.buyer
		);
		await updateOperationDone(
			{
				id: sellerOperation.id,
				operationId: operation.side === 'SELLER' ? operation.operationId : operation.sellerOperationId,
				flowInstance: operation.flowInstance
			},
			operation.side === 'SELLER' ? userId : operation.seller
		);
	}
}

async function getOperationByUser(operationType, userId, flowInstanceId) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db
				.ref('server')
				.child(`/operationHub/${userId}/operations`)
				.orderByChild('type')
				.equalTo(operationType)
				.once('value', function(snapshot) {
					let results = snapshot.val();
					let operations = Object.keys(results)
						.map((key) => {
							let offer = results[key];
							offer.id = key;
							return offer;
						})
						.filter(
							(operation) => operation.status === 'waiting' && operation.flowInstance === flowInstanceId
						);
					resolve(operations.length > 0 ? operations[0] : '');
				});
		} catch (error) {
			reject(error);
		}
	});
}
async function validateRequest(userId, offer, operation) {
	let operationFromDb = <any>await getOperationByid(userId, operation.id);
	if (offer.side === 'BUYER') {
		return operationFromDb.side === 'SELLER' && offer.userId === operationFromDb.buyer;
	}
	if (offer.side === 'SELLER') {
		return operationFromDb.side === 'BUYER' && offer.userId === operationFromDb.seller;
	}
	return false;
}

export async function getOfferById(flowInstance, offerId) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child(`/negotiation/${flowInstance}/${offerId}`).once('value', function(snapshot) {
				let result = snapshot.val();
				result.id = offerId;
				resolve(result);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function getOffers(operation, userId) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db.ref('server').child(`/negotiation/${operation.flowInstance}/`).once('value', function(snapshot) {
				let results = snapshot.val();
				if (results) {
					let offers = Object.keys(results).map((key) => {
						let offer = results[key];
						offer.id = key;
						return offer;
					});
					resolve(offers);
					return;
				}
				resolve([]);
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function getActiveOffers(operation) {
	let db = admin.database();
	return new Promise((resolve, reject) => {
		try {
			db
				.ref('server')
				.child(`/negotiation/${operation.flowInstance}/`)
				.orderByChild('active')
				.equalTo(true)
				.once('value', function(snapshot) {
					let results = snapshot.val();
					let offers = Object.keys(results).map((key) => {
						let offer = results[key];
						offer.id = key;
						return offer;
					});
					resolve(offers);
				});
		} catch (error) {
			reject(error);
		}
	});
}

export async function rejectOffer(operation, offerId, userId) {
	let db = admin.database();
	let offer = <any>await getOfferById(operation.flowInstance, offerId);
	if (await validateRequest(userId, offer, operation)) {
		await db.ref('server').child(`/negotiation/${operation.flowInstance}/${offerId}`).update({
			active: false,
			time: new Date().getTime(),
			status: 'REJECTED'
		});
		await updatePendingOrder(
			{
				project: operation.project,
				active: false,
				status: 'REJECTED',
				price: '',
				investAmount: ''
			},
			operation.buyer || userId
		);
		let buyerOperation =
			operation.side === 'BUYER'
				? operation
				: <any>await getOperationByUser('simpleNegotiation', operation.buyer, operation.flowInstance);

		console.log(`buyerOperation ${JSON.stringify(buyerOperation)}`);
		await addNotificationWithParams(buyerOperation.userId, 'negotiation', 'offerRejected', {
			project: buyerOperation.project,
			flowId: operation.flowInstance
		});
		let sellerOperation =
			operation.side === 'SELLER'
				? operation
				: <any>await getOperationByUser('simpleNegotiation', operation.seller, operation.flowInstance);

		await addNotificationWithParams(sellerOperation.userId, 'negotiation', 'offerRejected', {
			project: sellerOperation.project,
			flowId: operation.flowInstance
		});
		console.log(`sellerOperation ${JSON.stringify(sellerOperation)}`);
		await updateOperationDone(
			{
				id: buyerOperation.id,
				operationId: operation.side === 'BUYER' ? operation.operationId : operation.buyerOperationId,
				flowInstance: operation.flowInstance
			},
			operation.side === 'BUYER' ? userId : operation.buyer
		);
		await updateOperationDone(
			{
				id: sellerOperation.id,
				operationId: operation.side === 'SELLER' ? operation.operationId : operation.sellerOperationId,
				flowInstance: operation.flowInstance
			},
			operation.side === 'SELLER' ? userId : operation.seller
		);
	}
}

export async function counterOffer(operation, offer, userId) {
	let db = admin.database();
	let offerRequest = {
		active: true,
		time: new Date().getTime(),
		amount: offer,
		price: 1,
		side: operation.side,
		userId: userId
	};
	if (validateRequest(userId, offerRequest, operation)) {
		await updateAllOffersInActive(operation);
		await addNotificationWithParams(userId, 'negotiation', 'offerSended', {
			project: operation.project,
			flowId: operation.flowInstance
		});
		await addNotificationWithParams(operation.seller || operation.buyer, 'negotiation', 'offerAccepted', {
			project: operation.project,
			flowId: operation.flowInstance
		});
		await db.ref('server').child(`/negotiation/${operation.flowInstance}`).push(offerRequest);
		return 'DONE';
	}
	return 'FAILED';
}

async function updateAllOffersInActive(operation) {
	let offers = <any>await getActiveOffers(operation);
	if (offers && offers.length > 0) {
		let db = admin.database();
		await asyncForEach(offers, async (element) => {
			await db
				.ref('server')
				.child(`/negotiation/${operation.flowInstance}/${element.id}`)
				.update({ active: false });
		});
	}
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
}
