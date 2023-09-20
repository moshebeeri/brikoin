import {  projectTradeRequest, projectBidReserve, projectTradeMortgageRequest, projectBidMortgageRequest, projectBidRequest, projectAskRequest, projectAskMortgageRequest, projectCancelOrder, transferEtherFromAdmin, cancelProjectBidReserve} from './wallet'

const functions = require('firebase-functions')
const admin = require('firebase-admin')

import {
    getInternalTrades, getUserActiveAccount, getAdminAccount, updateUserBalance, getUserLastOffer,
    updateProjectChange, updateProjectHoldings, updateMortgageeBalannce, updateUserClearances, updateBrokerFees,
    updateTotalFees, getActiveRequest, getUserNonce, updateTransactionDone, getUserLastAuctionOffer
} from './utils'
exports.bidAsk6= functions.database.ref(`server/operations/events/internalTradeTriggerEvent`).onWrite(async (change, context) => {
    let db = admin.database()
        console.log('START BID/ASL')
        let tradeRequest = <any> await getInternalTrades()
        console.log(JSON.stringify(tradeRequest))
           if(tradeRequest) {
               await db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({active: false})

                let userAccount = <any> await getUserActiveAccount(tradeRequest.user)
                let admin = <any> await getAdminAccount('bidAsk')
               // await transferEtherFromAdmin(admin.accountId, admin.privateKey, userAccount.accountId)
                if(tradeRequest.type === 'EXTERNAL'){
                    console.log('START BID/ASL EXTERNAL' )
                    await handleBidAskSuccsess(tradeRequest, userAccount, 'EXTERNAL')
                    return
                }
                // await transferEtherFromAdmin( admin.accountId, userAccount.accountId)
                let response
                if (tradeRequest.isMortgage) {
                    if (tradeRequest.side === 'bid') {
                        console.log('****  MORTGAGE BID  *****')
                        response = <any> await projectBidMortgageRequest(userAccount.accountId, userAccount.privateKey, tradeRequest, admin.accountId, admin.privateKey, 0)
                        if(response.success){
                            await db.ref('server').child('/mortgages').child(tradeRequest.mortgageId).child('mortgagesRequests').child(tradeRequest.mortgageRequestId).update({trade: true})

                        }
                    } else {
                        console.log('****  MORTGAGE ASK  *****')
                        response = <any> await projectAskMortgageRequest(userAccount.accountId, userAccount.privateKey, tradeRequest, 0)
                        console.log('ASK MORTGAGE DONE')
                }} else {
                    console.log('****  STANDARD BID  *****')
                    console.log(userAccount.accountId + ' ' + userAccount.privateKey + ' ' + tradeRequest.projectId + ' ' + tradeRequest.size + ' ' + tradeRequest.price)
                    if (tradeRequest.side === 'bid') {
                        response = <any> await projectBidRequest(userAccount.accountId, tradeRequest.projectId, tradeRequest.size, tradeRequest.price, 0)
                    } else {
                        console.log('START ASK')
                        response = <any> await projectAskRequest(userAccount.accountId, tradeRequest.projectId, tradeRequest.size, tradeRequest.price, 0)
                    }
                }
                console.log('****  RESPONSE  BID/ ASK  *****:' + JSON.stringify(response))
                if (response.success) {
                    await handleBidAskSuccsess(tradeRequest, userAccount, response)
                }else{
                    db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({active: true})

                }
        }

        console.log('########## Handling internal bid/ask end ############')

})

let cancelBidOrder = async function (tradeRequest: any, db) {
    let lastOffer = <any> await getUserLastOffer(tradeRequest)
    let key = lastOffer.key
    if (key) {
        await  db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).child(key).remove()
    }
    return lastOffer;
};
let cancelBidAuctionOrder = async function (tradeRequest: any, db) {
    let lastOffer = <any> await getUserLastAuctionOffer(tradeRequest)
    let key = lastOffer.key
    if (key) {
        await  db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
            .child(tradeRequest.auctionId).child(tradeRequest.side).child(key).remove()
    }
    return lastOffer;
};


