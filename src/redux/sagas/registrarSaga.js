import { call, put, takeEvery, take, fork } from "redux-saga/effects";
import { config } from "../../conf/config";
import { types } from "../../redux/actions/registrars";
import { eventChannel } from "redux-saga";

import rsf from "../rsf";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/registrars/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/registrars/")
        .off(listener);
  });

  return listener;
}

function* updateRegistrars() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getRegistrars();
  }
}
function* saveNewRegistrar(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("registrars");
  yield call([activeRef, activeRef.push], action.registrar);
  yield put({
    type: types.REGISTRARS.NEW.SET,
    registrar: action.registrar
  });
}

function* getRegistrars() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("registrars");
  let response = yield call([activeRef, activeRef.once], "value");
  let registrarsList = response.val();
  let registrars = Object.keys(registrarsList).map(key => {
    let data = registrarsList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.REGISTRARS.SET_ALL,
    registrars: registrars
  });
}

export default function*() {
  yield [
    takeEvery(types.REGISTRARS.NEW.SAVE, saveNewRegistrar),
    takeEvery(types.REGISTRARS.GET_ALL, getRegistrars),
    fork(updateRegistrars)
  ];
}
