
const functions = require('firebase-functions')
const admin = require('firebase-admin')
import { getActiveRequest, getUserActiveAccount,getAdminAccount} from './utils'
import { getUserTransactions, getUserBalance } from './wallet'


exports.syncUserLedger = functions.database.ref(`server/operations/events/syncUserLedgerTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('syncUserLedger')
    if(request && request.userId) {
        console.log('Start sync ledger user: ' + request.userId)
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let currentTransactions = <any> await getUserLedgers(request.userId)
        console.log("User Account " + JSON.stringify(userAccount))
        let transactions = <any> await getUserTransactions(userAccount.accountId, currentTransactions && currentTransactions.filter(transaction => transaction.projectAddress !== 0).length)
        for(let i=0;i<transactions.length; i++){
            await  db.ref('server').child('users').child(request.userId).child('ledger').push(transactions[i])
        }
        let userTotalBalance =  await getUserBalance(userAccount.accountId)
        let currentLedgerBalance = calculateLedgerBalance(currentTransactions, transactions)
        if(userTotalBalance - currentLedgerBalance > 0) {
            console.log(`Total user balance - current ledger balance: ${userTotalBalance - currentLedgerBalance}` )
            let newTransaction = {
                time: new Date().getTime(),
                amount: userTotalBalance - currentLedgerBalance,
                projectAddress: 0,
                isAdd: true,
                description: 'DEPOSIT'

            }
            await  db.ref('server').child('users').child(request.userId).child('ledger').push(newTransaction)

        }
        if(userTotalBalance - currentLedgerBalance < 0) {
            console.log(`Total user balance - current ledger balance: ${userTotalBalance - currentLedgerBalance}` )
            let newTransaction = {
                time: new Date().getTime(),
                amount: currentLedgerBalance - userTotalBalance,
                projectAddress: 0,
                isAdd: false,
                description: 'WITHDRAW_OR_MOVED'

            }
            await  db.ref('server').child('users').child(request.userId).child('ledger').push(newTransaction)

        }

        db.ref('server').child('/operations/events/syncUserLedger').child(request.key).update({active: false})
        db.ref('server').child('/operations/events/syncUserLedgerTrigger').update({time: new Date().getTime()})

    }
})
function calculateLedgerBalance (currentTransactions, newTransactions) {
    let totalAmount = 0
    if(currentTransactions){
        totalAmount = totalAmount + currentTransactions.reduce(function (sum, transaction) {
            console.log(`sum: ${JSON.stringify(sum)} transaction: ${JSON.stringify(transaction)}`)
            if(transaction.isAdd){
                return sum + parseInt(transaction.amount)
            }
            return sum - parseInt(transaction.amount)
        }, 0)
        console.log(`current Total ledger transactions: ${totalAmount}` )
    }
    if(newTransactions){
        totalAmount = totalAmount + newTransactions.reduce(function (sum, transaction) {
            if(transaction.isAdd){
                return sum + parseInt(transaction.amount)
            }
            return sum - parseInt(transaction.amount)
        }, 0)
        console.log(`current Total ledger transactions with new transactions: ${totalAmount}` )
    }
    console.log(`Total ledger transactions: ${totalAmount}` )
    return totalAmount

}

async function getUserLedgers (userId) {
    return new Promise((resolve, reject) => {
        let db = admin.database()
        try {
            db.ref('server').child('users').child(userId).child('ledger').once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let result = Object.keys(results).map(key => {
                        let payment = results[key]
                        payment.key = key
                        return payment
                    })
                    resolve(result)
                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}
