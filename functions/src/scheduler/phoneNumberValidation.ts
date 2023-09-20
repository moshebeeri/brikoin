import { getSmsValidation } from '../operations/utils';

import { getUserIdByRole } from './FlowManagerUtils';
export async function validatePhoneNumber(step, flow) {
	let userId = await getUserIdByRole(step.userRole, flow.order, flow.project);
	let smsValidation = await (<any>getSmsValidation(userId));
	return { done: smsValidation ? smsValidation.validation === 'success' : false };
}
