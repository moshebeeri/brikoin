import { call, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/groups";
import rsf from "../rsf";

function* inviteUser(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/inviteUser");
    yield call([request, request.push], {
      creator: action.creator,
      userId: action.user,
      active: true,
      groupId: action.group
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/inviteUserTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}

function* addGroupRepresentative(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/groupRepresented");
    yield call([request, request.push], {
      creator: action.creator,
      userId: action.user,
      active: true,
      groupId: action.group
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/groupRepresentedTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}
function* addGroupVotingRights(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/groupVotingRights");
    yield call([request, request.push], {
      memberId: action.userMemberId,
      creator: action.creator,
      userId: action.user,
      active: true,
      groupId: action.group
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/groupVotingRightsTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}
function* acceptInvitation(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/acceptInvitation");
    yield call([request, request.push], {
      memberId: action.memberId,
      userId: action.user,
      active: true,
      groupId: action.group
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/acceptInvitationTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}
function* createGroup(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/createGroup");
    yield call([request, request.push], {
      name: action.name,
      active: true,
      userId: action.user,
      type: action.groupType,
      project: action.project
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/createGroupTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}
function* joinGroup(action) {
  if (action.user) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/joinGroup");
    yield call([request, request.push], {
      active: true,
      userId: action.user,
      groupId: action.group
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/joinGroupTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}

function* cancelOrder(action) {
  if (action.userId) {
    const request = rsf.app
      .database()
      .ref("/server/operations/events/cancelGroupPendingOrder");
    yield call([request, request.push], {
      active: true,
      user: action.userId,
      groupId: action.groupId,
      projectAddress: action.project
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerCancelGroupPendingOrder");
    yield call([triggerAdd, triggerAdd.set], { time: new Date().getTime() });
  }
}

export default function* groupsSaga() {
  yield [
    takeEvery(types.INVITE_USER, inviteUser),
    takeEvery(types.ADD_GROUP_REPRESENTATIVE, addGroupRepresentative),
    takeEvery(types.ADD_GROUP_VOTING_RIGHTS, addGroupVotingRights),
    takeEvery(types.CREATE_GROUP, createGroup),
    takeEvery(types.JOIN_GROUP, joinGroup),
    takeEvery(types.CANCEL_USER_GROUP_ORDER, cancelOrder),
    takeEvery(types.ACCEPT_INVITATION, acceptInvitation)
  ];
}
