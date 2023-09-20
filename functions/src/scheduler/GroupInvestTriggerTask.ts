import { getGroup, getMemberOrder, getProject } from '../operations/utils';

const admin = require('firebase-admin');
const reducer = (accumulator, currentValue) => accumulator + currentValue;

export async function triggerGroupInvestmentCondition(task) {
	let group = <any>await getGroup(task.groupId);
	if (!group.active) {
		return false;
	}
	let project = <any>await getProject(group.project);
	let orders = await Promise.all(
		Object.keys(group.members).map((key) => getMemberOrder(group.project, group.members[key], task.groupId))
	);
	let ordersSum = orders
		.map((order) => (order.order ? parseInt(order.order.amount) * parseInt(order.order.price) : 0))
		.reduce(reducer);
	console.log(`project target ${project.target} group investments sum ${ordersSum}`);
	if (parseInt(project.target) === ordersSum) {
		return true;
	}
	return false;
}

export async function triggerGroupInvestmentRun(task) {
	let group = <any>await getGroup(task.groupId);
	let project = <any>await getProject(group.project);
	await updateGroupFired(task.groupId);
	let orders = await Promise.all(
		Object.keys(group.members).map((key) => getMemberOrder(group.project, group.members[key], task.groupId))
	);
	await Promise.all(orders.map((order) => triggerUserProcessOrder(order.userId, project.address, order.order.key)));
	await createGroupProjectDoneTask(task);
}

async function triggerUserProcessOrder(userId, project, orderPendingId) {
	const db = admin.database();
	await db.ref('/server/operations/events/processOrderNow/').push({
		active: true,
		projectAddress: project,
		pendingOrderId: orderPendingId,
		userId: userId
	});
	await db.ref('/server/operations/events/triggerProcessOrderNow/').set({
		time: new Date().getTime()
	});
}
async function updateGroupFired(groupsId) {
	const db = admin.database();
	await db.ref(`/server/groups/${groupsId}/`).update({
		fired: true
	});
}

async function createGroupProjectDoneTask(task) {
	const db = admin.database();
	console.log(`createGroupProjectDoneTask creation`);

	let scheduleTask = {
		active: true,
		groupId: task.groupId,
		type: 'triggerGroupDone',
		time: new Date().getTime()
	};

	console.log(`createGroupProjectDoneTask Task : ${JSON.stringify(scheduleTask)}`);
	db.ref('server').child(`/operationHub/taskManager`).push(scheduleTask);
}
