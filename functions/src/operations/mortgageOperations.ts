
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const MIL = 1000000
import {getUserActiveAccount, updateUserBalance, getAdminAccountId, updateMortgageeBalance, updateUserClearances, addProjectNotification} from './utils'
import {getCondition, calculateMortgagePayments} from './calculator'
import { setMortgageeAmount, payMortgageNextPayment, addMortgageCondition, addMortgageRequest, approveMortgageRequest, setMortgagePayment, mortgageShouldRefinance, mortgageRemainingBalance, getMortgageNextPaymentIndex} from './wallet'

exports.internalMortgage = functions.database.ref(`server/operations/events/internalMortgageeTriggerEvent`).onWrite(async (change, context) => {
    let db = admin.database()
        console.log('START Mortgagee')
        let mortgageeRequest = <any> await getInternalRequest('internalMortgageeRequest')
        if (mortgageeRequest) {
            try {
                console.log('update request')
                db.ref('server').child('operations').child('events').child('internalMortgageeRequest').child(mortgageeRequest.key).update({active: false})
                let userAccount = <any> await getUserActiveAccount(mortgageeRequest.user)
                console.log('user account ')
                let mortgagee = <any> await setMortgageeAmount(userAccount.accountId, mortgageeRequest)
               console.log('mortgaege was set')
                await updateUserBalance(mortgageeRequest.user, userAccount.accountId, userAccount.id, '', '')
                await updateMortgageeBalance(mortgageeRequest.user, userAccount.accountId, mortgagee.mortgageeAddress)

            }
            catch (error){
                console.log('Failed creating mortgagee')
                console.log(error)
                db.ref('server').child('operations').child('events').child('internalMortgageeRequest').child(mortgageeRequest.key).update({failed: true})
            }
        }
        console.log('########## Handling internalMortgagee end ############')

})
    exports.mortgagePayment = functions.database.ref(`server/operations/events/payMortgageSchedulePaymentTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getInternalRequest('payMortgageSchedulePayment')
    if(request) {
        console.log(request)
        let response = <any> await payMortgageNextPayment(request.mortgageAddress, 1000000)

        console.log(response)
        if (response.success) {
            db.ref('server').child('/operations/events/payMortgageSchedulePayment').child(request.key).update({active: false})
            await updatePayment(request.mortgageConditionId, request.mortgageRequestKey, response.lastPayedIndex)
            let mortgageRequest = <any>  await getMortgageRequestByKeys(request.mortgageConditionId, request.mortgageRequestKey)
            console.log(mortgageRequest)
            let mortgageeAccount = <any> await getUserActiveAccount(request.userId )
            let userAccount = <any> await getUserActiveAccount(mortgageRequest.user)
            console.log(userAccount)
            console.log(mortgageeAccount)
            await updateUserBalance(mortgageRequest.user, userAccount.accountId, userAccount.id, '', '')
            await updateUserBalance(request.userId, mortgageeAccount.accountId, mortgageeAccount.id, '', '')
            await refinanceMortgage(request.mortgageAddress, mortgageRequest, request.mortgageConditionId, request.mortgageRequestKey)
            await updateUserClearances(userAccount, 0, request.mortgageAddress, 0,0, true, mortgageRequest.project)
        }
    }

})

exports.refinanceMortgage = functions.database.ref(`server/operations/events/refinanceMortgageTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getInternalRequest('refinanceMortgage')
    console.log("START REFINANCE")
    console.log(JSON.stringify(request))
    db.ref('server').child('/operations/events/refinanceMortgageTrigger').child(request.key).update({active: false})

    let mortgageRequest = <any>  await getMortgageRequestByKeys(request.mortgageConditionId, request.mortgageRequestKey)
    console.log(JSON.stringify(mortgageRequest))
    await refinanceMortgage(request.mortgageAddress, mortgageRequest, request.mortgageConditionId, request.mortgageRequestKey)

})

