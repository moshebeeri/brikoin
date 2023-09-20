import { call, takeEvery, put, take, fork } from "redux-saga/effects";

import { types } from "../../redux/actions/managers";
import { config } from "../../conf/config";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/managers/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/managers/")
        .off(listener);
  });

  return listener;
}

function* updateManagers() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getManagers();
  }
}
function* saveNewManager(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("managers");
  yield call([activeRef, activeRef.push], action.managers);
  yield put({
    type: types.MANAGERS.NEW.SET,
    manager: action.manager
  });
}

function* getManagers() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("managers");
  let response = yield call([activeRef, activeRef.once], "value");
  let managersList = response.val();
  let managers = Object.keys(managersList).map(key => {
    let data = managersList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.MANAGERS.SET_ALL,
    managers: managers
  });
}

export default function*() {
  yield [
    takeEvery(types.MANAGERS.NEW.SAVE, saveNewManager),
    takeEvery(types.MANAGERS.GET_ALL, getManagers),
    fork(updateManagers)
  ];
}
