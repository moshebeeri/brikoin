import { call, takeEvery } from "redux-saga/effects";

import { types } from "../../redux/actions/admin";

import rsf from "../rsf";

function* userDisposition(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/dispositionRequest");
    yield call([request, request.push], {
      active: true,
      requestId: id,
      userId: action.userId,
      dispositionState: action.dispositionState
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/dispositionTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("USER DISPOSITION FAILED");
  }
}
function* addOrganization(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/addOrganization");
    yield call([request, request.push], {
      active: true,
      name: action.name,
      phoneNumber: action.phone,
      email: action.email
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerAddOrganization");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("ADD ORGANIZATION FAILED");
  }
}
function* assignProjectOrg(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/assignProjectToOrg");
    yield call([request, request.push], {
      active: true,
      projectAddress: action.projectAddress,
      organization: action.organization
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerAssignProjectOrg");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("ADD ORGANIZATION FAILED");
  }
}

function* assignBroker(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/assignBroker");
    yield call([request, request.push], {
      active: true,
      userId: action.userId
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerAssignBrokerCheck");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("USER ASSIGN BROKER FAILED");
  }
}
function* payBroker(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/payBroker");
    yield call([request, request.push], {
      active: true,
      userId: action.userId,
      payment: action.amount
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/triggerPayBrokerCheck");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("USER ASSIGN BROKER FAILED");
  }
}
function* userFees(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/feeRequest");
    yield call([request, request.push], {
      active: true,
      requestId: id,
      userId: action.userId,
      feesState: action.feesState
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/feeTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("USER DISPOSITION FAILED");
  }
}

function* clearFees(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/clearFeeRequest");
    yield call([request, request.push], { active: true });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/clearFeesTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("CLEAR FEES FAILED");
  }
}
function* setUserFeeRatios(action) {
  try {
    let id = new Date().getTime();
    const request = rsf.app
      .database()
      .ref("/server/operations/events/setFeeRequest");
    yield call([request, request.push], {
      active: true,
      requestId: id,
      buyingFee: action.buyingFee,
      sellingFee: action.sellingFee
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/setFeeTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
    console.log("USER DISPOSITION FAILED");
  }
}

export default function* adminSaga() {
  yield [
    takeEvery(types.USER_DISPOSITION, userDisposition),
    takeEvery(types.USER_ASSIGN_BROKER, assignBroker),
    takeEvery(types.ADD_ORGANIZATION, addOrganization),
    takeEvery(types.ASSIGN_PROJECT_TO_ORGANIZATION, assignProjectOrg),
    takeEvery(types.USER_PAY_BROKER, payBroker),
    takeEvery(types.USER_FEES_STATE, userFees),
    takeEvery(types.CLEAR_FEES, clearFees),
    takeEvery(types.SET_FEE_RATIOS, setUserFeeRatios)
  ];
}