async function refinanceMortgage(mortgageAddress, mortgageRequest, mortgageConditionId, mortgageRequestKey){
    let db = admin.database()
    let userAccount = <any> await getUserActiveAccount(mortgageRequest.user )
    let shouldRefinance = await mortgageShouldRefinance(mortgageAddress, userAccount.accountId)
    console.log("shouldRefinance: " + shouldRefinance)
    if(shouldRefinance) {
        let remainingBalance = await mortgageRemainingBalance(mortgageAddress, userAccount.accountId)
        console.log("remainingBalance: " + remainingBalance)
        let nextPaymentIndex = await getMortgageNextPaymentIndex(mortgageAddress, userAccount.accountId)
        let payments = Object.keys(mortgageRequest.scheduledPayments).map(key => mortgageRequest.scheduledPayments[key])
        let numberOfMonth = payments.length
        let remainingMonth = numberOfMonth - nextPaymentIndex
        console.log("nextPaymentIndex: " + nextPaymentIndex)
        console.log("condition: " + mortgageRequest.mortgageType + " "  + remainingMonth,parseFloat(remainingBalance) / MIL + " " +  mortgageRequest.armInterestRate + " " +  mortgageRequest.interestRateFixed)
        let condition = getCondition(mortgageRequest.mortgageType, remainingMonth,parseFloat(remainingBalance) / MIL, mortgageRequest.armInterestRate, mortgageRequest.interestRateFixed)
        let newPayments = <any> calculateMortgagePayments(condition)
        let paymentSchedule = newPayments.paymentSchedule
        paymentSchedule.forEach(async (payment, index) => {
            payment.active = true
            payment.mortgageAddress = mortgageRequest.mortgageAddress
            payment.index = index + parseInt(nextPaymentIndex)
            payment.buyerMortgageRequestId = mortgageRequestKey
            payment.buyerMortgageId = mortgageConditionId
            payment.refinance = true

            await db.ref('server').child('/operations/events/singlePayment').push(payment)

        })

        await updateRefincanceLoan(parseFloat(remainingBalance) / MIL,  mortgageConditionId, mortgageRequestKey)
        setTimeout(function(){
            db.ref('server').child('/operations/events/singlePaymentTrigger').set({time: new Date().getTime()})
        }, 1000);

    }
    return shouldRefinance

}

async function updateRefincanceLoan(newLoan, mortgageConditionId, mortgageRequestKey) {
    let db = admin.database()
    db.ref('server').child('/mortgages').child(mortgageConditionId).child('mortgagesRequests').child(mortgageRequestKey).update({refinancedLoan: newLoan})

}
exports.mortgageWritePayments = functions.database.ref(`server/operations/events/mortgagesPaymentTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    console.log('START paymennt')
    let mortgagePayment = <any> await getInternalRequest('mortgagesPayment')
    if(mortgagePayment) {
        db.ref('server/operations/events/mortgagesPayment').child(mortgagePayment.key).update({active: false})
        let mortgageRequest = <any> await getMortgageRequest(mortgagePayment)
        let condition = getCondition(mortgageRequest.mortgageType, mortgageRequest.years * 12, mortgageRequest.amount, mortgageRequest.armInterestRate, mortgageRequest.interestRateFixed)
        let payments = <any> calculateMortgagePayments(condition)
        let paymentSchedule = payments.paymentSchedule
        paymentSchedule.forEach(async (payment, index) => {
             payment.active = true
             payment.mortgageAddress = mortgageRequest.mortgageAddress
             payment.index = index
             payment.buyerMortgageRequestId = mortgagePayment.buyerMortgageRequestId
             payment.buyerMortgageId = mortgagePayment.buyerMortgageId
             await db.ref('server').child('/operations/events/singlePayment').push(payment)

         })
        setTimeout(function(){
            db.ref('server').child('/operations/events/singlePaymentTrigger').set({time: new Date().getTime()})
        }, 1000);
    }

})
exports.writeSinglePayment = functions.database.ref(`server/operations/events/singlePaymentTrigger`).onWrite(async (change, context) => {
        let db = admin.database()
        let payment = <any> await getInternalRequest('singlePayment')
        console.log('START SINGLE PAYMET')
        console.log(payment)
        if (payment) {
            let year = new Date().getFullYear() + payment.loanYear - 1
            let dateYear = new Date(year, payment.loanMonth, 1, 0, 0, 0, 0).getTime();
            payment.paymentDate = dateYear
            let response = await setMortgagePayment(payment.mortgageAddress, payment.index, payment)
            console.log("response: " + response)
            if (response) {
                if (payment.refinance) {
                    console.log('index: ' + payment.index)
                    let paymentId = await getPaymentIdByIndex(payment.buyerMortgageId, payment.buyerMortgageRequestId, payment.index)
                    console.log('paymentId: ' + paymentId)

                    db.ref('server').child('/mortgages/').child(payment.buyerMortgageId).child('mortgagesRequests').child(payment.buyerMortgageRequestId).child('scheduledPayments').child(paymentId).update(payment)

                } else {
                    db.ref('server').child('/mortgages/').child(payment.buyerMortgageId).child('mortgagesRequests').child(payment.buyerMortgageRequestId).child('scheduledPayments').push(payment)
                }
                db.ref('server').child('/operations/events/singlePayment').child(payment.key).update({active: false})
                db.ref('server').child('/operations/events/singlePaymentTrigger').set({time: new Date().getTime()})

            }
        }
    }
)
exports.clearMortgage = functions.database.ref(`server/operations/events/clearMortgageTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getInternalRequest('clearMortgage')
    // TODO do payment
    db.ref('server').child('/operations/events/clearMortgage').child(request.key).update({active: false})
    db.ref('server').child('/mortgagesPayment').child(request.mortgageId).update({payed: true})

})

