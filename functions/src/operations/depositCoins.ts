const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {getUserActiveAccount, getAdminAccount, updateUserBalance, getActiveRequest, syncUserLedger} from './utils'
import { depositCoins, withdrawCoins } from './wallet'

exports.depositCoins = functions.database.ref(`server/operations/events/triggerPaymentsCheck`).onWrite(async (change, context) => {
    let paymentRequest = await getPaymentRequests();
    await handlePaymentRequest(paymentRequest)

})


exports.withdrawCoins = functions.database.ref(`server/operations/events/withdrawCoinTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('withdrawCoin')
    console.log('START withdraw coins')
    if (request) {
        console.log('START withdraw coins ' + JSON.stringify(request))
        db.ref('server').child('operations').child('events').child('withdrawCoin').child(request.key).update({active: false})
        let activeAccount =  <any> await getUserActiveAccount(request.userId)
        await withdrawCoins(activeAccount.accountId, request.amount, request.projectAddress)
        await syncUserLedger(request.userId)
    }
    console.log('END FEES')

})

async function handlePaymentRequest (payment) {
    let db = admin.database()
    let request =  <any> await getPaymentRequest(payment.requestId, payment.userId)
    if (request) {
        request = Object.keys(request).map(key => request[key])[0]
        let userAccount = <any> await getUserActiveAccount(payment.userId)
        // await transferEtherFromAdmin(adminAccountId.accountId, adminAccountId.privateKey,userAccount.accountId)
        await depositCoins( userAccount.accountId, request.data.object.amount)
        db.ref('server').child('/operations/events/receivedPayment').child(payment.orderId).update({active: false})
        await updateUserBalance(payment.userId, userAccount.accountId, userAccount.id, '', '')
        await syncUserLedger(payment.userId)
    }
}

async function getPaymentRequests () {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/receivedPayment').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let payments = Object.keys(results).map(key => {
                        let payment = results[key]
                        payment.orderId = key
                        return payment
                    })
                    resolve(payments[0])
                }
                resolve("")
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getPaymentRequest (requestId, userId) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('users').child(userId).child('payments').orderByChild('id').equalTo(requestId).once('value', function (snapshot) {
                resolve(snapshot.val())
            })
        } catch (error) {
            reject(error)
        }
    })
}
