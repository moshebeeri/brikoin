import { call, takeEvery, put, take } from "redux-saga/effects";

import { types } from "../../redux/actions/genericList";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createEventChannel(listPath) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref(listPath)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref(listPath)
        .off(listener);
  });
  return listener;
}

function* listenForListChanges(action) {
  console.log(action);
  if (action.listPath) {
    const updateChannel = createEventChannel(action.listPath);
    while (true) {
      yield take(updateChannel);
      yield getNextPage(action);
    }
  }
}

function* getNextPage(action) {
  let query;
  query = rsf.app
    .database()
    .ref(action.listPath)
    .orderByChild(action.sortBy)
    .limitToLast(action.pageLength);
  if (action.key) {
    query = rsf.app
      .database()
      .ref(action.listPath)
      .orderByChild(action.sortBy)
      .limitToLast(action.pageLength)
      .endAt(action.key);
  }
  let results = yield queryDB(query);
  yield put({
    type: action.saveTypeAction,
    results: results
  });
}
export function* getAllList(action) {
  let query;
  query = rsf.app.database().ref(action.listPath);
  let results = yield queryDB(query);
  yield put({
    type: action.saveTypeAction,
    results: results
  });
}

function* getLastPage(action) {
  let query;
  query = rsf.app
    .database()
    .ref(action.listPath)
    .orderByChild(action.sortBy)
    .limitToFirst(action.pageLength);
  if (action.key) {
    query = rsf.app
      .database()
      .ref(action.listPath)
      .orderByChild(action.sortBy)
      .limitToFirst(action.pageLength)
      .startAt(action.key);
  }
  let results = yield queryDB(query);
  yield put({
    type: action.saveTypeAction,
    results: results
  });
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

export default function* genericListSaga() {
  yield [
    takeEvery(types.GET_NEXT_PAGE, getNextPage),
    takeEvery(types.GET_LAST_PAGE, getLastPage),
    takeEvery(types.LISTEN_FOR_LIST, listenForListChanges)
  ];
}
