const admin = require('firebase-admin')
import {getOrCreateKycDocument, getOrCreateKycOperation} from '../operations/utils'

export async function mortgageRequestCondition(task) {
    return true

}

export async function montageRequestRun(task) {
    let kyc = <any> await getOrCreateKycDocument(task.userId, task.mortgagee)
    await getOrCreateKycOperation(task.userId, kyc)
    await createUserMortgageKYCTask(task)
}

async function createUserMortgageKYCTask(task) {
    let db = admin.database()
    let newTask = {
        active: true,
        mortgagee: task.mortgagee,
        userId: task.userId,
        project: task.project,
        mortgageConditionAddress: task.mortgageConditionAddress,
        mortgageRequestAddress: task.mortgageRequestAddress,
        mortgageId: task.mortgageId,
        mortgageRequestId: task.mortgageRequestId,
        type: 'mortgageCheckKyc'
    }
    await db.ref(`server/operationHub/taskManager`).push(newTask)
}

