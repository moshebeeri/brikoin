import {getGroup, getGroupByCreatorName, getGroupTask, getProject} from "../operations/utils";

const functions = require('firebase-functions')
const admin = require('firebase-admin')


const runtimeOpts = {
    timeoutSeconds: 540
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms * 1000))
}

exports.testGroupFlow = functions.runWith(runtimeOpts).database.ref(`server/test/groups/trigger`).onWrite(async (change) => {
    let configuration = <any> await getGroupTestConfiguration();
    if (configuration.project) {
        console.log('Creating Group')
        await createGroup(configuration.groupName, configuration.creator, configuration.project)
        await delay(160)
        let group = <any> await getGroupByCreatorName(configuration.creator, configuration.groupName)
        console.log(`Group Created ${JSON.stringify(group)}`)
        if (!group) {
            await testGroupFailed('Group creation failed')
            return
        }

        let task = await getGroupTask(group.id, 'triggerGroupInvestment')
        if (!task) {
            await testGroupFailed('Group Investment task creation failed')
            return
        }


        let addUser = await addUserToGroup(configuration.user1, group, configuration.creator)
        if (!addUser) {
            await clearResources(group, configuration)
            return
        }

        let addUser2 = await addUserToGroup(configuration.user2, group, configuration.creator)
        if (!addUser2) {
            await clearResources(group, configuration)
            return
        }
        let addUser3 = await addUserToGroup(configuration.user3, group, configuration.creator)
        if (!addUser3) {
            await clearResources(group, configuration)
            return
        }
        let orderIdCreator = await investInProject(configuration.creator, configuration.creatorAmount, configuration.project, group.id)
        console.log(`creator order id completed; ${orderIdCreator}`)
        let orderIdUser1 = await investInProject(configuration.user1, configuration.user1Amount, configuration.project, group.id)
        console.log(`user1 order id completed; ${orderIdUser1}`)
        let orderIdUser2 = await investInProject(configuration.user2, configuration.user2Amount, configuration.project, group.id)
        console.log(`orderIdUser2 order id completed; ${orderIdUser2}`)
        let orderIdUser3 = await investInProject(configuration.user3, configuration.user3Amount, configuration.project, group.id)
        console.log(`orderIdUser3 order id completed; ${orderIdUser3}`)
        console.log(`waiting for scheduler ....`)
        await triggerScheduler()
        await delay(64)
        await testGroupVotingFlow(configuration, group)
        console.log(`test after scheduler ....`)
        await delay(40)
        await clearResources(group, configuration, orderIdCreator, orderIdUser1, orderIdUser2, orderIdUser3)
        await testGroupDone()
        console.log(`Group Deleted`)

    }

});

async function testGroupVotingFlow(configuration, group) {

    let updatedGroup = <any> await getGroup(group.id)
    let result = await addGroupRepresentative(configuration.creator, updatedGroup.id)
    if (!result) {
        return
    }
    result = await addVotingRights(configuration.user1, updatedGroup, configuration.trustee)
    if (!result) {
        return
    }

    result = await addVotingRights(configuration.user2, updatedGroup,  configuration.trustee)
    if (!result) {
        return
    }

    result = await addVotingRights(configuration.user3, updatedGroup,  configuration.trustee)
    if (!result) {
        return
    }
    result = await addGroupVote(updatedGroup)
    if (!result) {
        return
    }

    result = await voteUser(updatedGroup, configuration.user1, true)
    if (!result) {
        return
    }

    result = await voteUser(updatedGroup, configuration.user2, false)
    if (!result) {
        return
    }

    result = await voteUser(updatedGroup, configuration.user3, true)
    if (!result) {
        return
    }

    // let votingResults = await getVotingResults(group)

}

async function addGroupRepresentative(user, groupId) {
    let db = admin.database()
    await db.ref('/server/operations/events/groupRepresented/').push({
        active: true,
        userId: user,
        creator: user,
        groupId: groupId
    })

    await db.ref('/server/operations/events/groupRepresentedTrigger/').set({
        time: new Date().getTime()

    })
    await delay(24)
    let group = <any> await getGroup(groupId)
    if (group.representatives && Object.keys(group.representatives).length > 0) {
        return true
    }
    await testGroupFailed(`add group representative ${user}`)
    return false

}

async function addGroupVote(group) {
    let db = admin.database()
    await db.ref('/server/operations/events/addGroupVote/').push({
        active: true,
        userId: group.creator,
        subject: 'test',
        documentMd5: 'testMd5',
        type: 'MAJOR',
        documentUrl: 'testUrl',
        groupId: group.id,
        time: new Date().getTime()
    })

    await db.ref('/server/operations/events/addGroupVoteTrigger/').set({
        time: new Date().getTime()

    })
    await delay(35)
    let groupLatest = <any> await getGroup(group.id)
    if (groupLatest.votes && Object.keys(groupLatest.votes).length > 0) {
        return true
    }


    await testGroupFailed(`create Votes `)
    return false
}

