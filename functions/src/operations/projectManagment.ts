const functions = require('firebase-functions')
const admin = require('firebase-admin')
import {
    addNotification,
    addNotificationWithParams,
    getActiveRequest,
    getOrCreateKycDocument,
    getOrCreateKycOperation,
    getProject,
    getUserActiveAccount,
    getUserGroupOffer,
    scheduleVideoMeeting,
    syncUserLedger,
    userBalanceByProject,
    orderChangedNotification
} from './utils'
import {
    cancelBidReqeust,
    cancelProjectBidReserve,
    depositCoinsProject,
    getProjectReservedPrice,
    projectBidRequest,
    projectBidReserve,
    updateProjectTarget,
    withdrawCoins, setUserOffer
} from './wallet'

exports.reserveAndDeposit = functions.database.ref(`server/operations/events/triggerReserveAndDeposit`).onWrite(async (change, context) => {
    let request = await getActiveRequest('reserveAndDeposit');
    await handleRequest(request)

})

async function handleRequest(request) {
    let db = admin.database()
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let reservedPrice = <any> await getProjectReservedPrice(request.projectAddress, userAccount.accountId)
        let userProjectBalance = <any>  await userBalanceByProject(request.userId, request.projectAddress)
        if (parseFloat(userProjectBalance) < parseFloat(reservedPrice)) {
            await depositCoinsProject(userAccount.accountId, parseFloat(reservedPrice) - parseFloat(userProjectBalance), request.projectAddress)
        }
        let response = await projectBidReserve(userAccount.accountId, userAccount.privateKey, request.projectAddress)
        console.log(`response  projectBidReserve ${JSON.stringify(response)}`)
        if (response.success) {
            await syncUserLedger(request.userId)
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                cancelOrder: false,
                reserved: true
            })
            await addNotificationWithParams(request.userId, 'trusteeApproved', 'transferReserved', {project: request.projectAddress})
        }
        db.ref('server').child('operations').child('events').child('reserveAndDeposit').child(request.key).update({active: false})

    }
}

exports.approveFundDeposit = functions.database.ref(`server/operations/events/triggerApproveFundDeposit`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('approveFundDeposit');
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let amount = parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price)
        if (pendingOrder.reserved) {
            let reservedPrice = <any> await getProjectReservedPrice(request.projectAddress, userAccount.accountId)
            if (pendingOrder.orderSecondApproved) {
                amount = amount - (amount / 10)
            } else {
                amount = amount - parseInt(reservedPrice)
            }
            await syncUserLedger(request.userId)
        }

        console.log('amount: ' + amount)
        await depositCoinsProject(userAccount.accountId, amount, request.projectAddress)
        db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
            cancelOrder: false,
            fullDeposit: true
        })
        await addNotificationWithParams(request.userId, 'trusteeApproved', 'fullDeposit', {project: request.projectAddress})
        await orderChangedNotification(pendingOrder)
        db.ref('server').child('operations').child('events').child('approveFundDeposit').child(request.key).update({active: false})

    }
})


exports.cancelAllOrder = functions.database.ref(`server/operations/events/cancelAllOrderTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('cancelAllOrder')
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)

        await cancelProjectBidReserve(userAccount.accountId, userAccount.privateKey, request.projectAddress)
        await cancelBidReqeust(userAccount.accountId, request.projectAddress)
        await syncUserLedger(request.userId)
        db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
            cancelOrder: true,
            buyerSignedTermSheet: false,
            buyerTermSheet: '',
            orderApproved: false,
            fullDeposit: false,
            reserved: false
        })

        await addNotificationWithParams(request.userId, 'trusteeApproved', 'cancelAllOrder', {project: request.projectAddress})
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        await orderChangedNotification(pendingOrder)
        db.ref('server').child('operations').child('events').child('cancelAllOrder').child(request.key).update({active: false})
    }

})


exports.withdrawProjectFund = functions.database.ref(`server/operations/events/withdrawProjectFundTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('withdrawProjectFund')
    if (request) {
        console.log("request " + JSON.stringify(request))
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let userProjectBalance = await userBalanceByProject(request.userId, request.projectAddress)
        console.log('userProjectBalance: ' + userProjectBalance)
        if (userProjectBalance > 0) {
            await withdrawCoins(userAccount.accountId, userProjectBalance, request.projectAddress)
            await syncUserLedger(request.userId)
        }
        await addNotificationWithParams(request.userId, 'trusteeApproved', 'withdrawProjectFund', {project: request.projectAddress})

    }
    db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({active: false})

    db.ref('server').child('operations').child('events').child('withdrawProjectFund').child(request.key).update({active: false})


})

