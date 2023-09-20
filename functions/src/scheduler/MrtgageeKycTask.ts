const admin = require('firebase-admin')
import {getKycDocument, getUserActiveAccount, getOpenHoursOperation, addNotification, scheduleVideoMeeting} from '../operations/utils'


export async function mortgageeKycCondition(task) {
    let kyc = <any> await getKycDocument(task.userId, task.mortgagee)
    return kyc && kyc.signedDocument ? true : false
}


export async function mortgageeKycRun(task) {
    let db = admin.database()
    let kyc = <any> await getKycDocument(task.userId, task.mortgagee)



    db.ref('server').child(`/operationHub/${task.mortgagee}/operations`).push({
        type: 'mortgageRequest',
        mortgageRequestId: task.mortgageRequestId,
        mortgageId: task.mortgageId,
        mortgageConditionAddress: task.mortgageConditionAddress,
        mortgageRequestAddress: task.mortgageRequestAddress,
        kyc: kyc.key,
        project: task.project,
        userId: task.userId,
        status: 'waiting',
        name: 'ApproveMortgage',
        time: new Date().getTime()

    })
    await addNotification(task.mortgagee,'operation','ApproveMortgage')

    await scheduleVideoMeeting(task.mortgagee, task.userId, task.project, false)



    // await sendMails(task)
}


async function sendMails(task) {
    let userAccount = <any> await getUserActiveAccount(task.mortgagee)
    let mail = {
        active: true,
        params: {
            name: userAccount.name
        },
        template: 'project.mortgage.mortgagee.notification',
        to: userAccount.email
    }
    let db = admin.database()
    await db.ref(`server/operations/events/sendEmail/`).push(mail)
    await db.ref(`server/operations/events/sendMailTrigger/`).update({time: new Date().getTime()})

}