async function addVotingRights(user, group, trustee) {
    let userMemberId = getUserMemberId(group.members, user)
    let db = admin.database()
    await db.ref('/server/operations/events/groupPaymentStatus/').push({
        active: true,
        userId: user,
        groupId: group.id,
        trustee: trustee,
        amount: 0,
        addOperation: true,
        memberId: userMemberId
    })

    await db.ref('/server/operations/events/groupPaymentStatusTrigger/').set({
        time: new Date().getTime()

    })
    await delay(24)
    let groupLatest = <any> await getGroup(group.id)

    if (groupLatest.members[userMemberId].votingRights) {
        return true
    }

    await testGroupFailed(`add user voting rights ${user}`)
    return true
}

async function voteUser(group, user, status) {
    let db = admin.database()
    let groupLatest = <any> await getGroup(group.id)
    let voteId = Object.keys(groupLatest.votes)[0]
    let votes = groupLatest.votes[voteId].results ? Object.keys(groupLatest.votes[voteId].results).length : 0
    let documentMd5 = groupLatest.votes[voteId].documentMd5

    await db.ref('/server/operations/events/groupVote/').push({
        active: true,
        vote: status,
        userId: user,
        documentMd5: documentMd5,
        voteId: voteId,
        groupId: group.id,
    })

    await db.ref('/server/operations/events/groupVoteTrigger/').set({
        time: new Date().getTime()

    })
    await delay(24)
    groupLatest = <any> await getGroup(group.id)
    let voted = groupLatest.votes[voteId].results ? Object.keys(groupLatest.votes[voteId].results).length : 0


    if (voted - 1 === votes) {
        return true
    }

    await testGroupFailed(`user voted ${user}`)
    return true

}

async function getVotingResults(configuration) {
    return {}
}
async function triggerScheduler() {
    let db = admin.database()
    await db.ref('server/taskScheduler/trigger').set({time: new Date().getTime()})

}

async function clearResources(group, configuration, ...orderIds) {
    // TODO clear notification
    console.log('start resource cleaning')
    await deleteGroup(group.id)

    await deleteGroupsTasks(group.id, configuration)
    let project = <any> await getProject(configuration.project)
    let trusteeId = project.trustee ? project.trustee.user ? project.trustee.user : project.trustee : ''
    if (trusteeId) {
        await deleteUserOperation(trusteeId, configuration.project)
    }
    await deleteUserOperation(configuration.creator, configuration.project)
    await deleteUserOperation(configuration.user1, configuration.project)
    await deleteUserOperation(configuration.user2, configuration.project)
    await deleteUserOperation(configuration.user3, configuration.project)

    await deleteUserDocuments(configuration.creator)
    await deleteUserDocuments(configuration.user1)
    await deleteUserDocuments(configuration.user2)
    await deleteUserDocuments(configuration.user3)

    console.log(`Orders ${JSON.stringify(orderIds)}`)
    await Promise.all(orderIds.map(order => deleteOrder(order, configuration.project)))

}

async function investInProject(userId, amount, projectAddress, groupId) {
    let db = admin.database()
    const orderId = await db.ref(`/server/projects/pendingOrders/${projectAddress}`).push({
        active: true,
        project: projectAddress,
        userId: userId,
        price: 1,
        amount: amount,
        group: groupId,
        reserved: false
    }).key

    await db.ref('/server/operations/events/processOrder/').push({
        active: true,
        projectAddress: projectAddress,
        pendingOrderId: orderId,
        userId: userId
    })

    await db.ref('/server/operations/events/triggerProcessOrder/').set({
        time: new Date().getTime()

    })
    await delay(4)

    console.log(`project Order created ${orderId}`)
    return orderId
}

async function addUserToGroup(user, group, groupCreator) {
    await inviteUser(user, group.id, groupCreator)
    await delay(25)
    let updatedGroup = <any> await getGroup(group.id)
    console.log(`group with new member ${JSON.stringify(updatedGroup.members)}`)
    let userMemberId = getUserMemberId(updatedGroup.members, user)
    if (!userMemberId) {
        await testGroupFailed(`Invite Member failed ${user}`)
        return false
    }
    if (userMemberId) {
        await acceptInvitation(user, group.id, userMemberId)
        await delay(25)
        let latestGroup = <any> await getGroup(group.id)
        if (latestGroup.members[userMemberId].status !== 'Active') {
            await testGroupFailed(`Accept invitation failed ${user}`)
            return false
        }
    }

    return true
}

async function testGroupFailed(message) {
    let db = admin.database()
    db.ref('server/test/groups/results').push({
        message: message,
        status: 'Failed',
        time: new Date().getTime()
    })
}

