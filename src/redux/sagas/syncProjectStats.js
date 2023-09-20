import { take, fork, select } from "redux-saga/effects";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";
// import {updateStats, updateUserStats} from './tradeSaga'

export const getUser = state => state.login.user;
function createEventChannel() {
  const listener2 = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/changes")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/changes")
        .off(listener2);
  });

  return listener2;
}

function* listenForProjectsChange() {
  const updateChannel = createEventChannel();
  while (true) {
    let project = yield take(updateChannel);
    if (project && project.projectId) {
      // yield updateStats(project.projectId)
      let user = yield select(getUser);
      if (user) {
        // yield updateUserStats(project.projectId, user.uid)
      }
    }
  }
}

export default function*() {
  yield [fork(listenForProjectsChange)];
}
