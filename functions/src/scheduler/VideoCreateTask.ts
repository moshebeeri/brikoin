const admin = require('firebase-admin')
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant
import {getUserActiveAccount, addNotification} from '../operations/utils'

const FIFTEEN_MINUTES = 15 * 60 * 1000;
export async function videoCreateCondition(task) {
    let scheduleTime = <any> await getScheduleTime(task.operationUserId, task.user)
    if (!scheduleTime) {
        return false
    }
    let now = new Date().getTime()
    if(scheduleTime.from - now < FIFTEEN_MINUTES){
        return true
    }

    return false


}

async function getScheduleTime(operationUserId, userId) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        db.ref(`server/operationHub/calendar/${operationUserId}/availabilities`).orderByChild('userId').equalTo(userId).once('value', function (snapshot) {
            let result = snapshot.val()
            if (!result) {
                resolve('')
            }
            let appointments = Object.keys(result).map(key => {
                let appointment = result[key]
                appointment.key = key
                return appointment
            })
            resolve(appointments[0])
        })
    })
}

export async function videoCreateRun(task) {
    const userAccount = <any> await getUserActiveAccount(task.user)
    const videoToken1 = await createVideoToken(userAccount.name)
    const operationUserAccount = <any> await getUserActiveAccount(task.operationUserId)
    const videoToken2 = await createVideoToken(operationUserAccount.name)
    const roomName = `room ${new Date().getTime()}`
    await createVideoOperation(task.user, videoToken1, roomName, task.project)
    await createVideoOperation(task.operationUserId, videoToken2, roomName, task.project)
    await createReminderTask(task)

}

async function createVideoToken(identify) {
    let token = new AccessToken(
        'ACde9becade1257930f33203e0cfaaa26d',
        'SK85e7a31c2e5c92b9982b5ee92cf481b3',
        'jMOUpsb5IfSJrQkFam6o2E3MzltX0QYD'
    );

    // Assign the generated identity to the token
    token.identity = identify;

    const grant = new VideoGrant();
    // Grant token access to the Video API features
    token.addGrant(grant);
    return token.toJwt()
}

async function createVideoOperation(userId, videoToken, roomName, project) {
    const db = admin.database()
    const videoOperation = {
        name: 'videoCall',
        type: 'videoOperation',
        userId: userId,
        status: 'waiting',
        roomName: roomName,
        videoToken: videoToken,
        project: project,
        time: new Date().getTime()
    }
    await db.ref(`server/operationHub/${userId}/operations/`).push(videoOperation)
    await addNotification(userId,'operation','videoCall')

}

async function createReminderTask(task) {
    const db = admin.database()
    let scheduleTime = <any> await getScheduleTime(task.operationUserId, task.user)
    console.log(`Schedule time : ${JSON.stringify(scheduleTime)}`)
    let reminderTask = {
        active: true,
        reminderTime: scheduleTime.from,
        operationUserId: task.operationUserId,
        remindedFifteen: false,
        remindedTen: false,
        type: 'reminderTask',
        userId: task.user,
        time: new Date().getTime()
    }

    console.log(`Reminder Tasl : ${JSON.stringify(reminderTask)}`)
    db.ref('server').child(`/operationHub/taskManager`).push(reminderTask)
}
