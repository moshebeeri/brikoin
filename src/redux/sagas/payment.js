import { call, put, select, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/payments";
import rsf from "../rsf";
import firebase from "firebase";

export const loginUser = state => state.login.user;

function* connectBank(action) {
  try {
    console.log(action);
    yield call(
      rsf.functions.call,
      `payment/createPlaidToken/${action.token}/${action.accountId}/${action.userId}`
    );
  } catch (error) {
    console.log(error);
  }
}

function* chargePayment(action) {
  try {
    const amountInCent = action.request.amount * 100;
    yield call(
      rsf.functions.call,
      `payment/creditPayment/${action.request.token.id}/${amountInCent}/USD`
    );
  } catch (error) {
    console.log(error);
  }
}

function* depositPayment(action) {
  try {
    let id = new Date().getTime();
    const receivedPayment = rsf.app
      .database()
      .ref("/server/operations/events/receivedPayment");
    yield call([receivedPayment, receivedPayment.push], {
      active: true,
      requestId: id,
      userId: action.userId
    });
    const payment = rsf.app
      .database()
      .ref("server/users")
      .child(action.userId)
      .child("payments");
    yield call([payment, payment.push], {
      id: id,
      requestId: id,
      data: { object: { amount: action.amount } }
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerPaymentsCheck");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
  }
}

function* pay(action, params) {
  const request = action.request;
  const user = yield select(loginUser);
  const pendingUserPayment = rsf.app
    .database()
    .ref(`/server/operations/payments/pending/${user.uid}`);
  yield call([pendingUserPayment, pendingUserPayment.push], {
    externalId: request.externalId,
    status: "created"
  });

  const paymentDetails = {
    ...request.product,
    ...request.payment,
    externalId: request.externalId
  };
  const pendingPayment = rsf.app
    .database()
    .ref(
      `/server/operations/payments/requests/${user.uid}/${request.externalId}`
    );
  yield call([pendingPayment, pendingPayment.push], paymentDetails);

  // console.log(`about to call test`)
  // let testing = firebase.functions().httpsCallable('paymentsService/test')
  // let test = yield call(testing, {test: 'testing'})
  // console.log(test)
  let fn = firebase.functions().httpsCallable("paymentsService/easyCard/pay");
  console.log(`easyCard pay request ${JSON.stringify(request)}`);
  let response = yield call(fn, request);
  console.log(`easyCard pay response ${JSON.stringify(response)}`);
  yield put({
    type: types.PAYMENT_REQUEST_SENT,
    id: request.id
  });
}

export default function*() {
  yield [
    takeEvery(types.PAYMENTS_CHARGE, chargePayment),
    takeEvery(types.PAYMENTS_CONNECT_BANK, connectBank),
    takeEvery(types.PAYMENTS_DEPOSIT, depositPayment),
    takeEvery(types.PAY, pay)
  ];
}
