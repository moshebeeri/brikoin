import { call, takeEvery, put, all, take, fork } from "redux-saga/effects";
import { config } from "../../conf/config";
import { types } from "../../redux/actions/properties";
import { eventChannel } from "redux-saga";
import { uploadFile } from "./propertyLoaderSaga";
import rsf from "../rsf";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/properties/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/properties/")
        .off(listener);
  });

  return listener;
}

function* updateProperties() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getProperties();
  }
}
function* saveNewProperty(action) {
  if (action.property.pictures && action.property.pictures.length > 0) {
    const fileListAsArray = Array.from(action.property.pictures);
    let responses = yield all(
      fileListAsArray.map(file => call(uploadFile, file))
    );
    let pictures = responses.map(response => response.url);
    action.property.pictures = pictures;
  }
  try {
    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("projectsCollections")
      .child("properties");
    yield call([activeRef, activeRef.push], action.property);
    yield put({
      type: types.PROPERTIES.NEW.SET,
      property: action.property
    });
  } catch (error) {
    console.log("failed to save to firestore");
  }
}

function* getProperties() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("properties");
  let response = yield call([activeRef, activeRef.once], "value");
  let propertiesList = response.val();
  let properties = Object.keys(propertiesList).map(key => {
    let data = propertiesList[key];
    data.id = key;
    return data;
  });
  yield put({
    type: types.PROPERTIES.SET_ALL,
    properties: properties
  });
}

export default function*() {
  yield [
    takeEvery(types.PROPERTIES.NEW.SAVE, saveNewProperty),
    takeEvery(types.PROPERTIES.GET_ALL, getProperties),
    fork(updateProperties)
  ];
}
