import { call, put, take, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/notifications";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";
import { uploadFile } from "./propertyLoaderSaga";

function createEventChannel(userId) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/notifications")
      .child(userId)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/notifications")
        .child(userId)
        .off(listener);
  });
  return listener;
}

function* listenForNotifications(action) {
  console.log(action);
  if (action.user.uid) {
    const updateChannel = createEventChannel(action.user.uid);
    while (true) {
      yield take(updateChannel);
      yield getNotifications(action);
    }
  }
}

function* getNotifications(action) {
  const query = rsf.app
    .database()
    .ref("/server/notifications")
    .child(action.user.uid);
  let results = yield queryDB(query);
  yield put({
    type: types.SET_NOTIFICATIONS,
    notifications: results
  });
}

function* saveNotifications(action) {
  console.log(action);
  if (action.entity.id) {
    if (action.entity.pdf_file) {
      const metadata = yield uploadFile(action.entity.pdf_file[0]);
      action.entity.pdf = metadata.url;
    }
    const notificationsUpdate = rsf.app
      .database()
      .ref("/server/notifications/")
      .child(action.user.uid)
      .child(action.entity.id);
    yield call(
      [notificationsUpdate, notificationsUpdate.update],
      action.entity
    );
  } else {
    const notificationsAdd = rsf.app
      .database()
      .ref("/server/notifications/")
      .child(action.user.uid);
    yield call([notificationsAdd, notificationsAdd.push], action.entity);
  }
}

function* notificationRead(action) {
  if (action.notificationId) {
    const notificationsUpdate = rsf.app
      .database()
      .ref("/server/notifications/")
      .child(action.user.uid)
      .child(action.notificationId);
    yield call([notificationsUpdate, notificationsUpdate.update], {
      read: true
    });
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
export default function* notificationsSaga() {
  yield [
    takeEvery(types.SAVE_NOTIFICATION, saveNotifications),
    takeEvery(types.SET_NOTIFICATION_READ, notificationRead),
    takeEvery(types.LISTEN_NOTIFICATIONS, listenForNotifications)
  ];
}
