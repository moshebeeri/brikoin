import { call, takeEvery, put, take, fork } from "redux-saga/effects";

import { types } from "../../redux/actions/estimations";
import { config } from "../../conf/config";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/estimations/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/estimations/")
        .off(listener);
  });

  return listener;
}

function* updatePEstimations() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getEstimation();
  }
}

function* saveNewEstimation(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("estimations");
  yield call([activeRef, activeRef.push], action.estimations);

  yield put({
    type: types.ESTIMATIONS.NEW.SET,
    estimation: action.estimation
  });
}

function* getEstimation() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("estimations");
  let response = yield call([activeRef, activeRef.once], "value");
  let estimationsList = response.val();
  let estimations = Object.keys(estimationsList).map(key => {
    let data = estimationsList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.ESTIMATIONS.SET_ALL,
    estimations: estimations
  });
}

export default function*() {
  yield [
    takeEvery(types.ESTIMATIONS.NEW.SAVE, saveNewEstimation),
    takeEvery(types.ESTIMATIONS.GET_ALL, getEstimation),
    fork(updatePEstimations)
  ];
}
