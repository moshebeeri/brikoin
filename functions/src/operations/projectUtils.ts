import { getUserActiveAccount, getProject, getPendingOrderById, getConfiguration } from './utils';
const admin = require('firebase-admin');

export async function sendEmailToLawyer(lawyerId, userId, projectAddress, orderId, side) {
	let userAccount = <any>await getUserActiveAccount(userId);
	let project = <any>await getProject(projectAddress);
	let order = <any>await getPendingOrderById(orderId, projectAddress, '');
	console.log(`order : ${JSON.stringify(order)}`);
	let configuration = <any>await getConfiguration();
	let lawyerAccount = <any>await getUserActiveAccount(lawyerId);
	console.log(`: parseInt(order.amount) ${parseInt(order.amount)}`);
	console.log(`parseInt(order.price ? order.price : 1) ${parseInt(order.price ? order.price : 1)}`);

	sendEmail(
		project,
		`${configuration.env}/projectsView/${projectAddress}`,
		lawyerAccount.email,
		userAccount.phoneNumber || '',
		userAccount.name,
		order,
		side,
		lawyerAccount.name
	);
}

async function sendEmail(project, projectLink, email, userPhone, userName, order, side, lwayerName) {
	console.log(`: parseInt(order.amount) ${parseInt(order.amount)}`);
	console.log(`parseInt(order.price ? order.price : 1) ${parseInt(order.price ? order.price : 1)}`);

	let mail = {
		active: true,
		params: {
			lwayerName: lwayerName,
			projectName: project.name,
			projectLink: projectLink,
			userPhone: userPhone,
			side: side,
			userName: userName,
			investment: parseInt(order.amount) * parseInt(order.price ? order.price : 1)
		},
		template: 'investment.order.chooseLawyer',
		to: email
	};
	console.log(`EMAIL: ${JSON.stringify(mail)}`);
	let db = admin.database();
	await db.ref(`server/operations/events/sendEmail/`).push(mail);
	await db.ref(`server/operations/events/sendMailTrigger/`).update({ time: new Date().getTime() });
	await db.ref(`server/monitor/email/`).update({ lastSendingTime: new Date().getTime() });
}
