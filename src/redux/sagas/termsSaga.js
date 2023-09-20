import { call, takeEvery, put, take, fork } from "redux-saga/effects";
import { config } from "../../conf/config";
import { types } from "../../redux/actions/terms";
import { eventChannel } from "redux-saga";

import rsf from "../rsf";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/terms/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/terms/")
        .off(listener);
  });

  return listener;
}

function* updateTerms() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getTerms();
  }
}
function* saveNewTerms(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("terms");
  yield call([activeRef, activeRef.push], action.terms);

  yield put({
    type: types.TERMS.NEW.SET,
    terms: action.terms
  });
}

function* getTerms() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("terms");
  let response = yield call([activeRef, activeRef.once], "value");
  let termsList = response.val();
  let terms = Object.keys(termsList).map(key => {
    let data = termsList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.TERMS.SET_ALL,
    terms: terms
  });
}
export default function*() {
  yield [
    takeEvery(types.TERMS.NEW.SAVE, saveNewTerms),
    takeEvery(types.TERMS.GET_ALL, getTerms),
    fork(updateTerms)
  ];
}
