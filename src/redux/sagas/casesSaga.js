import { call, takeEvery, put, take } from "redux-saga/effects";

import { types } from "../../redux/actions/case";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";
import { uploadFile } from "./propertyLoaderSaga";
function createEventChannel(userId) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/cases")
      .child(userId)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/cases")
        .child(userId)
        .off(listener);
  });
  return listener;
}

function createPendingEventChannel(projectAddress) {
  console.log(projectAddress);
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projects/pendingOrders")
      .child(projectAddress)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projects/pendingOrders")
        .child(projectAddress)
        .off(listener);
  });
  return listener;
}

function* listenForCases(action) {
  console.log(action);
  if (action.user.uid) {
    const updateChannel = createEventChannel(action.user.uid);
    while (true) {
      yield take(updateChannel);
      yield getCases(action);
    }
  }
}

function* listenForPendingRequests(action) {
  console.log(action);
  if (action.projectAddress) {
    const updateChannel = createPendingEventChannel(action.projectAddress);
    while (true) {
      yield take(updateChannel);
    }
  }
}

function* getCases(action) {
  const query = rsf.app
    .database()
    .ref("/server/cases")
    .child(action.user.uid);
  let results = yield queryDB(query);
  yield put({
    type: types.SET_CASES,
    cases: results
  });
}

function* saveCase(action) {
  console.log(action);
  if (action.entity.documentOne_file) {
    const metadata = yield uploadFile(action.entity.documentOne_file[0]);
    action.entity.documentOne = metadata.url;
  }
  if (action.entity.documentTwo_file) {
    const metadata = yield uploadFile(action.entity.documentTwo_file[0]);
    action.entity.documentTwo = metadata.url;
  }
  if (action.entity.documentThree_file) {
    const metadata = yield uploadFile(action.entity.documentThree_file[0]);
    action.entity.documentThree = metadata.url;
  }

  if (action.entity.signature_file) {
    const metadata = yield uploadFile(action.entity.signature_file);

    action.entity.signatureUrl = metadata.url;
    action.entity.signatureMd5 = metadata.md5;
  }
  if (action.entity.id) {
    const casesUpdate = rsf.app
      .database()
      .ref("/server/cases/")
      .child(action.user.uid)
      .child(action.entity.id);
    yield call([casesUpdate, casesUpdate.update], action.entity);
  } else {
    const casesAdd = rsf.app
      .database()
      .ref("/server/cases/")
      .child(action.user.uid);
    yield call([casesAdd, casesAdd.push], action.entity);
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

export default function* casesSaga() {
  yield [
    takeEvery(types.SAVE_CASE, saveCase),
    takeEvery(types.LISTEN_CASE, listenForCases),
    takeEvery(types.GET_CASES, getCases),
    takeEvery(types.LISTEN_PROJECT_REQUESTS, listenForPendingRequests)
  ];
}
