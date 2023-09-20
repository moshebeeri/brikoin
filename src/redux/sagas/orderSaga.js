import { takeEvery, take } from "redux-saga/effects";

import { types } from "../../redux/actions/order";

import rsf from "../rsf";
import { eventChannel } from "redux-saga";
import { getPendingRequests } from "./tradeSaga";

function createPendingEventChannel(projectAddress, orderId) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projects/pendingOrders")
      .child(projectAddress)
      .child(orderId)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projects/pendingOrders")
        .child(projectAddress)
        .child(orderId)
        .off(listener);
  });
  return listener;
}

function* listenForPendingRequest(action) {
  console.log(action);
  if (action.projectAddress) {
    const updateChannel = createPendingEventChannel(
      action.projectAddress,
      action.orderId
    );
    while (true) {
      yield take(updateChannel);
      yield getPendingRequests(action);
    }
  }
}

export default function* orderSaga() {
  yield [takeEvery(types.LISTEN_FOR_ORDER, listenForPendingRequest)];
}