exports.cancelTrade2 = functions.database.ref(`server/operations/events/cancelTradeTriggerEvent`).onWrite(async (change, context) => {
    console.log('CANCEL INTERNAL ORDER')
    let db = admin.database()
    console.log('START INTERNAL ORDER')
    let tradeRequest = <any> await getInternalCancelTrades()
    console.log(JSON.stringify(tradeRequest))
    if (tradeRequest ) {
            console.log('TRADE REQUEST ' + JSON.stringify(tradeRequest))
            let userAccount = <any> await getUserActiveAccount(tradeRequest.user)
            await db.ref('server').child('/operations/events/cancelTradeRequest').child(tradeRequest.key).update({active: false})
            let response = <any> {}
            if(tradeRequest.type === 'INTERNAL') {
                response = <any> await projectCancelOrder(userAccount.accountId, userAccount.privateKey, tradeRequest.projectAddress)
                console.log('response ' + JSON.stringify(response))
            }else {
                response.success = true
            }
            if (response.success) {
                await updateUserBalance(tradeRequest.user, userAccount.accountId, userAccount.id, '', '')
                tradeRequest.projectId = tradeRequest.projectAddress
                let lastOffer = <any> {}
                if (tradeRequest.auctionId){
                    lastOffer = await cancelBidAuctionOrder(tradeRequest, db)
                }else{
                    lastOffer = await cancelBidOrder(tradeRequest, db);
                }

                if(lastOffer.mortgageAddress && lastOffer.mortgageId && lastOffer.mortgageRequestId) {
                    await  db.ref('server').child('mortgages').child(lastOffer.mortgageId).child('mortgagesRequests').child(lastOffer.mortgageRequestId).update({trade: false})
                }
                await  updateProjectChange(tradeRequest.projectAddress)
            }
    }
    console.log('########## Handling internal bid/ask end ############')

})

let updateBroker = async function (buyer: any) {
    console.log('UPDATE BROKER ACCOUNT BALANCE')
    let brokerAccount = <any> await getUserActiveAccount(buyer.brokerAccount)
    await updateBrokerFees(brokerAccount.user_id, brokerAccount.accountId, brokerAccount.id, buyer.accountId)
    console.log('FINISH UPDATE BROKER ACCOUNT BALANCE')
};
let updateAdmin = async function (trade: any, seller) {
    console.log('UPDATE ADMIN ')
    await  updateProjectHoldings(trade.seller, seller.accountId, trade.projectAddress)
    await  updateUserBalance(trade.seller, seller.accountId, seller.id, '', '')
    console.log('FINISH UPDATE ADMIN ')
};
let updateMortgageBalance = async function (trade: any) {
    console.log('UPDATE Mortgage balance')
    let mortgage = <any> await getMortgage(trade.buyerMortgageId)
    console.log('User: ' + mortgage.user)
    let userAccount = <any> await getUserActiveAccount(mortgage.user)
    await updateMortgageeBalannce(mortgage.user, userAccount.accountId)
    console.log('FINISH UPDATE Mortgage balance')
};
let getSellerAccount = async function (trade: any, admin: any) {
    let seller
    if (trade.seller === 'admin') {
        seller = admin
    } else {
        seller = <any> await getUserActiveAccount(trade.seller)
    }
    return seller;
};


