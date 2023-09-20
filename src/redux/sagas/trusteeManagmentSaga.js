import { call, put, takeEvery } from "redux-saga/effects";
import { uploadFile } from "./propertyLoaderSaga";
import { types } from "../../redux/actions/trusteeManagment";
import rsf from "../rsf";

function* approveDownPayment(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/reserveAndDeposit");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerReserveAndDeposit");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* approveDepositFullFund(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/approveFundDeposit");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerApproveFundDeposit");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* approveOrder(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/approvePendingOrder");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerApprovePendingOrder");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* approvePendingOrderSecondPayment(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/approvePendingOrderSecond");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerApprovePendingOrderSecond");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* cancelAllOrder(action) {
  let query = rsf.app.database().ref("server/operations/events/cancelAllOrder");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/cancelAllOrderTrigger");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* withdrawProjectFund(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/withdrawProjectFund");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/withdrawProjectFundTrigger");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* withdrawANoReserved(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/withdrawANoReserved");
  yield call([query, query.push], {
    userId: action.buyer,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/withdrawANoReservedTrigger");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* acceptPendingOffer(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/acceptBuyerOffer");
  yield call([query, query.push], {
    userId: action.owner,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerAcceptBuyerOffer");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* approveProject(action) {
  let query = rsf.app.database().ref("server/operations/events/approveProject");
  yield call([query, query.push], {
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerApproveProject");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* rejectPendingOffer(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/rejectBuyerOffer");
  yield call([query, query.push], {
    userId: action.owner,
    pendingOrderId: action.pendingOrderId,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerRejectBuyerOffer");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* counterPendingOffer(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/counterBuyerOffer");
  yield call([query, query.push], {
    userId: action.owner,
    pendingOrderId: action.pendingOrderId,
    counterOffer: action.offer,
    projectAddress: action.project,
    active: true
  });
  let triggerQuery = rsf.app
    .database()
    .ref("server/operations/events/triggerCounterBuyerOffer");
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

function* initialDocumentSignedBuyer(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/initialDocumentSignedBuyer");
  if (action.file) {
    yield put({
      type: types.UPLOADING_BUYER_DOCUMENT
    });
    const metadata = yield uploadFile(
      action.file,
      `users/${action.userId}/project/${action.project}/`
    );
    if (action.signature) {
      const signature = yield uploadFile(
        action.signature,
        `users/${action.userId}/project/${action.project}/`
      );
      yield call([query, query.push], {
        userId: action.userId,
        idBuyer: action.id,
        addressBuyer: action.address,
        signature: signature,
        pendingOrderId: action.pendingOrderId,
        signedDocumentMd5: metadata.md5,
        signedDocument: metadata.url,
        documentPath: metadata.file,
        projectAddress: action.project,
        active: true
      });
    } else {
      yield call([query, query.push], {
        userId: action.userId,
        idBuyer: action.id,
        addressBuyer: action.address,
        signature: "",
        pendingOrderId: action.pendingOrderId,
        signedDocumentMd5: metadata.md5,
        signedDocument: metadata.url,
        documentPath: metadata.file,
        projectAddress: action.project,
        active: true
      });
    }
    yield put({
      type: types.UPLOADING_BUYER_DOCUMENT_DONE
    });
    let triggerQuery = rsf.app
      .database()
      .ref("server/operations/events/triggerInitialDocumentSignedBuyer");
    yield call([triggerQuery, triggerQuery.set], {
      time: new Date().getTime()
    });
  }
}

function* initialDocumentSignedSeller(action) {
  let query = rsf.app
    .database()
    .ref("server/operations/events/initialDocumentSignedSeller");
  if (action.file) {
    let file = yield uploadFile(
      action.file,
      `users/${action.userId}/project/${action.project}/`
    );

    yield call([query, query.push], {
      userId: action.userId,
      documentPath: file.file,
      pendingOrderId: action.pendingOrderId,
      signedDocumentMd5: file.md5,
      signedDocument: file.url,
      projectAddress: action.project,
      active: true
    });
    let triggerQuery = rsf.app
      .database()
      .ref("server/operations/events/triggerInitialDocumentSignedSeller");
    yield call([triggerQuery, triggerQuery.set], {
      time: new Date().getTime()
    });
  }
}

function* signKyc(action) {
  let query = rsf.app.database().ref("server/operations/events/signKyc");
  if (action.file) {
    yield put({
      type: types.UPLOADING_KYC,
      file: "",
      pendingOrderId: "",
      projectAddress: ""
    });
    let file = yield uploadFile(action.file, `users/${action.userId}/kyc/`);
    yield put({
      type: types.UPLOADING_KYC_DONE
    });
    yield call([query, query.push], {
      userId: action.userId,
      documentPath: file.file,
      pendingOrderId: action.pendingOrderId,
      signedDocumentMd5: file.md5,
      signedDocument: file.url,
      projectAddress: action.project,
      active: true
    });
    let triggerQuery = rsf.app
      .database()
      .ref("server/operations/events/triggerSignKyc");
    yield call([triggerQuery, triggerQuery.set], {
      time: new Date().getTime()
    });
  }
}

export default function* casesSaga() {
  yield [
    takeEvery(types.BUYER_SIGNED_INITIAL, initialDocumentSignedBuyer),
    takeEvery(types.SIGN_KYC, signKyc),
    takeEvery(types.SELLER_SIGNED_INITIAL, initialDocumentSignedSeller),
    takeEvery(types.ACCEPT_PENDING_ORDER, acceptPendingOffer),
    takeEvery(types.REJECT_PENDING_ORDER, rejectPendingOffer),
    takeEvery(types.COUNTER_OFFER_PENDING_ORDER, counterPendingOffer),
    takeEvery(types.APPROVE_ORDER_DOWN_PAYMENT, approveDownPayment),
    takeEvery(types.CANCEL_ALL_ORDER, cancelAllOrder),
    takeEvery(types.WITHDRAW_PROJECT_FUNDS, withdrawProjectFund),
    takeEvery(types.WITHDRAW_NO_RESERVED, withdrawANoReserved),
    takeEvery(types.APPROVE_PENDING_ORDER, approveOrder),
    takeEvery(types.APPROVE_PROJECT, approveProject),
    takeEvery(
      types.APPROVE_PENDING_ORDER_SECOND_PAYMENT,
      approvePendingOrderSecondPayment
    ),
    takeEvery(types.APPROVE_ORDER_FULL_FUND, approveDepositFullFund)
  ];
}
