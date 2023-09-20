import { call, takeEvery } from "redux-saga/effects";

import { types } from "../../redux/actions/contractAbi";

import rsf from "../rsf";

function* invest(action) {
  try {
    const ref = rsf.app
      .database()
      .ref("server")
      .child("operations")
      .child("invest");
    yield call([ref, ref.push], {
      user_id: action.user.uid,
      amount: action.amount,
      accountId: action.accountId
    });
  } catch (error) {
    console.log(error);
  }
}

export default function*() {
  yield [takeEvery(types.CONTRACT_INVEST, invest)];
}
