import {getActiveRequest} from "../operations/utils";

const functions = require('firebase-functions')
const admin = require('firebase-admin')

exports.triggerTest = functions.database.ref(`server/test/trigger/trigger`).onWrite(async (change, context) => {
    let db = admin.database()
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/testEvents/`).push({
        active: true,
        testNumber: new Date().getTime()
    })
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    })
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    })
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    })
    db.ref(`server/operations/events/triggerTestEvents/`).update({
        time: new Date().getTime()
    })

})


exports.triggerTestEvents = functions.database.ref(`server/operations/events/triggerTestEvents`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('testEvents')
    if (request) {
        db.ref(`server/operations/events/testEvents/${request.key}`).update({
            active: false
        })
        db.ref(`server/operations/events/triggerTestEvents/`).update({
            time: new Date().getTime()
        })
    }
})
