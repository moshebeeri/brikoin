const admin = require('firebase-admin')
import {getUserActiveAccount} from '../operations/utils'

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export async function reminderTasktCondition(task) {
    let now = new Date().getTime()
    if (task.reminderTime - now < FIFTEEN_MINUTES && !task.remindedFifteen) {
        return true

    }
    if (task.reminderTime - now < TEN_MINUTES && !task.remindedTen) {
        return true

    }

    if (task.reminderTime - now < FIVE_MINUTES) {
        return true

    }
    return false


}

export async function reminderRun(task) {
    if(!task.remindedFifteen) {
        await sendMails(task.operationUserId, 15)
        await sendMails(task.userId, 15)
        await createReminderTask(task, true, false)
        return
    }

    if(!task.remindedTen) {
        await sendMails(task.operationUserId, 10)
        await sendMails(task.userId, 10)
        await createReminderTask(task, true, true)
        return
    }
    await sendMails(task.operationUserId, 5)
    await sendMails(task.userId, 5)

}

async function createReminderTask(task, remindedFifteen, remindedTen) {
    let db = admin.database()
    db.ref('server').child(`/operationHub/taskManager`).push({
        active: true,
        operationUserId: task.operationUserId,
        reminderTime: task.reminderTime,
        remindedFifteen: remindedFifteen,
        remindedTen: remindedTen,
        type: 'reminderTask',
        userId: task.userId,
        time: new Date().getTime()
    })
}

async function sendMails(user, time) {
    let userAccount = <any> await getUserActiveAccount(user)
    let mail = {
        active: true,
        params: {
            name: userAccount.name,
            time: time,
        },
        template: 'project.scheduler.meeting.reminder',
        to: userAccount.email
    }
    let db = admin.database()
    await db.ref(`server/operations/events/sendEmail/`).push(mail)
    await db.ref(`server/operations/events/sendMailTrigger/`).update({time: new Date().getTime()})

}

