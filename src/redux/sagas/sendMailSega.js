import { call, takeEvery } from "redux-saga/effects";

import { types } from "../../redux/actions/mailSender";

import rsf from "../rsf";

function* sendMail(action) {
  const ref = rsf.app
    .database()
    .ref("server")
    .child("operations")
    .child("sendMail");
  yield call([ref, ref.push], {
    to: action.to,
    subject: action.subject,
    message: action.message
  });
}

export default function*() {
  yield [takeEvery(types.SEND_MAIL, sendMail)];
}
