import { takeEvery, take, put } from "redux-saga/effects";

import { types } from "../../redux/actions/ledger";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createLedgerEventChannel(user) {
  try {
    const listener = eventChannel(emit => {
      rsf.app
        .database()
        .ref("/server/users")
        .child(user)
        .child("ledger")
        .on("value", data => {
          const result = data.val();
          if (result) {
            emit(result);
          }
        });
      return () =>
        rsf.app
          .database()
          .ref("/server/users")
          .child(user)
          .child("ledger")
          .off(listener);
    });
    return listener;
  } catch (e) {
    console.log("ERROR");
    return null;
  }
}

function* listenForLedger(action) {
  if (action.user) {
    const updateChannel = createLedgerEventChannel(action.user.uid);
    if (updateChannel) {
      while (true) {
        let data = yield take(updateChannel);
        if (Object.keys(data) && Object.keys(data).length > 0) {
          const results = Object.keys(data).map(key => {
            let transaction = data[key];
            transaction.id = key;
            return transaction;
          });
          yield put({
            type: "SET_ALL_USER_LEDGER",
            results: results
          });
        }
      }
    }
  }
}

export default function* orderSaga() {
  yield [takeEvery(types.LISTEN_FOR_LEDGER, listenForLedger)];
}
