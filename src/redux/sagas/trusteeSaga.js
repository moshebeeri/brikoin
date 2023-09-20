import { call, takeEvery, put, take, fork } from "redux-saga/effects";

import { types } from "../../redux/actions/trustees";
import { config } from "../../conf/config";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";
import { uploadFile } from "./propertyLoaderSaga";
function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/trustees/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/trustees/")
        .off(listener);
  });

  return listener;
}

function* updateTrustees() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getTrustees();
  }
}
function* saveNewTrustee(action) {
  if (!action.trustee.pdf) {
  } else {
    const metadata = yield uploadFile(action.trustee.pdf_file[0]);
    action.trustee.pdf = metadata.url;
  }
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("trustees");
  yield call([activeRef, activeRef.push], action.trustee);

  yield put({
    type: types.TRUSTEES.NEW.SET,
    trustee: action.trustee
  });
}

function* getTrustees() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("trustees");
  let response = yield call([activeRef, activeRef.once], "value");
  let trusteesList = response.val();
  let trustees = Object.keys(trusteesList).map(key => {
    let data = trusteesList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.TRUSTEES.SET_ALL,
    trustees: trustees
  });
}

export default function*() {
  yield [
    takeEvery(types.TRUSTEES.NEW.SAVE, saveNewTrustee),
    takeEvery(types.TRUSTEES.GET_ALL, getTrustees),
    fork(updateTrustees)
  ];
}
