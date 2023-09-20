const admin = require('firebase-admin')

const events = [
    {event: 'addInternalAccount', trigger: 'addInternalAccountTrigger'},
    {event: 'approveFundDeposit', trigger: 'triggerApproveFundDeposit'},
    {event: 'approvePendingOrder', trigger: 'triggerApprovePendingOrder'},
    {event: 'approveRoleRequest', trigger: 'approveRoleRequestTrigger'},
    {event: 'assignUserToProject', trigger: 'assignUserToProjectTrigger'},
    {event: 'cancelAllOrder', trigger: 'cancelAllOrderTrigger'},
    {event: 'checkPhoneValidation', trigger: 'checkPhoneValidationTrigger'},
    {event: 'initialDocumentSignedBuyer', trigger: 'triggerInitialDocumentSignedBuyer'},
    {event: 'internalMortgageCondition', trigger: 'internalMortgageConditionTriggerEvent'},
    {event: 'internalMortgageeRequest', trigger: 'internalMortgageeTriggerEvent'},
    {event: 'loadProject', trigger: 'loadProjectTrigger'},
    {event: 'processOrder', trigger: 'triggerProcessOrder'},
    {event: 'receivedPayment', trigger: 'triggerPaymentsCheck'},
    {event: 'reserveAndDeposit', trigger: 'triggerReserveAndDeposit'},
    {event: 'signPdf', trigger: 'signPdfTriggerEvent'},
    {event: 'smsPhoneValidation', trigger: 'smsPhoneValidationTrigger'},
    {event: 'syncCase', trigger: 'syncCaseTrigger'},
    {event: 'syncUserLedger', trigger: 'syncUserLedgerTrigger'},
    {event: 'withdrawProjectFund', trigger: 'withdrawProjectFundTrigger'},
]

export async function monitorEvents() {
    let activeEventRequestReport = await  Promise.all(events.map(async event => await getActiveRequestReport(event)))
    let shouldSendMail = await shouldSendReport(activeEventRequestReport)
    if (shouldSendMail) {
        await sendEmail(activeEventRequestReport)
    }
}

async function shouldSendReport(report) {
    let lastMailValidation = await lastSentMailValidation()
    if (!lastMailValidation) {
        return false
    }

    let activeRequests = report.filter(event => event.activeRequests > 0)
    if (activeRequests.length > 0) {
        let checkEventDuration = <any> await Promise.all(activeRequests.map(async event => await checkDuration(event)))
       console.log(`checkEventDuration ${JSON.stringify(checkEventDuration)}`)
        let longDuration = checkEventDuration.filter(event => event.longDuration)
        if (longDuration.length > 0) {
            return true
        }
    }
    let activeRequestsMoreThenOne = report.filter(event => event.activeRequests > 1)
    if (activeRequestsMoreThenOne.length > 0) {
        return true
    }
    return false

}

async function lastSentMailValidation() {
    let result = <any> await getLastEmailSent()
    if (!result) {
        return true
    }
    if (new Date().getTime() - 120000 < result.lastSendingTime) {
        return false
    }

    return true

}

async function getActiveRequestReport(event) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        db.ref(`server/operations/events/${event.event}/`).orderByChild('active').equalTo(true).on('value', function (snapshot) {
            let results = snapshot.val()
            if (results) {
                resolve({activeRequests: Object.keys(results).length, trigger: event.trigger, event: event.event})
                return
            }
            resolve({activeRequests: 0, event: event.event})

        })
    })
}

async function checkDuration(event) {
    let lastTimeStamp = <any> await getTriggerTime(event.trigger)
    console.log(`lastTimeStamp ${lastTimeStamp}`)
    console.log(`lastTimeStamp ${new Date().getTime()}`)
    if (lastTimeStamp.time + 300000 < new Date().getTime()) {
        return {longDuration: true}
    }
    return {longDuration: false}
}

async function getTriggerTime(trigger) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        db.ref(`server/operations/events/${trigger}/`).on('value', function (snapshot) {
            let results = snapshot.val()
            if (results) {
                resolve(results)
                return
            }
            resolve({time: new Date().getTime()})

        })
    })
}


async function getLastEmailSent() {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        db.ref(`server/monitor/email/`).on('value', function (snapshot) {
            let results = snapshot.val()
            resolve(results)
        })
    })
}


async function sendEmail(report) {
    let mail = {
        active: true,
        params: {
            report: reportToString(report)
        },
        template: 'monitor.system',
        to: 'roi@brikoin.com'
    }
    let db = admin.database()
    await db.ref(`server/operations/events/sendEmail/`).push(mail)
    await db.ref(`server/operations/events/sendMailTrigger/`).update({time: new Date().getTime()})
    await db.ref(`server/monitor/email/`).update({lastSendingTime: new Date().getTime()})
}


function reportToString(report) {
    let reportMessage = report.filter(event => event.activeRequests > 0).map(row => `  Event type: ${row.event}  Number of active Task:  ${row.activeRequests}  `)
    return JSON.stringify(reportMessage)

}