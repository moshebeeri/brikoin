
const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {getUserActiveAccount, getAdminAccountId, getActiveRequest,updateTotalFees} from './utils'
import { setUserFeeStatus, setUserFeeRatio, clearFees} from './wallet'

exports.userFeesState = functions.database.ref(`server/operations/events/feeTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let feesRequest = <any> await getActiveRequest('feeRequest')
    console.log('START FEES')
    if (feesRequest) {
        console.log('START SET FEES ' + JSON.stringify(feesRequest))
        let activeAccount =  <any> await getUserActiveAccount(feesRequest.userId)
        await setUserFeeStatus(activeAccount.accountId, feesRequest.feesState)
        db.ref('server').child('operations').child('events').child('feeRequest').child(feesRequest.key).update({active: false})
        db.ref('server').child('users').child(feesRequest.userId).child('accounts').child(activeAccount.id).update({feeState: feesRequest.feesState})
    }
    console.log('END FEES')

})
exports.clearFees = functions.database.ref(`server/operations/events/clearFeesTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let feesRequest = <any> await getActiveRequest('clearFeeRequest')
    console.log('START FEES')
    if (feesRequest) {
        await clearFees()
        db.ref('server').child('operations').child('events').child('clearFeeRequest').child(feesRequest.key).update({active: false})
        await updateTotalFees(db, admin)
    }
    console.log('END FEES')

})

exports.userFeesRatio = functions.database.ref(`server/operations/events/setFeeTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let feesRequest =  <any> await getActiveRequest('setFeeRequest')
    console.log('START SET FEES ' + JSON.stringify(feesRequest))
    if(feesRequest) {
        await setUserFeeRatio(feesRequest.buyingFee, feesRequest.sellingFee)
        db.ref('server').child('operations').child('events').child('setFeeRequest').child(feesRequest.key).update({active: false})
    }
    console.log('END SET FEES')

})
