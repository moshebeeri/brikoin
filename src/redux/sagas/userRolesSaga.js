import { call, takeEvery, put, take } from "redux-saga/effects";

import { types } from "../../redux/actions/userRoles";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";
import { uploadFile } from "./propertyLoaderSaga";
function createEventChannel(userId) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/userRoleRequest")
      .child(userId)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/userRoleRequest")
        .child(userId)
        .off(listener);
  });
  return listener;
}

function createEventChannelRequests() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/userRoleRequest")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/userRoleRequest")
        .off(listener);
  });
  return listener;
}

function* listenForUserRoles(action) {
  console.log(action);
  if (action.user.uid) {
    yield getUserRoles(action);
    const updateChannel = createEventChannel(action.user.uid);
    while (true) {
      yield take(updateChannel);
      yield getUserRoles(action);
    }
  }
}
function* listenForRolesRequest(action) {
  console.log(action);
  const updateChannel = createEventChannelRequests();
  while (true) {
    yield take(updateChannel);
    yield getUserRequests();
  }
}

function* getUserRequests() {
  const query = rsf.app.database().ref("/server/userRoleRequest");
  let results = yield queryUserRolesDB(query);
  yield put({
    type: types.SET_ADMIN_ROLE_REQUESTS,
    roles: results
  });
}

function* approveRole(action) {
  const request = rsf.app
    .database()
    .ref("/server/operations/events/approveRoleRequest");
  let id = new Date().getTime();
  action.role.active = true;
  action.role.approve = action.entity.approve;
  yield call([request, request.push], action.role);
  const triggerAdd = rsf.app
    .database()
    .ref("/server/operations/events/approveRoleRequestTrigger");
  yield call([triggerAdd, triggerAdd.set], { time: id });
}

function* getUserRoles(action) {
  const query = rsf.app
    .database()
    .ref("/server/userRoleRequest")
    .child(action.user.uid);
  let results = yield queryDB(query);
  yield put({
    type: types.SET_ROLE_REQUEST,
    userRoleRequests: results
  });
}

function* askRole(action) {
  console.log(action);
  if (action.role.documentOne_file) {
    const metadata = yield uploadFile(action.role.documentOne_file[0]);
    action.role.documentOne = metadata.url;
  }
  if (action.role.documentTwo_file) {
    const metadata = yield uploadFile(action.role.documentTwo_file[0]);
    action.role.documentTwo = metadata.url;
  }
  if (action.role.id) {
    const userRoleRequest = rsf.app
      .database()
      .ref("/server/userRoleRequest/")
      .child(action.user.uid)
      .child(action.role.id);
    yield call([userRoleRequest, userRoleRequest.update], action.role);
  } else {
    action.role.approved = false;
    const userRoleRequest = rsf.app
      .database()
      .ref("/server/userRoleRequest/")
      .child(action.user.uid);
    yield call([userRoleRequest, userRoleRequest.push], action.role);
  }
}

let queryDB = function*(query) {
  return yield call(function() {
    return new Promise(function(resolve) {
      try {
        query.once("value", function(snap) {
          let results = snap.val();
          if (results) {
            resolve(
              Object.keys(results).map(key => {
                let row = results[key];
                row.id = key;
                return row;
              })
            );
            return;
          }
          resolve([]);
        });
      } catch (error) {
        console.log("ERROR " + JSON.stringify(error));
      }
    });
  });
};
let queryUserRolesDB = function*(query) {
  return yield call(function() {
    return new Promise(function(resolve) {
      try {
        query.once("value", function(snap) {
          let results = snap.val();
          if (!results) {
          } else {
            let roles = Object.keys(results).map(key => {
              let row = results[key];
              let result = Object.keys(row).map(roleKey => {
                let userRole = row[roleKey];
                userRole.requestId = roleKey;
                userRole.userId = key;
                return userRole;
              });
              return result;
            });

            resolve(roles.flat(1));
            return;
          }
          resolve([]);
        });
      } catch (error) {
        console.log("ERROR " + JSON.stringify(error));
      }
    });
  });
};

export default function* userRolesSaga() {
  yield [
    takeEvery(types.ASK_ROLE, askRole),
    takeEvery(types.APPROVE_ROLE, approveRole),
    takeEvery(types.LISTEN_ROLE_REQUEST, listenForUserRoles),
    takeEvery(types.LISTEN_ROLE_ADMIN_REQUESTS, listenForRolesRequest)
  ];
}
