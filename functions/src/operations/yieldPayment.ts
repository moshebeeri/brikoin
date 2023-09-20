const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {getUserActiveAccount, getAdminAccountId, updateUserBalance, updateProjectChange, getProjectHolders} from './utils'
import {payIncome} from './wallet'

exports.payPropertyYield = functions.database.ref(`server/operations/events/payYieldRequestTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let yieldRequest = <any>await getActiveYieldRequests()
    console.log('START YIELDS PAYMENTS')
    if (yieldRequest) {
        // console.log('START YIELD PAYMENTS')
        let holders = <any> await getProjectHolders(yieldRequest.projectAddress)
        // console.log('UPDATE HOLDERS BALANCE')
        let holderToBalnace = {}
        if (holders) {
            holders.forEach(async holder => {
                // console.log('UPDATE HOLDER BALANCE')
                if (holder.holdings > 0) {
                    let activeAccount = <any> await getUserActiveAccount(holder.holder)
                    holderToBalnace[holder.holder] = activeAccount.stonesBalance
                    console.log('ACCOUNT CURRENT BALANCE ' + activeAccount.stonesBalance)
                }
            })
        }
        await payIncome(yieldRequest.projectAddress, yieldRequest.yieldAmount)
        console.log('TRANSACTION YIELD PAYMENTS DONE')
        db.ref('server').child('operations').child('events').child('payYieldRequest').child(yieldRequest.key).update({active: false})
        // console.log('UPDATE HOLDERS BALANCE')
        if (holders) {
            holders.forEach(async holder => {
                console.log('UPDATE HOLDER BALANCE')
                if (holder.holdings > 0) {
                    let activeAccount = <any> await getUserActiveAccount(holder.holder)
                    // console.log('UPDATE HOLDER ACCOUNT')
                    console.log(JSON.stringify(holder))
                    console.log(JSON.stringify(activeAccount))
                    updateUserBalance(holder.holder, activeAccount.accountId, activeAccount.id, holderToBalnace[holder.holder], yieldRequest.projectAddress)
                }
            })
        }
        updateProjectChange(yieldRequest.projectAddress)
    }

})

async function getActiveYieldRequests () {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/payYieldRequest').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let yiledRequests = Object.keys(results).map(key => {
                        let request = results[key]
                        request.key = key
                        return request
                    })
                    resolve(yiledRequests[0])
                }
                return ''
            })
        } catch (error) {
            reject(error)
        }
    })
}