async function testGroupDone() {
    let db = admin.database()
    db.ref('server/test/groups/results').push({
        status: 'Success',
        time: new Date().getTime()
    })
}

function getUserMemberId(groupMembers, userId) {
    let ids = Object.keys(groupMembers).filter(key => groupMembers[key].userId === userId)
    if (ids.length > 0) {
        return ids[0]
    }
    return ''
}

async function getGroupTestConfiguration() {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child('test/groups/configuration').once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                resolve(results)
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function  createGroup(groupName, groupCreator, project) {
    let db = admin.database();
    await db.ref('server/operations/events/createGroup').push({
        active: true,
        name: groupName,
        userId: groupCreator,
        project: project,
        type: 'CLOSED'
    })
    await db.ref('server/operations/events/createGroupTrigger').set({time: new Date().getTime()})

}

async function inviteUser(user, groupId, groupCreator) {
    let db = admin.database();
    await db.ref('server/operations/events/inviteUser').push({
        active: true,
        creator: groupCreator,
        groupId: groupId,
        userId: user
    })
    await db.ref('server/operations/events/inviteUserTrigger').set({time: new Date().getTime()})

}

async function acceptInvitation(user, groupId, memberId) {
    let db = admin.database();
    await db.ref('server/operations/events/acceptInvitation').push({
        active: true,
        groupId: groupId,
        memberId: memberId,
        userId: user
    })
    await db.ref('server/operations/events/acceptInvitationTrigger').set({time: new Date().getTime()})

}

async function deleteGroup(groupId) {
    let db = admin.database();
    db.ref('server/groups/').child(groupId).remove()

}

async function deleteOrder(orderId, projectAddress) {
    let db = admin.database();
    console.log(`deleting  orderId ${orderId} projectAddress ${projectAddress}`)
    db.ref(`server/projects/pendingOrders/${projectAddress}`).child(orderId).remove()

}


async function deleteGroupsTasks(groupId, configuration) {
    let db = admin.database();
    let project = <any> await getProject(configuration.project)
    let trusteeId = project.trustee ? project.trustee.user ? project.trustee.user : project.trustee : ''
    if (trusteeId) {
        await deleteUserTasks(trusteeId)
    }
    await deleteUserTasks(configuration.creator)
    await deleteUserTasks(configuration.user1)
    await deleteUserTasks(configuration.user2)
    await deleteUserTasks(configuration.user3)
    console.log(`deleting ${groupId} tasks`)
    let task1 = <any> await getGroupTask(groupId, 'triggerGroupDone')
    if (task1) {
        db.ref(`server/operationHub/taskManager/${task1.id}/`).remove()
    }
    let task2 = <any> await getGroupTask(groupId, 'triggerGroupInvestment')
    if (task2) {
        db.ref(`server/operationHub/taskManager/${task2.id}/`).remove()
    }
    // db.ref(`server/project/${projectAddress}/`).child(orderId).remove()

}

async function deleteUserTasks(userId) {

    await removeTasks(userId, 'user')
    await removeTasks(userId, 'userId')
    await removeTasks(userId, 'signUser')
    await removeTasks(userId, 'operationUserId')

}

async function removeTasks(userId, param) {
    let db = admin.database();

    let tasks = <any> await getUserTasks(userId, param)
    if (tasks.length > 0) {
        tasks.forEach(task => {
            db.ref(`server/operationHub/taskManager`).child(task.id).remove()
        })
    }

}


export async function getUserTasks(userId, param) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child(`operationHub/taskManager`).orderByChild(param).equalTo(userId).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let tasks = Object.keys(results).map(key => {
                        let task = results[key]
                        task.id = key
                        return task
                    })

                    resolve(tasks)
                    return

                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}

export async function getUserDocuments(userId) {
    let db = admin.database()
    return new Promise((resolve, reject) => {
        try {
            db.ref('server').child(`legalDocuments`).orderByChild('owner').equalTo(userId).once('value', function (snapshot) {
                let results = snapshot.val()
                console.log(results)
                if (results) {
                    let documents = Object.keys(results).map(key => {
                        let document = results[key]
                        document.id = key
                        return document
                    })

                    resolve(documents)
                    return

                }
                resolve([])
            })
        } catch (error) {
            reject(error)
        }
    })
}

async function deleteUserOperation(userId, project) {
    let db = admin.database();
    db.ref(`server/operationHub/${userId}/operations`).remove()
    db.ref(`server/notifications/${userId}`).remove()

}


async function deleteUserDocuments(userId) {
    let documents = <any> await getUserDocuments(userId)
    if (documents.length > 0) {
        let db = admin.database();
        Promise.all(documents.map(doucment => {
            db.ref(`server/legalDocuments/${doucment.id}`).remove()
        }))
    }

}

