import { getUserKycOperation } from '../operations/utils';

import { getUserIdByRole } from './FlowManagerUtils';
export async function validateKycWorker(step, flow) {
	let userId = await getUserIdByRole(step.userRole, flow.order, flow.project);
	let kycOperation = <any>await (<any>getUserKycOperation(userId));
	return { done: kycOperation ? kycOperation.status === 'operationDone' : false };
}