exports.addMortgageCondition = functions.database.ref(`server/operations/events/internalMortgageConditionTriggerEvent`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getInternalRequest('internalMortgageCondition')
    let userAccount = <any> await getUserActiveAccount(request.user)
    let response = <any> await addMortgageCondition(request, userAccount)
    console.log(response)
    request.mortgageConditionAddress = response.conditionAddress
    request.avalibaleFounds = response.mortgageeAveFunds
    db.ref('server').child('/operations/events/internalMortgageCondition').child(request.key).update({active: false})
    //Todo handle update request
    db.ref('server/').child('mortgages').push(request)

})
exports.mortgageReqeust = functions.database.ref(`server/operations/events/internalMortgageTriggerEvent`).onWrite(async (change, context) => {
    let db = admin.database();
    let request = <any> await getInternalRequest('internalMortgageRequest');
    let userAccount = <any> await getUserActiveAccount(request.user);
    request.approved = false;
    let response = <any> await addMortgageRequest(request, userAccount)
    request.mortgageRequestAddress = response;
    let mortgageCondition = <any> await getMortgageConndition(request.mortgageId)
    let mortgageRequest = await db.ref('server').child('/mortgages').child(request.mortgageId).child('mortgagesRequests').push(request)
    let mortgageRequestKey = mortgageRequest.key
    console.log(`mortgageRequestKey: ${mortgageRequestKey}`)
    await createMortgageRequestTask(request,mortgageCondition, mortgageRequestKey)
    console.log('Sync user Data')
    syncUserMortgageData(request.user, mortgageCondition.user)
    db.ref('server').child('/operations/events/internalMortgageRequest').child(request.key).update({active: false});

})

exports.handleMortgageRequest = functions.database.ref(`server/operations/events/internalMortgageOprTriggerEvent`).onWrite(async (change, context) => {
    let db = admin.database();
    let request = <any> await getInternalRequest('internalMortgageRequestOpr');
    let userAccount = <any> await getUserActiveAccount(request.user);
    db.ref('server').child('/operations/events/internalMortgageRequestOpr').child(request.key).update({active: false});
    if (request.approve) {
        console.log('new mortgage approvment')
        let response = <any> await approveMortgageRequest(request, userAccount.accountId, userAccount.privateKey)
        if (response.success) {
            db.ref('server').child('mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.mortgageRequestId).update({
                approved: true,
                mortgageAddress: response.mortgageAddress
            })
            let mortgageRequest = <any> await getMortgageRequestByKeys(request.mortgageId, request.mortgageRequestId)
            syncUserMortgageData(request.user, mortgageRequest.user)
            await addProjectNotification(mortgageRequest.user, 'mortgage','mortgageApproved', request.projectId)
        }
    } else {
        db.ref('server').child('mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.mortgageRequestId).remove()
        await addProjectNotification(request.user, 'mortgage','mortgageRejected',  request.projectId)
    }
    }
)
exports.cancelMortgageReqeust = functions.database.ref(`server/operations/events/cancelMortgageRequestTriggerEvent`).onWrite(async (change, context) => {
        let db = admin.database()
        let request = <any> await getInternalRequestWithId('cancelMortgageRequest')
        console.log('request: ' +  JSON.stringify(request))
        db.ref('server').child('/operations/events/cancelMortgageRequest').child(request.id).update({active: false})
        db.ref('server').child('/mortgages').child(request.mortgageId).child('mortgagesRequests').child(request.key).remove()
    }
)

