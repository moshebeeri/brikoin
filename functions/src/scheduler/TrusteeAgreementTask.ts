const admin = require('firebase-admin')
import {getSignedOperation, getUserActiveAccount, addNotification} from '../operations/utils'


export async function trusteeAgreementCondition(task) {
    let operation = <any> await getSignedOperation(task)
    console.log(`trustee condition operation ${JSON.stringify(operation)}`)
    if (operation.type === 'signDocument' && operation.status === 'operationDone') {
        console.log('trusteeAgreementCondition return true')
        return true

    }
    return false


}

export async function trusteeAgreementRun(task) {
    let operation = <any> await getSignedOperation(task)
    await createFutureOperations(task, operation)
    await updateOrderSigned(operation.project, operation.orderId)
    await syncCase(task.signUser, operation.project)
    await sendMails(task)

}

async function sendMails(task) {
    let userAccount = <any> await getUserActiveAccount(task.trustee)
    let mail = {
        active: true,
        params: {
            name: userAccount.name
        },
        template: 'project.investment.trustee.usersign',
        to: userAccount.email
    }
    let db = admin.database()
    await db.ref(`server/operations/events/sendEmail/`).push(mail)
    await db.ref(`server/operations/events/sendMailTrigger/`).update({time: new Date().getTime()})

}

async function createFutureTasks(operationKey, task) {
    let db = admin.database()
    let newTask = {
        active: true,
        signOperation: operationKey,
        signUser: task.signUser,
        trustee: task.trustee,
        type: 'transferFund'
    }
    await db.ref(`server/operationHub/taskManager`).push(newTask)

}

async function updateOrderSigned(project, orderId){
    let db = admin.database()
    await db.ref(`server/projects/pendingOrders/${project}/${orderId}`).update({
        signedAgreement: true
    })
}

async function syncCase(user, project){
    let db = admin.database()
    await db.ref(`server/operations/events/syncCase/`).push({
        active: true,
        user: user,
        project: project
    })
    await db.ref(`server/operations/events/syncCaseTrigger/`).update({
       time: new Date().getTime()
    })
}


async function createFutureOperations(task, operation) {
    let db = admin.database()
    let documentId = await createTransferDocument(task, operation, 'transferReserved')
    let operationKey = await db.ref(`server/operationHub/${task.signUser}/operations/`).push({
        type: 'transferReserved',
        status: 'waiting',
        orderId: operation.orderId,
        document: documentId,
        project: operation.project,
        name: 'investment',
        time: new Date().getTime()
    }).key
    await createFutureTasks(operationKey, task)
    await addNotification(task.signUser, 'operation', 'transferReserved' )
    documentId = await createTransferDocument(task, operation, 'transferFirstPayment')
    let firstPaymentTransfer = await db.ref(`server/operationHub/${task.signUser}/operations/`).push({
        type: 'transferFirstPayment',
        status: 'waiting',
        orderId: operation.orderId,
        project: operation.project,
        document: documentId,
        name: 'investment',
        time: new Date().getTime(),
        dependsOn: operationKey
    }).key
    await createFutureTasks(firstPaymentTransfer, task)
    // documentId = await createTransferDocument(task, operation, 'transferSecondPayment')

    //
    // let secondPaymentTransfer = await db.ref(`server/operationHub/${task.signUser}/operations/`).push({
    //     type: 'transferSecondPayment',
    //     document: documentId,
    //     status: 'waiting',
    //     orderId: operation.orderId,
    //     project: operation.project,
    //     name: 'investment',
    //     date: new Date().getTime(),
    //     dependsOn: operationKey + ',' + firstPaymentTransfer
    // }).key
    // await createFutureTasks(secondPaymentTransfer, task)


}

async function createTransferDocument(task, operation, type) {
    let db = admin.database()
    return await db.ref(`server/legalDocuments/`).push({
        owner: task.signUser,
        project: operation.project,
        type: type,
        orderId: operation.orderId,
        users: {
            [task.trustee]: 'read'
        }
    }).key
}