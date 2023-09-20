const admin = require('firebase-admin')
import {getUserActiveAccount} from '../operations/utils'


export async function trusteeNotificationCondition(task) {

    return true


}


export async function trusteeNotificationRun(task) {
    let userAccount = <any> await getUserActiveAccount(task.trustee)
    let mail = {
        active: true,
        params: {
            name: userAccount.name
        },
        template: 'project.investment.trustee.notification',
        to: userAccount.email
    }
    let db = admin.database()
    await db.ref(`server/operations/events/sendEmail/`).push(mail)
    await db.ref(`server/operations/events/sendMailTrigger/`).update({time: new Date().getTime()})

}
