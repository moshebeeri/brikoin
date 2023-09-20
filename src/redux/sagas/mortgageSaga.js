/* eslint-disable no-redeclare */
import {
  call,
  takeEvery,
  put,
  takeLatest,
  fork,
  take,
  select,
  all
} from "redux-saga/effects";
import { getTransactionRequests } from "../selectors/drizzelSelector";

import { types } from "../../redux/actions/mortgage";
import { config } from "../../conf/config";
import { setKyc } from "./accountsSaga";
import rsf from "../rsf";
import { uploadFile } from "./propertyLoaderSaga";
import { eventChannel } from "redux-saga";
function* listenForMortgages(action) {
  yield fork(updateMortgages, action.user);
}
function* updateMortgages(user) {
  const updateChannel = createEventChannel(user);
  while (true) {
    yield take(updateChannel);
    console.log(user);
    let action = {
      user: user
    };
    yield call(getMortgageeBalance, action);
    yield call(getMortgagesRequest, action);
    yield call(getMortgageeMortgages, action);
  }
}

function* setKycDetails(action) {
  const metadata = yield uploadFile(action.request.file[0]);
  const kyc = {
    name: action.request.name,
    idDocument: metadata.url,
    phone: action.request.phone,
    address: action.request.address,
    identifier: action.request.identifier
  };
  const kycPath = rsf.app
    .database()
    .ref("/server/users/")
    .child(action.user.uid)
    .child("kyc");
  yield call([kycPath, kycPath.set], kyc);
  yield setKyc(kyc);
}
function createEventChannel(user) {
  // const listener = eventChannel(
  //   emit => {
  //     rsf.app.database().ref('/server').child('users').child(user.uid).child('mortgage')
  //       .on(
  //         'child_changed',
  //         data => emit(data.val()
  //         ))
  //     return () => rsf.app.database().ref('/server').child('users').child(user.uid).child('mortgage').off(listener)
  //   }
  // )

  return listener;
}
function* addMortgagee(action) {
  try {
    let mortgagee = action.mortgagee;
    if (mortgagee) {
      const activeRef = rsf.app
        .database()
        .ref(config.firebaseServer)
        .child("users")
        .child(action.user.uid)
        .child("mortgagee");
      yield call([activeRef, activeRef.update], mortgagee);
      mortgagee.active = true;
      mortgagee.amount = action.amount;
      mortgagee.user = action.user.uid;
    } else {
      mortgagee = {
        active: true,
        amount: action.amount,
        user: action.user.uid
      };
    }

    const mortgageRequest = rsf.app
      .database()
      .ref("/server/operations/events/internalMortgageeRequest");
    yield call([mortgageRequest, mortgageRequest.push], mortgagee);
    const mortgageRequestTrigger = rsf.app
      .database()
      .ref("/server/operations/events/internalMortgageeTriggerEvent");
    yield call([mortgageRequestTrigger, mortgageRequestTrigger.set], {
      time: new Date().getTime()
    });
  } catch (error) {
    console.log(error);
  }
}

