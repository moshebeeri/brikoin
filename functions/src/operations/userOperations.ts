const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {getActiveRequest, getUserActiveAccount} from './utils'

exports.handleUserRole = functions.database.ref(`server/operations/events/approveRoleRequestTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let roleRequest = <any> await getActiveRequest('approveRoleRequest')
    console.log('Add RoleS')
    if (roleRequest.approve) {
        db.ref('server').child('usersRoles').child(roleRequest.role).child(roleRequest.userId).set({1: 1})
        db.ref('server').child('userRoleRequest').child(roleRequest.userId).child(roleRequest.requestId).update({approved: true})

    } else {
        db.ref('server').child('userRoleRequest').child(roleRequest.userId).child(roleRequest.requestId).update({approved: false})
    }
    db.ref('server').child('operations').child('events').child('approveRoleRequest').child(roleRequest.key).update({active: false})

    console.log('END Add Rules')

})
exports.selectAppointment = functions.database.ref(`server/operations/events/selectAppointmentTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let selectAppointmentRequest = <any> await getActiveRequest('selectAppointment')
    console.log(`selectAppointment ${JSON.stringify(selectAppointmentRequest)}`)
    if (selectAppointmentRequest && selectAppointmentRequest.userTo) {

        db.ref(`server/operationHub/calendar/${selectAppointmentRequest.userTo}/availabilities/${selectAppointmentRequest.calendarKey}`)
            .update(selectAppointmentRequest.selected ? {
                userId: selectAppointmentRequest.user,
                selected: selectAppointmentRequest.selected
            } : {userId: '', selected: false})

    }
    db.ref(`server/operations/events/selectAppointment/${selectAppointmentRequest.key}`).update({active: false})

})
exports.assignUserToProject = functions.database.ref(`server/operations/events/assignUserToProjectTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let assignRequest = <any> await getActiveRequest('assignUserToProject')
    if (assignRequest.key) {

        let assignment = {}
        if (assignRequest.assignment === 'sellerLawyer') {
            let userActiveAccount = <any> await getUserActiveAccount(assignRequest.sellerLawyer)
            assignment = {sellerLawyer: assignRequest.sellerLawyer, sellerLawyerAddress: userActiveAccount.accountId}
            db.ref('server').child('cases').child(assignRequest.sellerLawyer).push({
                projectId: assignRequest.projectId,
                projectAddress: assignRequest.projectAddress,
                seller: true
            })
        }
        if (assignRequest.assignment === 'trustee') {
            let userActiveAccount = <any> await getUserActiveAccount(assignRequest.trustee)
            assignment = {trusteeAddress: userActiveAccount.accountId, trustee: assignRequest.trustee}
            db.ref('server').child('cases').child(assignRequest.trustee).push({
                projectId: assignRequest.projectId,
                trustee: true,
                projectAddress: assignRequest.projectAddress
            })
        }

        db.ref('server').child('projectsCollections').child('projects').child(assignRequest.projectId).update(assignment)
        db.ref('server').child('operations').child('events').child('assignUserToProject').child(assignRequest.key).update({active: false})
    }
    console.log('END assignUserToProject')

})


