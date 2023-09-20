import { call, put, take, fork } from "redux-saga/effects";

import { types } from "../../redux/actions/projects";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/organization/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/organization/")
        .off(listener);
  });

  return listener;
}

function* updateOrganization() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getOrganization();
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

function* getOrganization() {
  try {
    const organization = rsf.app.database().ref("/server/organization/");
    let organizations = yield queryDB(organization);
    if (organizations) {
      yield put({
        type: types.SET_ORGANIZATION,
        organizations: organizations
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export default function*() {
  yield [fork(updateOrganization)];
}
