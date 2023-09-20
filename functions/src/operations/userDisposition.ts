const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {getUserActiveAccount, getAdminAccountId, getActiveRequests} from './utils'
import { setUserDisposition} from './wallet'

exports.userDisposition = functions.database.ref(`server/operations/events/dispositionTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let dispositionRequests =  <any> await getActiveRequests('dispositionRequest')
    console.log('START DISPOSITION')
    if (dispositionRequests) {
        dispositionRequests.forEach(async dispositionRequest => {
            let activeAccount =  <any> await getUserActiveAccount(dispositionRequest.userId)
            await setUserDisposition(activeAccount.accountId, dispositionRequest.dispositionState)
            db.ref('server').child('operations').child('events').child('dispositionRequest').child(dispositionRequest.key).update({active: false})
            db.ref('server').child('users').child(dispositionRequest.userId).child('accounts').child(activeAccount.id).update({disposition: dispositionRequest.dispositionState})
        })
    }
    console.log('END DISPOSITION')

})
