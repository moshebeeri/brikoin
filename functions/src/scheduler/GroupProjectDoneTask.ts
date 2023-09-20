import {
	addNotificationWithParams,
	getGroup,
	getMemberOrder,
	getProject,
	getProjectGroups,
	getUserActiveAccount
} from '../operations/utils';

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const admin = require('firebase-admin');

export async function triggerGroupDoneCondition(task) {
	let group = <any>await getGroup(task.groupId);
	if (!group.active) {
		return true;
	}
	let orders = await Promise.all(
		Object.keys(group.members)
			.map((key) => <any>getMemberOrder(group.project, group.members[key], task.groupId))
			.filter((member) => member.order)
	);
	let reserved = orders.map((order) => (order.order.reserved ? 1 : 0)).reduce(reducer);
	if (reserved === Object.keys(group.members).length) {
		return true;
	}
	return false;
}

export async function triggerGroupDoneRun(task) {
	let group = <any>await getGroup(task.groupId);
	if (!group.active) {
		return;
	}
	let projectGroups = <any>await getProjectGroups(group.project, '', false);
	let otherGroups = projectGroups.filter((group) => group.id !== task.groupId);
	if (otherGroups.length > 0) {
		await Promise.all(otherGroups.map((group) => closeGroup(group.id)));
		await Promise.all(
			otherGroups.map(async (group) => {
				let orders = await Promise.all(
					Object.keys(group.members)
						.map((key) => <any>getMemberOrder(group.project, group.members[key], task.groupId))
						.filter((member) => member.order)
				);
				await Promise.all(orders.map((order) => cancelUserOrder(order.order)));
			})
		);
	}
}

async function closeGroup(group) {
	let db = admin.database();
	db.ref('server').child(`/groups/${group.id}`).set({
		active: false
	});
	return true;
}

async function cancelUserOrder(order) {
	let db = admin.database();
	db.ref('server').child(`/projects/pendingOrders/${order.project}/${order.key}`).set({
		active: false
	});
	await notifyUserCancel(order);
	if (order.reseved) {
		await notifyTrusteeCancel(order);
	}
}

async function notifyUserCancel(order) {
	await addNotificationWithParams(order.userId, 'investmentOrder', 'canceledProjectSold', {
		orderId: order.key,
		project: order.project
	});
	let project = <any>await getProject(order.project);
	let user = <any>await getUserActiveAccount(order.userId);
	await sendEmail(project, user.mail, order);
}

async function notifyTrusteeCancel(order) {
	let project = <any>await getProject(order.project);
	await addNotificationWithParams(project.trustee, 'investmentOrder', 'canceledProjectSold', {
		orderId: order.key,
		project: order.project
	});
}

async function sendEmail(project, email, order) {
	let mail = {
		active: true,
		params: {
			projectName: project.name,
			investment: parseInt(order.amount) * parseInt(order.price),
			reason: 'PROJECT SOLD'
		},
		template: 'investment.order.canceled',
		to: email
	};
	let db = admin.database();
	await db.ref(`server/operations/events/sendEmail/`).push(mail);
	await db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
	await db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
}