exports.reserveBid = functions.database.ref(`server/operations/events/bidReservedTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    let bidReservedRequest = <any> await getActiveRequest('bidReserved')
    console.log('START reserveBid')
    if (bidReservedRequest && bidReservedRequest.project) {
        let userAccount = <any> await getUserActiveAccount(bidReservedRequest.userId)
        console.log('START reserveBid ' + JSON.stringify(bidReservedRequest))
        db.ref('server').child('operations').child('events').child('bidReserved').child(bidReservedRequest.key).update({active: false})
        let response = await projectBidReserve(userAccount.accountId, userAccount.privateKey, bidReservedRequest.project)
        if(response.success){
            db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).update({reserved: true})
            await updateUserBalance(bidReservedRequest.userId, userAccount.accountId, userAccount.id, '', bidReservedRequest.project)
            await updateTransactionDone(bidReservedRequest.project)
        }
    }
    console.log('END reserveBid')

})

exports.cancelReserveBid = functions.database.ref(`server/operations/events/cancelBidReservedTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
        let bidReservedRequest = <any> await getActiveRequest('cancelBidReserved')
    console.log('START reserveBid')
    if (bidReservedRequest && bidReservedRequest.project) {
        let userAccount = <any> await getUserActiveAccount(bidReservedRequest.userId)
        console.log('START reserveBid ' + JSON.stringify(bidReservedRequest))
        db.ref('server').child('operations').child('events').child('cancelBidReserved').child(bidReservedRequest.key).update({active: false})
        let response = await cancelProjectBidReserve(userAccount.accountId, userAccount.privateKey, bidReservedRequest.project)
        if(response.success){
            if(bidReservedRequest.deleteRequest){
                db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).remove()
            }else {
                db.ref('server').child('projects').child('pendingOrders').child(bidReservedRequest.project).child(bidReservedRequest.pendingOrderId).update({reserved: false})
            }
            await updateUserBalance(bidReservedRequest.userId, userAccount.accountId, userAccount.id, '', bidReservedRequest.project)
            await updateTransactionDone(bidReservedRequest.project)
        }
    }
    console.log('END reserveBid')

})

exports.handleTrade3 = functions.database.ref(`server/operations/events/tradeEventTrigger`).onWrite(async (change, context) => {
    let db = admin.database()
    console.log('##### start trade ####')
    let trade = <any> await getActiveTrades()
    let adminAccount = <any> await getAdminAccount('project')
    if(trade) {
        console.log('UPDATE trade :  ' + JSON.stringify(trade))
        await  db.ref('server').child('operations').child('events').child('tradeEvent').child(trade.key).update({active: false})
        let buyer = <any> await getUserActiveAccount(trade.buyer)
        let seller = await getSellerAccount(trade, adminAccount);
        if (trade.isBidMortgage || trade.isAskMortgage) {
            console.log('MORTGAGE PROCESS START')
            if (trade.isBidMortgage) {
                await createMortgagePaymentSchedule(trade.buyerMortgageAddress, trade.buyerMortgageRequestId, trade.buyerMortgageId)
            }
            let response = <any> await projectTradeMortgageRequest(buyer.accountId,
                seller.accountId,
                trade.amount,
                trade.price,
                adminAccount.accountId,
                adminAccount.privateKey,
                trade.projectAddress,
                trade.buyerMortgageAddress ? trade.buyerMortgageAddress : 0,
                trade.sellerMortgageAddress ? trade.sellerMortgageAddress : 0)
            console.log('MORTGAGE PROCESS')
            if(!response.success) {
                return
            }
            console.log("TRADE RESPONSE " + JSON.stringify(response))
            if(trade.sellerMortgageAddress && parseInt(response.sellerTotalClearances) >= 0) {
               await updateUserClearances(seller, response.sellerTotalClearances, trade.sellerMortgageAddress, trade.amount, trade.price, false, trade.projectAddress)

            }
        } else {
            let response =  await projectTradeRequest(buyer.accountId, seller.accountId, trade.amount, trade.price, adminAccount.accountId, adminAccount.privateKey, trade.projectAddress)
            console.log("TRADE RESPONSE " + JSON.stringify(response))
            if(!response.success) {
                return
            }
        }
        if (trade.isBidMortgage){
            await updateMortgageBalance(trade);
        }
        await updateProjectHoldings(trade.buyer, buyer.accountId, trade.projectAddress)
        await updateUserBalance(trade.buyer, buyer.accountId, buyer.id, '', '')
        if(buyer.brokerAccount) {
            await updateBroker(buyer);
        }

        if (trade.seller !== 'admin') {
            await updateAdmin(trade, seller);
        }
        //update pending order, order is done
        if(trade.pendingOrderId){
            db.ref('server/projects/pendingOrders/').child(trade.projectAddress).child(trade.pendingOrderId).update({active: false})
        }
        console.log('UPDATE PROJECT CHANGE ')
        await updateProjectChange(trade.projectAddress)
        console.log('FINISH UPDATE PROJECT CHANGE ')

        console.log('UPDATE GLOBAL FEES')
        await updateTotalFees(db, adminAccount)
        console.log('FINISH UPDATE GLOBAL FEES')
        await db.ref('server/operations/events/tradeEventTrigger').update({time: new Date().getTime()})
    }
    console.log('########## Handling internal trade end ############')

})