exports.withdrawANoReserved = functions.database.ref(`server/operations/events/withdrawANoReservedTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('withdrawANoReserved')
    console.log('START withdraw coins')
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let userProjectBalance = <any> await userBalanceByProject(request.userId, request.projectAddress)
        let reservedPrice = <any> await getProjectReservedPrice(request.projectAddress, userAccount.accountId)
        if (parseFloat(userProjectBalance) > parseFloat(reservedPrice)) {
            await withdrawCoins(userAccount.accountId, parseFloat(userProjectBalance) - parseFloat(reservedPrice), request.projectAddress)
            await syncUserLedger(request.userId)
        }
        await addNotificationWithParams(request.userId, 'trusteeApproved', 'withdrawANoReserved', {project: request.projectAddress})

    }
    db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({active: false})
    db.ref('server').child('operations').child('events').child('withdrawANoReserved').child(request.key).update({active: false})

})

async function getUserOffer(pendingOrderId, projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/projects/pendingOrders').child(projectAddress).child(pendingOrderId).once('value', function (snapshot) {
                let result = snapshot.val()
                resolve(result)
            })
        } catch (error) {
            reject(error)
        }
    })
}


exports.approvePendingOrder = functions.database.ref(`server/operations/events/triggerApprovePendingOrder`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('approvePendingOrder');
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let response = <any> await projectBidRequest(userAccount.accountId, pendingOrder.project, pendingOrder.amount, pendingOrder.price, 0)
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                cancelOrder: false,
                orderApproved: true
            })
            await syncUserLedger(request.userId)
            await addNotificationWithParams(request.userId, 'trusteeApproved', 'approvePendingOrder', {project: request.projectAddress})
            await orderChangedNotification(pendingOrder)
        }
        db.ref('server').child('operations').child('events').child('approvePendingOrder').child(request.key).update({active: false})

    }
})
exports.approvePendingOrderSecond = functions.database.ref(`server/operations/events/triggerApprovePendingOrderSecond`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('approvePendingOrderSecond');
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let project = <any> await getProject(request.projectAddress)
        await depositCoinsProject(userAccount.accountId, pendingOrder.amount / 10 - (parseInt(project.reservedBid) / 1000000), request.projectAddress)
        let response = <any> await projectBidRequest(userAccount.accountId, pendingOrder.project, pendingOrder.amount / 10, pendingOrder.price, 0)
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                cancelOrder: false,
                orderSecondApproved: true
            })
            await syncUserLedger(request.userId)
            await orderChangedNotification(pendingOrder)
        }
        db.ref('server').child('operations').child('events').child('approvePendingOrderSecond').child(request.key).update({active: false})

    }
})

exports.cancelPendingOrder = functions.database.ref(`server/operations/events/triggerCancelPendingOrder`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('cancelPendingOrder');
    if (request) {
        let userAccount = <any> await getUserActiveAccount(request.userId)
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let response = <any> await cancelBidReqeust(userAccount.accountId, pendingOrder.project)
        if (response.success) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({active: false})
            await syncUserLedger(request.userId)
            await addNotificationWithParams(request.userId, 'trusteeApproved', 'cancelPendingOrder', {project: request.projectAddress})

        }
        await orderChangedNotification(pendingOrder)
        db.ref('server').child('operations').child('events').child('cancelPendingOrder').child(request.key).update({active: false})

    }
})
exports.cancelGroupPendingOrder = functions.database.ref(`server/operations/events/triggerCancelGroupPendingOrder`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('cancelGroupPendingOrder');
    if (request) {
        let pendingOrder = <any> await getUserGroupOffer(request.user, request.groupId, request.projectAddress)
        if (pendingOrder && pendingOrder.key) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(pendingOrder.key).update({
                cancelOrder: true,
                active: false
            })
            db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
               time: new Date().getTime()
            })
            await orderChangedNotification(pendingOrder)

        }
        db.ref('server').child('operations').child('events').child('cancelGroupPendingOrder').child(request.key).update({active: false})

    }
})

exports.approveProject = functions.database.ref(`server/operations/events/triggerApproveProject`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('approveProject');
    if (request) {
        console.log('STARTING PROJECT APPROVEMENT')
        let orders = <any> await getProjectPendingOrders(request.projectAddress)
        console.log('orders' + JSON.stringify(orders))
        let approvedOrders = orders.filter(order => order.orderApproved)
        console.log(JSON.stringify(approvedOrders))
        let project = <any> await getProject(request.projectAddress)
        let projectValidation = <any> await validateProject(project, approvedOrders)
        console.log('Validation: ' + JSON.stringify(projectValidation))
        if (projectValidation.success) {
            for (let index = 0; index < approvedOrders.length; index++) {
                let tradeOrder = {
                    active: true,
                    amount: approvedOrders[index].amount,
                    buyer: approvedOrders[index].userId,
                    price: approvedOrders[index].price,
                    pendingOrderId: approvedOrders[index].key,
                    projectAddress: approvedOrders[index].project,
                    seller: 'admin'
                }
                db.ref('server/operations/events/tradeEvent').push(tradeOrder)
                db.ref('server/operations/events/tradeEventTrigger').set({
                    time: new Date().getTime()
                })

                await addNotificationWithParams(approvedOrders[index].userId, 'trusteeApproved', 'approveProject', {project: request.projectAddress})

            }
            db.ref('server/projects/orders').child(request.projectAddress).child('ask').remove()


            db.ref('server').child('projectsCollections/projects').child(project.key).update({initTargetReached: true})

        }
        db.ref('server').child('operations').child('events').child('approveProject').child(request.key).update({active: false})

    }
})

exports.updateProjectTarget = functions.database.ref(`server/operations/events/triggerUpdateProjectTarget`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('updateProjectTarget');
    if (request) {
        let response = <any> await updateProjectTarget(request.project, request.dilution, request.units)
        if (response.success) {
            await updateProjectInitialAsk(request.project, response.ownerBalance)
            db.ref('server').child('projectsCollections').child('projects').child(request.project).update({target: response.target})
        }
        db.ref('server').child('operations').child('events').child('updateProjectTarget').child(request.key).update({active: false})

    }
})


exports.rejectBuyerOffer = functions.database.ref(`server/operations/events/triggerRejectBuyerOffer`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('rejectBuyerOffer');
    if (request) {
        let project = <any> await getProject(request.projectAddress)
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({rejectOffer: true})
        }
        db.ref('server').child('operations').child('events').child('approveFundDeposit').child(request.key).update({active: false})

    }
})

exports.acceptBuyerOffer = functions.database.ref(`server/operations/events/triggerAcceptBuyerOffer`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('acceptBuyerOffer');
    if (request) {
        let project = <any> await getProject(request.projectAddress)
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({acceptOffer: true})
        }
        db.ref('server').child('operations').child('events').child('acceptBuyerOffer').child(request.key).update({active: false})

    }
})

exports.initialDocumentSignedBuyer = functions.database.ref(`server/operations/events/triggerInitialDocumentSignedBuyer`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('initialDocumentSignedBuyer');
    if (request) {
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)

        if (pendingOrder.userId === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                buyerSignedTermSheet: true,
                buyerTermSheet: request.signedDocument,
                buyerTermSheetMd5: request.signedDocumentMd5,
                buyerSignature: request.signature,
                buyerId: request.idBuyer,
                buyerAddress: request.addressBuyer
            })
        }
        db.ref('server').child('operations').child('events').child('initialDocumentSignedBuyer').child(request.key).update({active: false})

    }
})

exports.signKyc = functions.database.ref(`server/operations/events/triggerSignKyc`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('signKyc');
    if (request) {
        let activeAccount = <any> await getUserActiveAccount(request.userId)
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        if (pendingOrder.userId === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({kycSigned: true})
            db.ref('server').child('users').child(request.userId).child('accounts').child(activeAccount.id).update({
                kycSigned: true, kycDocument: request.signedDocument,
                kycDocumentMd5: request.signedDocumentMd5
            })
            db.ref('server').child('operations/events').child('syncCase').push({
                user: request.userId,
                project: request.projectAddress,
                active: true
            })
            db.ref('server').child('operations/events').child('syncCaseTrigger').set({time: new Date().getTime()})
            await orderChangedNotification(pendingOrder)
        }
        db.ref('server').child('operations').child('events').child('signKyc').child(request.key).update({active: false})

    }
})


exports.initialDocumentSignedSeller = functions.database.ref(`server/operations/events/triggerInitialDocumentSignedSeller`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('initialDocumentSignedSeller');
    if (request) {
        let project = <any> await getProject(request.projectAddress)
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({
                sellerSignedTermSheet: true,
                signedTermSheet: request.signedDocument,
                signedTermSheetMd5: request.signedDocumentMd5,
            })
        }
        db.ref('server').child('operations').child('events').child('initialDocumentSignedSeller').child(request.key).update({active: false})

    }
})

exports.counterBuyerOffer = functions.database.ref(`server/operations/events/triggerCounterBuyerOffer`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('counterBuyerOffer');
    if (request) {
        let project = <any> await getProject(request.projectAddress)
        if (project.owner === request.userId) {
            db.ref('server').child('projects').child('pendingOrders').child(request.projectAddress).child(request.pendingOrderId).update({counterOffer: request.counterOffer})
        }
        db.ref('server').child('operations').child('events').child('counterBuyerOffer').child(request.key).update({active: false})

    }
})


exports.processUserOrder = functions.database.ref(`server/operations/events/triggerProcessOrder`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('processOrder');
    if (request) {
        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let project = <any> await getProject(request.projectAddress)
        console.log('Start Process')
        if (project.structure === 'Office') {
            await handleOfficeOrderRequest(request.userId, pendingOrder, project.trustee.user ? project.trustee.user : project.trustee, request.projectAddress, request.pendingOrderId)
        }
        if(pendingOrder.group){
            db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
                time: new Date().getTime()
            })

        }
        db.ref(`server/operations/events/processOrder/${request.key}`).update({
            active: false
        })
        await orderChangedNotification(pendingOrder)
    }
})


exports.processOrderNow = functions.database.ref(`server/operations/events/triggerProcessOrderNow`).onWrite(async (change, context) => {
    let db = admin.database()
    let request = <any> await getActiveRequest('processOrderNow');
    if (request) {

        let pendingOrder = <any> await getUserOffer(request.pendingOrderId, request.projectAddress)
        let project = <any> await getProject(request.projectAddress)
        console.log('Start Process')
        await handleOfficeOrderRequest(request.userId, pendingOrder, project.trustee.user ? project.trustee.user : project.trustee, request.projectAddress, request.pendingOrderId)
        console.log('Start done')
        if(pendingOrder.group){
            await db.ref('server').child('groups').child('changed').child(request.projectAddress).update({
                time: new Date().getTime()
            })
            console.log('Set User Offer to BC')
            await setUserOffer(pendingOrder.group, request.userId,  pendingOrder.amount)
            console.log('offer was set')
        }

        await orderChangedNotification(pendingOrder)
        db.ref(`server/operations/events/processOrderNow/${request.key}`).update({
            active: false
        })
        db.ref(`server/operations/events/triggerProcessOrderNow/`).update({
            time: new Date().getTime()
        })
    }

})


export async function handleOfficeOrderRequest(userId, pendingOrder, trustee, projectAddress, pendingOrderId) {
    let db = admin.database()
    
    console.log('Check KYC')
    let kyc = <any> await getOrCreateKycDocument(userId, trustee)
    console.log(` KYC document created or returned ${JSON.stringify(kyc)}`)
    let kycOperation = <any> await getOrCreateKycOperation(userId, kyc)
    console.log(` KYC operation created or returned ${JSON.stringify(kycOperation)}`)
    
    let project = <any> await getProject(projectAddress)
    if(parseInt(project.target)  == parseInt(pendingOrder.amount)){
        await buyAllProjectFlow(kycOperation, userId, pendingOrder, projectAddress, pendingOrderId, trustee)
    }else{
        await trusteeFlow(kycOperation, userId, pendingOrder, projectAddress, trustee, pendingOrderId)
    }
    

}

async function buyAllProjectFlow(kycOperation, userId, pendingOrder, projectAddress, pendingOrderId, trustee){
    let db = admin.database()
    let documentRef = db.ref(`server/legalDocuments/`)
    let standardAgrementKey = await documentRef.push({
        attributes: {
            price: parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price)
        },
        type: 'standardAgrement',
        project: projectAddress,
        orderId: pendingOrderId,
        owner: userId,
       
    }).key
    let signOperation = await db.ref(`server/operationHub/${userId}/operations`).push({
        name: 'standardAgrement',
        type: 'signDocument',
        time: new Date().getTime(),
        status: 'waiting',
        dependsOn: kycOperation.key,
        document: standardAgrementKey,
        orderId: pendingOrderId,
        project: projectAddress
    }).key
    await addNotification(userId, 'operation', 'standardAgrement')

    let trusteeTask = await db.ref(`server/operationHub/taskManager/`).push({
        active: true,
        signOperation: signOperation,
        signUser: userId,
        trustee: trustee,
        type: 'trusteeAgrement'
    }).key

    await db.ref(`server/operationHub/${userId}/operations/${signOperation}`).update({
        taskId: trusteeTask
    })

    await scheduleVideoMeeting(trustee, userId, projectAddress, false)
    await db.ref(`server/operationHub/taskManager/`).push({
        active: true,
        signOperation: signOperation,
        signUser: userId,
        trustee: trustee,
        type: 'notificationTrustee'
    }).key
}


async function trusteeFlow(kycOperation, userId, pendingOrder, projectAddress, trustee, pendingOrderId){
    let db = admin.database()
    let documentRef = db.ref(`server/legalDocuments/`)
    let trusteeAgrementKey = await documentRef.push({
        attributes: {
            price: parseInt(pendingOrder.amount) * parseFloat(pendingOrder.price)
        },
        type: 'trusteeAgrement',
        project: projectAddress,
        orderId: pendingOrderId,
        owner: userId,
        users: {
            [trustee]: 'read'
        },
    }).key
    let signOperation = await db.ref(`server/operationHub/${userId}/operations`).push({
        name: 'trusteeAgrement',
        type: 'signDocument',
        time: new Date().getTime(),
        status: 'waiting',
        dependsOn: kycOperation.key,
        document: trusteeAgrementKey,
        orderId: pendingOrderId,
        project: projectAddress
    }).key

    await addNotification(userId, 'operation', 'trusteeAgrement')

    let trusteeTask = await db.ref(`server/operationHub/taskManager/`).push({
        active: true,
        signOperation: signOperation,
        signUser: userId,
        trustee: trustee,
        type: 'trusteeAgrement'
    }).key

    await db.ref(`server/operationHub/${userId}/operations/${signOperation}`).update({
        taskId: trusteeTask
    })

    await scheduleVideoMeeting(trustee, userId, projectAddress, false)
    await db.ref(`server/operationHub/taskManager/`).push({
        active: true,
        signOperation: signOperation,
        signUser: userId,
        trustee: trustee,
        type: 'notificationTrustee'
    }).key
}

async function validateProject(project, orders) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalOrderPrice = orders.map(order => parseInt(order.amount) * parseFloat(order.price)).reduce(reducer)
    console.log('totalOrderPrice: ' + totalOrderPrice)
    return {success: totalOrderPrice >= parseInt(project.target)}
}


async function updateProjectInitialAsk(projectAddress, newBalance) {
    let project = <any> await getProject(projectAddress)
    let db = admin.database()
    if (project.tradeMethod === 'auction') {
        let askAuctionOrder = <any> await getProjectAuctionOrder(projectAddress)
        db.ref('server/projects/events/auctionOrders').child(projectAddress).child('ask').child(askAuctionOrder.key).update({
            amount: newBalance,
            size: newBalance
        })

    } else {
        let askOrder = <any> await getProjectAskOrder(projectAddress)
        db.ref('server/projects/orders').child(projectAddress).child('ask').child(askOrder.key).update({size: newBalance})
    }
}


async function getProjectPendingOrders(projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/projects/pendingOrders').child(projectAddress).once('value', function (snapshot) {
                let result = snapshot.val()
                console.log('ORDER ' + JSON.stringify(result))
                let orders = Object.keys(result).map(key => {
                    let order = result[key]
                    order.key = key
                    console.log('order object' + JSON.stringify(order))
                    return order
                })
                console.log('ORDER Done ' + JSON.stringify(orders))
                resolve(orders)
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getProjectAskOrder(projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/projects/orders').child(projectAddress).child('ask').once('value', function (snapshot) {
                let result = snapshot.val()
                let asks = result.map(key => {
                    let order = result[key]
                    order.key = key
                })
                resolve(asks[0])
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function getProjectAuctionOrder(projectAddress) {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/projects/events/auctionOrders').child(projectAddress).child('ask').once('value', function (snapshot) {
                let result = snapshot.val()
                let asks = result.map(key => {
                    let order = result[key]
                    order.key = key
                })
                resolve(asks[0])
            })
        } catch (error) {
            reject(error)
        }
    })
}