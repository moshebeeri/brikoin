const functions = require('firebase-functions')
const admin = require('firebase-admin')
import { getAdminAccountId , getProjectId} from './utils'
import { addOrganization, assignProjectToOrg } from './wallet'

exports.addOrganization = functions.database.ref(`server/operations/events/triggerAddOrganization`).onWrite(async (change, context) => {
        let request = <any> await getOrganizationRequest();
        await handleOrganizationRequest(request)

})
exports.assignProjectOrg = functions.database.ref(`server/operations/events/triggerAssignProjectOrg`).onWrite(async (change, context) => {
        let request = <any> await getAssignProjectRequest();
        await handleProjectAssignment(request)
})

async function addNewOrganization(response, request) {
    let db = admin.database()
    db.ref('server/organization/').push({address: response.organizationAddress, name: request.name, phoneNumber: request.phoneNumber, email: request.email  })

}

async function updateProjectOrganization(projectAddress, organization) {
    let db = admin.database()
    let projectId = await getProjectId(projectAddress)
    console.log('UPDATING PROJECT ' + projectId)
    db.ref('server/projectsCollections/projects').child(projectId).update({organization: organization})

}

async function handleOrganizationRequest  (request) {
    let db = admin.database()
    if (request) {
        console.log('ADD ORGANIZATION STARTING')
        let response = <any> await addOrganization(request.name, request.phoneNumber, request.email)
        console.log('ADD Organization Result: ' + JSON.stringify(response))
        if(response.success) {
            await addNewOrganization(response, request)
        }
        db.ref('server').child('/operations/events/addOrganization').child(request.orderId).update({active: false})
    }
}

async function handleProjectAssignment (request) {
    let db = admin.database()
    if (request) {
        console.log('ASSIGN PROJECT START')
        let response = <any> await assignProjectToOrg(request.projectAddress, request.organization)
        console.log('PROJECT ASSIGNMENT RESULT ' + JSON.stringify(response))
        if(response.success) {
            await updateProjectOrganization(request.projectAddress, request.organization)
        }
        db.ref('server').child('/operations/events/assignProjectToOrg').child(request.orderId).update({active: false})
    }
}

async function getOrganizationRequest () {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/addOrganization').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let requests = Object.keys(results).map(key => {
                        let payment = results[key]
                        payment.orderId = key
                        return payment
                    })
                    resolve(requests[0])
                }
                resolve('')
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getAssignProjectRequest () {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/assignProjectToOrg').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let requests = Object.keys(results).map(key => {
                        let payment = results[key]
                        payment.orderId = key
                        return payment
                    })
                    resolve(requests[0])
                }
                resolve('')
            })
        } catch (error) {
            reject(error)
        }
    })
}