async function getMortgage (mortgageId){
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            console.log('Handle Mortgage request getter')
            db.ref('server').child('/mortgages/').child(mortgageId).once('value',function (snapshot) {
                let results = snapshot.val()
                resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}
async function getInternalCancelTrades () {
    return new Promise((resolve, reject) => {
        try {
            let db = admin.database()
            db.ref('server').child('/operations/events/cancelTradeRequest').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let trades = Object.keys(results).map(key => {
                        let trade = results[key]
                        trade.key = key
                        return trade
                    })
                    resolve(trades[0])
                }
                return []
            })
        } catch (error) {
            reject(error)
        }
    })
}

let handleAuction = async function (tradeRequest, db) {
    let key = await getUserLastAuctionOffer(tradeRequest)
    if (key) {
        await  db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
            .child(tradeRequest.auctionId).child(tradeRequest.side).child(key).update(tradeRequest)

    } else {
        await  db.ref('server').child('projects').child('events').child('auctionOrders').child(tradeRequest.projectId)
            .child(tradeRequest.auctionId).child(tradeRequest.side).push(tradeRequest)
    }
};

let handleBidAskTrade = async function (tradeRequest, db) {
    let key = await getUserLastOffer(tradeRequest)
    if (key) {
        await  db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).child(key).update(tradeRequest)
    } else {
        await  db.ref('server').child('projects').child('orders').child(tradeRequest.projectId).child(tradeRequest.side).push(tradeRequest)
    }
    const triggerTrade = {
        projectId: tradeRequest.projectId,
        timestamp: new Date().getTime()
    }
    await db.ref('server').child('projects').child('events').child('orders').set(triggerTrade)
};

async function handleBidAskSuccsess(tradeRequest, userAccount, response){
    let db = admin.database()
    await  db.ref('server').child('/operations/events/internalTradeRequest').child(tradeRequest.key).update({status: 'done'})
    await updateUserBalance(tradeRequest.user, userAccount.accountId, userAccount.id, '', '')

    if(tradeRequest.auctionId){
        await handleAuction(tradeRequest, db);
    }else {
        await handleBidAskTrade(tradeRequest, db);

    }
    await updateProjectChange(tradeRequest.projectId)

    console.log(JSON.stringify(response))
}

function createMortgagePaymentSchedule (mortgageAddress, buyerMortgageRequestId, buyerMortgageId) {
    let db = admin.database()
    db.ref('server').child('/operations/events/mortgagesPayment').push({
        mortgageAddress: mortgageAddress,
        buyerMortgageRequestId: buyerMortgageRequestId,
        buyerMortgageId: buyerMortgageId,
        active: true
    })
    db.ref('server').child('/operations/events/mortgagesPaymentTrigger').set({time: new Date().getTime()})
}

async function getActiveTrades () {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('/operations/events/tradeEvent').orderByChild('active').equalTo(true).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let trades = Object.keys(results).map(key => {
                        let trade = results[key]
                        trade.key = key
                        return trade
                    })
                    resolve(trades[0])
                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}
