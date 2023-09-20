const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {  getAdminAccount} from './utils'
import { createProjectInitialAsk} from './wallet'

exports.initialProject = functions.database.ref(`server/projects/events/initialProject`).onWrite(async (change, context) => {
        let db = admin.database()
        let project = <any> await getProjectInit()
        let stoneCoinAddress = project.projectId
        if (stoneCoinAddress === '0') {
            return
        }
        console.log('################ start handle project init ########################')
        if (stoneCoinAddress) {
            let adminAccount = <any> await getAdminAccount('project')
            let initialOffer = <any> await getProjectInitialOffer(stoneCoinAddress)
            await createProjectInitialAsk(adminAccount, stoneCoinAddress, initialOffer.amount)
            await db.ref('server').child('/projects/events/').child('initialProject').set({projectId: 0})
            await db.ref('server').child('/operations/project/initialOffer').child(initialOffer.id).update({executed: true})
        }
        console.log('################ End handle project init ########################')

})

async function getProjectInit () {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('projects/events/initialProject').once('value', function (snapshot) {
                resolve(snapshot.val())
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getProjectInitialOffer (projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/operations/project/initialOffer').orderByChild('projectId').equalTo(projectAddress).once('value', function (snapshot) {
                let result = snapshot.val()
                if (result) {
                    result = Object.keys(result).map(key => {
                        let project = result[key]
                        project.id = key
                        return project
                    })
                    resolve(result[0])
                    return
                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}
