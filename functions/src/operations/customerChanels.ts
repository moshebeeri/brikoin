
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const accountSid = 'ACde9becade1257930f33203e0cfaaa26d'
const authToken = 'b05780609ebf102e89da27a3785b4d46'
const client = require('twilio')(accountSid, authToken)
import {getActiveRequest, getUserActiveAccount, getSmsValidation} from './utils'

exports.sendSmsValidation = functions.database.ref(`server/operations/events/smsPhoneValidationTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let smsRequest = <any> await getActiveRequest('smsPhoneValidation')
    console.log('VALIDATE SMS')
    if (smsRequest && smsRequest.phoneNumber) {
        console.log('START VALIDATING ' + JSON.stringify(smsRequest))
        let validationCode = Math.floor(100000 + Math.random() * 900000)
        client.messages
            .create({
                body: 'Validate your phone code: ' + validationCode,
                from: '+19412601541',
                to: smsRequest.phoneNumber
            })
            .then(message => console.log(message.sid))
            .done()
        db.ref('server').child('operations').child('events').child('smsPhoneValidation').child(smsRequest.key).update({active: false})
        db.ref('server').child('smsValidation').child(smsRequest.userId).set({validationCode: validationCode})
    }
    console.log('END VALIDATION SMS')

})

exports.checkPhoneValidaion = functions.database.ref(`server/operations/events/checkPhoneValidationTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let validationRequest = <any> await getActiveRequest('checkPhoneValidation')
    console.log('VALIDATE PHONE CODE')
    if (validationRequest && validationRequest.validationCode) {
        console.log('START VALIDATING ' + JSON.stringify(validationRequest))
        let userValidationnCode = <any> await getUserValidationCode(validationRequest.userId)
        console.log('userValidationnCode ' + JSON.stringify(userValidationnCode))
        let smsValidationOperation = <any> await getSmsValidation(validationRequest.userId)
        if(userValidationnCode.validationCode === validationRequest.validationCode){
            let userAccount = <any> await getUserActiveAccount(validationRequest.userId)
            if(smsValidationOperation) {
                db.ref(`server/operationHub/${validationRequest.userId}/operations/${smsValidationOperation.key}`).update({
                    validation: 'success'
                })
            }
            db.ref('server').child('users').child(validationRequest.userId).child('accounts').child(userAccount.id).update({phoneNumber: validationRequest.phoneNumber})

        }else {
            if (smsValidationOperation) {
                db.ref(`server/operationHub/${validationRequest.userId}/operations/${smsValidationOperation.key}`).update({
                    validation: 'failed'
                })
            }
        }
        db.ref('server').child('operations').child('events').child('checkPhoneValidation').child(validationRequest.key).update({active: false})
    }
    console.log('END VALIDATE PHONE COD')

})

export async function getUserValidationCode (userId) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('smsValidation').child(userId).once('value', function (snapshot) {
                let results = snapshot.val()
                resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}