async function createMortgageRequestTask(request, mortgageCondition, requestKey){
    let db = admin.database()
    let newTask = {
        active: true,
        mortgagee: mortgageCondition.user,
        project: mortgageCondition.project,
        userId: request.user,
        mortgageConditionAddress: request.mortgageConditionAddress,
        mortgageRequestAddress: request.mortgageRequestAddress,
        mortgageId: request.mortgageId,
        mortgageRequestId: requestKey,
        type: 'mortgageRequest'
    }
    console.log(JSON.stringify(newTask))
    await db.ref(`server/operationHub/taskManager`).push(newTask)
}
async function getPaymentIdByIndex (mortgageId, requestId, paymentIndex) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/mortgages/').child(mortgageId).child('mortgagesRequests').child(requestId).child('scheduledPayments').orderByChild('index').equalTo(parseInt(paymentIndex)).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log('getPaymentIdByIndex ' + JSON.stringify(results))
                if (results) {
                    let mortgageeRequests = Object.keys(results).map(key => {
                        let request = results[key]
                        request.key = key
                        return request
                    })
                    resolve(mortgageeRequests[0].key)
                }
                resolve('')
            })
        } catch (error) {
            console.log('failed ' + JSON.stringify(error))
            reject(error)
        }
    })
}
async function updatePayment (mortgageId, requestId, paymentIndex) {
    let db = admin.database()
    console.log('UPDATE PAYMENT')
    console.log('mortgageId ' +mortgageId + 'requestId ' + requestId + 'paymentIndex ' +  paymentIndex)
    let paymentRequest = <any> await getPaymentIdByIndex(mortgageId, requestId, paymentIndex)
    console.log('paymentRequest ' + JSON.stringify(paymentRequest))
    db.ref('server').child('/mortgages').child(mortgageId).child('mortgagesRequests').child(requestId)
        .child('scheduledPayments').child(paymentRequest).update({payed: true ,active: false})

}


async function getInternalRequest (requestPath){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/').child(requestPath).orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let mortgageeRequests = Object.keys(results).map(key => {
                        let request = results[key]
                        request.key = key
                        return request
                    })
                    resolve(mortgageeRequests[0])
                }
                resolve('')
            })
        } catch (error) {
            reject(error)
        }
    })
}
async function getInternalRequestWithId (requestPath){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/').child(requestPath).orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let mortgageeRequests = Object.keys(results).map(key => {
                        let request = results[key]
                        request.id = key
                        return request
                    })
                    resolve(mortgageeRequests[0])
                }
                resolve('')
            })
        } catch (error) {
            reject(error)
        }
    })
}
async function getMortgageRequest (mortgagePayment){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            console.log('Handle Mortgage request getter')
             db.ref('server').child('/mortgages/').child(mortgagePayment.buyerMortgageId).child('mortgagesRequests').child(mortgagePayment.buyerMortgageRequestId).once('value',function (snapshot) {
             let results = snapshot.val()
             resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getMortgageConndition(conditionId){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            console.log('Handle Mortgage request getter')
             db.ref('server').child('/mortgages/').child(conditionId).once('value',function (snapshot) {
             let results = snapshot.val()
             resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}
async function getMortgageRequestByKeys (conditionId, requestKey){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            console.log('Handle Mortgage request getter')
             db.ref('server').child('/mortgages/').child(conditionId).child('mortgagesRequests').child(requestKey).once('value',function (snapshot) {
             let results = snapshot.val()
             resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}


function syncUserMortgageData(mortgageeUser, mortgageeRequestUser){
    let db = admin.database()
    // sync mortgage change
    console.log('update user ' + mortgageeUser + ' update mortgage user' + mortgageeRequestUser)
    db.ref('server').child('users').child(mortgageeRequestUser).child('mortgage').set({
        time: new Date().getTime(),
    })
    db.ref('server').child('users').child(mortgageeUser).child('mortgage').set({
        time: new Date().getTime(),
    })
}
async function getActivePaymentReqeusts () {
    return new Promise((resolve, reject) => {
        let db = admin.database()
        try {
            db.ref('server').child('/operations/events/payMortgageSchedulePayment').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let payments = Object.keys(results).map(key => {
                        let payment = results[key]
                        payment.key = key
                        return payment[0]
                    })
                    resolve(payments)
                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}
