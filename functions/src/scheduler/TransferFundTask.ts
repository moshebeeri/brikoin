const admin = require('firebase-admin')
import {getDocument, getSignedOperation, getProject} from '../operations/utils'


export async function transferFundCondition(task) {
    let operation = <any> await getSignedOperation(task)
    let document = <any> await getDocument(operation)
    console.log(`Testing transfer condition ${JSON.stringify(document)}`)
    if (document.signedDocument) {
        return true

    }
    return false

}

export async function autoTrusteeDemo(operation, task){
    let project = <any> await getProject(operation.project)
    console.log(`check if project demo ${project.demo}`)
    if(project.demo){
        console.log(`operation.type ${operation.type}`)
        switch (operation.type){
            case 'transferReserved':
                await transferReserved(operation, task)
                break;
            case 'transferFirstPayment':
                console.log(`running transferFirstPayment`)
                await transferFirstPayment(operation, task)
                break;
        }
    }

}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

async function transferReserved(operation, task){
    let db = admin.database()
    await db.ref(`server/operations/events/reserveAndDeposit/`).push({
        active: true,
        userId: task.signUser,
        projectAddress: operation.project,
        pendingOrderId: operation.orderId
    })

    await db.ref(`server/operations/events/triggerReserveAndDeposit/`).update({
        time: new Date().getTime()
    })

}

async function transferFirstPayment(operation, task){
    let db = admin.database()
    console.log(`add new approveFundDeposit task ${JSON.stringify({
        active: true,
        userId: task.signUser,
        projectAddress: operation.project,
        pendingOrderId: operation.orderId
    })}`)
    await db.ref(`server/operations/events/approveFundDeposit/`).push({
        active: true,
        userId: task.signUser,
        projectAddress: operation.project,
        pendingOrderId: operation.orderId
    })

    await db.ref(`server/operations/events/triggerApproveFundDeposit/`).update({
        time: new Date().getTime()
    })

    await delay(15000)
    // approve order
    await db.ref(`server/operations/events/approvePendingOrder/`).push({
        active: true,
        userId: task.signUser,
        projectAddress: operation.project,
        pendingOrderId: operation.orderId
    })

    await db.ref(`server/operations/events/triggerApprovePendingOrder/`).update({
        time: new Date().getTime()
    })

}

export async function transferFundRun(task) {
    let db = admin.database()
    let operation = <any> await getSignedOperation(task)
    await db.ref(`server/operationHub/${task.signUser}/operations/${task.signOperation}`).update({
        status: 'operationDone',
    })

    await db.ref(`server/operations/events/syncCase/`).push({
        active: true,
        user: task.signUser,
        project: operation.project,
    })

    await db.ref(`server/operations/events/syncCaseTrigger/`).update({
        time: new Date().getTime()
    })

    await sendMailToTrustee(task)
    await autoTrusteeDemo(operation, task)
}

async function sendMailToTrustee(task){

}