function* setMortgageeLogo(action) {
  const metadata = yield uploadFile(action.entity[0]);

  const getLogo = rsf.app
    .database()
    .ref("/server/users/logos/")
    .orderByChild("user")
    .equalTo(action.user.uid);
  let logos = yield call(function() {
    return new Promise(function(resolve) {
      try {
        getLogo.once("value", function(snap) {
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
  if (logos.length > 0) {
    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("users/logos")
      .child(logos[0].id);
    let logo = { logo: metadata.url };
    yield call([activeRef, activeRef.update], logo);
  } else {
    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("users/logos");
    let logo = { logo: metadata.url, user: action.user.uid };
    yield call([activeRef, activeRef.push], logo);
  }
}

function* addMortgageeExtrnal(action) {
  let transactions = yield select(getTransactionRequests);
  while (transactions.length === 0) {
    yield sleep(100);
    transactions = yield select(getTransactionRequests);
  }
  let externalTransaction = transactions.filter(
    transaction => transaction.stackId === action.stackId
  )[0];

  while (!externalTransaction) {
    yield sleep(100);
    transactions = yield select(getTransactionRequests);
    externalTransaction = transactions.filter(
      transaction => transaction.stackId === action.stackId
    )[0];
  }
  let key = externalTransaction.key;
  while (externalTransaction && externalTransaction.status === "pending") {
    yield sleep(100);
    let transactions = yield select(getTransactionRequests);
    externalTransaction = transactions.filter(
      transaction => transaction.key === key
    )[0];
  }

  if (externalTransaction && externalTransaction.status === "success") {
    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("users")
      .child(action.user.uid)
      .child("mortgagee");
    let response = yield call([activeRef, activeRef.once], "value");
    let currentMortgage = response.val();
    let currentAmount = currentMortgage ? parseInt(currentMortgage.amount) : 0;
    let newMortgage = {
      amount: parseInt(action.mortgage.amount) + currentAmount,
      description: action.mortgage.description
    };
    yield call([activeRef, activeRef.update], newMortgage);
  }
}

function* sleep(time) {
  yield new Promise(resolve => setTimeout(resolve, time));
}

export function* getMortgagesRequest(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("mortgages");
  let response = yield call([activeRef, activeRef.once], "value");
  let allMortgages = response.val();
  if (allMortgages && Object.keys(allMortgages).length > 0) {
    yield Object.keys(allMortgages).map(key =>
      call(getMortgage, key, allMortgages[key])
    );
  }
}

function* getMortgage(mortgageId, mortgageCondition) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("mortgages")
    .child(mortgageId)
    .child("mortgagesRequests");
  let response = yield call([activeRef, activeRef.once], "value");
  let mortgages = response.val();
  if (mortgages && Object.keys(mortgages).length > 0) {
    mortgages = Object.keys(mortgages).map(key => {
      let mortgage = mortgages[key];
      mortgage.key = key;
      mortgage.mortgageId = mortgageId;
      return mortgage;
    });
    yield put({
      type: types.SET_MORTGAGE_REQUESTS,
      mortgageRequests: mortgages,
      projectId: mortgageCondition.project
    });
  }
}

function* addMortgageCondition(action) {
  let condition = action.mortgageCondition;
  condition.active = true;
  const mortgageRequest = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageCondition");
  yield call([mortgageRequest, mortgageRequest.push], condition);
  const mortgageRequestTrigger = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageConditionTriggerEvent");
  yield call([mortgageRequestTrigger, mortgageRequestTrigger.set], {
    time: new Date().getTime()
  });
}

function* getMortgageeBalance(action) {
  try {
    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("users")
      .child(action.user.uid)
      .child("mortgagee");
    let response = yield call([activeRef, activeRef.once], "value");
    let myMortgageAccount = response.val();
    yield put({
      type: types.SET_MORTGAGE,
      myMortgageAccount: myMortgageAccount
    });
  } catch (error) {
    console.log("ERROR");
  }
}
function* getMortgageeMortgages(action) {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("mortgages")
    .orderByChild("user")
    .equalTo(action.user.uid);
  let response = yield call([activeRef, activeRef.once], "value");
  let myMortgagesAccount = response.val();
  if (myMortgagesAccount && Object.keys(myMortgagesAccount).length > 0) {
    let mortgagesArray = Object.keys(myMortgagesAccount).map(key => {
      let mortgage = myMortgagesAccount[key];
      mortgage.key = key;
      return mortgage;
    });

    let users = uniq(
      mortgagesArray
        .map(mortgage => {
          if (
            mortgage.mortgagesRequests &&
            Object.keys(mortgage.mortgagesRequests).length > 0
          ) {
            let result = Object.keys(mortgage.mortgagesRequests).map(
              key => mortgage.mortgagesRequests[key]
            );
            return result;
          }
          return [];
        })
        .reduce(function(accumulator, requests) {
          if (accumulator === 0) {
            return requests;
          }
          return accumulator.concat(requests);
        }, 0)
        .map(request => request.user)
    );
    if (users && users.length > 0) {
      yield all(users.map(user => call(setUserKyc, user)));
    }
    yield put({
      type: types.SET_MY_MORTGAGES,
      myMortgages: mortgagesArray
    });
  }
}

function* setUserKyc(user) {
  const activeRef = rsf.app
    .database()
    .ref("server")
    .child("users")
    .child(user)
    .child("kyc");
  let response = yield call([activeRef, activeRef.once], "value");
  let entity = response.val();
  if (entity) {
    yield put({
      type: types.SET_MORTGAGE_USER_KYC,
      user: user,
      kyc: entity
    });
  }
  console.log("USER KYC: " + JSON.stringify(entity));
}

function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
    return !pos || item !== ary[pos - 1];
  });
}

function* calculateMortgage(action) {
  console.log(`CALCULATING: ${JSON.stringify(action)}`);
  const response = yield fetch(
    "https://us-central1-cornerstone-1.cloudfunctions.net/calculate/",
    {
      method: "POST",
      body: JSON.stringify(action.mortgageCondition), // string or object
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  const payments = yield response.json();
  yield put({
    type: types.SET_CALCULATION,
    payments: payments
  });
  console.log(payments);
}
function* getMortgagePayments(action) {
  const queryPayments = rsf.app
    .database()
    .ref("/server/mortgagesPayment/")
    .orderByChild("user")
    .equalTo(action.user.uid);

  let response = yield call([queryPayments, queryPayments.once], "value");
  if (response) {
    let mortgagePayments = response.val();
    if (mortgagePayments && Object.keys(mortgagePayments).length > 0) {
      let mortgageArray = Object.keys(mortgagePayments).map(key => {
        let mortgage = mortgagePayments[key];
        mortgage.id = key;
        return mortgage;
      });
      yield put({
        type: types.SET_MORTGAGE_PAYMENTS,
        mortgagePayments: mortgageArray
      });
    }
  }
}
function* paySchedulePayment(action) {
  console.log("payong");
  const queryPayments = rsf.app
    .database()
    .ref("/server/operations/events/payMortgageSchedulePayment");
  yield call([queryPayments, queryPayments.push], action.paymentRequest);
  const queryPaymentsTrigger = rsf.app
    .database()
    .ref("/server/operations/events/payMortgageSchedulePaymentTrigger");
  yield call([queryPaymentsTrigger, queryPaymentsTrigger.set], {
    time: new Date().getTime()
  });
  yield sleep(400);
  yield getMortgagesRequest(action);
}
function* askMortgageRequest(action) {
  const queryPayments = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageRequest");
  yield call([queryPayments, queryPayments.push], action.mortgageRequest);
  const queryPaymentsTrigger = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageTriggerEvent");
  yield call([queryPaymentsTrigger, queryPaymentsTrigger.set], {
    time: new Date().getTime()
  });
}

function* handleMortgageRequest(action) {
  const queryOperation = rsf.app
    .database()
    .ref(
      `/server/operationHub/${action.mortgagee}/operations/${action.operationKey}`
    );
  yield call([queryOperation, queryOperation.update], {
    status: "operationDone"
  });
  const queryPayments = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageRequestOpr");
  let request = {
    mortgageRequestId: action.mortgageRequestId,
    mortgageId: action.mortgageId,
    user: action.mortgagee,
    mortgageConditionAddress: action.mortgageConditionAddress,
    mortgageRequestAddress: action.mortgageRequestAddress,
    projectId: action.projectId,
    approve: action.approve,
    active: true
  };
  console.log(`request ${request}`);
  yield call([queryPayments, queryPayments.push], request);
  const queryPaymentsTrigger = rsf.app
    .database()
    .ref("/server/operations/events/internalMortgageOprTriggerEvent");
  yield call([queryPaymentsTrigger, queryPaymentsTrigger.set], {
    time: new Date().getTime()
  });
}

function* cancelMortgageRequest(action) {
  const queryPayments = rsf.app
    .database()
    .ref("/server/operations/events/cancelMortgageRequest");
  yield call([queryPayments, queryPayments.push], {
    key: action.key,
    user: action.user.uid,
    mortgageId: action.mortgageId,
    active: true
  });
  const queryPaymentsTrigger = rsf.app
    .database()
    .ref("/server/operations/events/cancelMortgageRequestTriggerEvent");
  yield call([queryPaymentsTrigger, queryPaymentsTrigger.set], {
    time: new Date().getTime()
  });
}
function* clearMortgage(action) {
  const queryPayments = rsf.app
    .database()
    .ref("/server/operations/events/clearMortgage");
  yield call([queryPayments, queryPayments.push], action.request);
  const queryPaymentsTrigger = rsf.app
    .database()
    .ref("/server/operations/events/clearMortgageTrigger");
  yield call([queryPaymentsTrigger, queryPaymentsTrigger.set], {
    time: new Date().getTime()
  });
  yield sleep(400);
  yield getMortgagePayments(action);
}

export default function*() {
  yield [
    takeEvery(types.ADD_MORTGAGEE, addMortgagee),
    takeEvery(types.CLEAR_MORTGAGE, clearMortgage),
    takeEvery(types.PAY_SCHEDULE_PAYMENT, paySchedulePayment),
    takeEvery(types.ADD_MORTGAGEE_EXTERNAL, addMortgageeExtrnal),
    takeEvery(types.GET_MORTGAGEE_BALANCE, getMortgageeBalance),
    takeEvery(types.CALCULATE_MORTGAGE, calculateMortgage),
    takeEvery(types.GET_MORTGAGES_PAYMENTS, getMortgagePayments),
    takeEvery(types.ADD_MORTGAGE_CONDITION, addMortgageCondition),
    takeEvery(types.GET_MY_MORTGAGES, getMortgageeMortgages),
    takeEvery(types.ASK_MORTGAGE_REQUEST, askMortgageRequest),
    takeEvery(types.GET_MORTGAGE_REQUEST, getMortgagesRequest),
    takeEvery(types.HANDLE_MORTGAGE_REQUEST, handleMortgageRequest),
    takeEvery(types.UPLOAD_LOGO, setMortgageeLogo),
    takeEvery(types.SET_KYC, setKycDetails),
    takeEvery(types.CANCEL_MORTGAGE_REQUEST, cancelMortgageRequest),
    takeLatest(types.LISTEN_FOR_MORTGAGE, listenForMortgages)
  ];
}
