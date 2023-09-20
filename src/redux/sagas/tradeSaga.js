import {
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { types } from "../../redux/actions/trade";
import { eventChannel } from "redux-saga";
import rsf from "../rsf";
import { getTransactionRequests } from "../selectors/drizzelSelector";
// import {getAccounts} from './accountsSaga'
// import {getMortgagesRequest} from './mortgageSaga'

export const logedinUser = state => state.login.user;

function* cancelPendingOrder(action) {
  const pendingOrderUpdate = rsf.app
    .database()
    .ref("/server/projects/pendingOrders/" + action.project)
    .child(action.pendingOrderId);
  yield call([pendingOrderUpdate, pendingOrderUpdate.update], {
    active: false
  });
}

function* setPendingOrder(action) {
  const queryPendingOrders = rsf.app
    .database()
    .ref("/server/projects/pendingOrders/")
    .child(action.project)
    .orderByChild("userId")
    .equalTo(action.user.uid);
  let projectOrders = yield call(function() {
    return new Promise(function(resolve) {
      try {
        queryPendingOrders.once("value", function(snap) {
          let results = snap.val();
          console.log("RESULTS ORDERS" + JSON.stringify(results));
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
          resolve({});
        });
      } catch (error) {
        console.log("ERROR " + JSON.stringify(error));
      }
    });
  });
  let activeOrder = yield getActiveProjectOrder(projectOrders);
  if (activeOrder) {
    const pendingOrderUpdate = rsf.app
      .database()
      .ref("/server/projects/pendingOrders/" + action.project)
      .child(activeOrder.id);
    yield call([pendingOrderUpdate, pendingOrderUpdate.update], {
      active: true,
      price: action.investPrice,
      amount: action.investAmount
    });
    let orderDocument = yield getOrderDocument(activeOrder.id, action.user.uid);
    if (orderDocument) {
      const documentOrder = rsf.app
        .database()
        .ref(`/server/legalDocuments/${orderDocument.id}/attributes`);
      yield call([documentOrder, documentOrder.update], {
        price: parseInt(action.investPrice) * parseInt(action.investAmount)
      });
    }
  } else {
    const pendingOrder = rsf.app
      .database()
      .ref("/server/projects/pendingOrders/" + action.project);
    let pendingOrderResponse = yield call([pendingOrder, pendingOrder.push], {
      active: true,
      project: action.project,
      userId: action.user.uid,
      price: action.investPrice,
      amount: action.investAmount,
      group: action.groupId ? action.groupId : "",
      reserved: false
    });
    const processOrder = rsf.app
      .database()
      .ref("/server/operations/events/processOrder/");
    yield call([processOrder, processOrder.push], {
      active: true,
      projectAddress: action.project,
      pendingOrderId: pendingOrderResponse.key,
      userId: action.user.uid
    });
    const syncTrigger = rsf.app
      .database()
      .ref("/server/operations/events/triggerProcessOrder/");
    yield call([syncTrigger, syncTrigger.set], {
      time: new Date().getTime()
    });
    if (activeOrder.groupId) {
      const updateGroups = rsf.app
        .database()
        .ref(`/server/groups/changed/${action.project}`);
      yield call([updateGroups, updateGroups.update], {
        time: new Date().getTime()
      });
    }
  }
  const sync = rsf.app.database().ref("/server/operations/events/syncCase/");
  yield call([sync, sync.push], {
    active: true,
    project: action.project,
    user: action.user.uid
  });
  const syncTrigger = rsf.app
    .database()
    .ref("/server/operations/events/syncCaseTrigger/");
  yield call([syncTrigger, syncTrigger.set], {
    time: new Date().getTime()
  });
}

export default function*() {
  yield [
    // takeEvery(types.TRADE_BID_MORTGAGE, tradeBidWithMortgage),
    // takeEvery(types.TRADE_BID_MORTGAGE_EXTERNAL, tradeBidWithMortgageExternal),
    // takeEvery(types.SET_TRADE_ORDER, trade),
    takeEvery(types.SET_PENDING_ORDER, setPendingOrder),
    takeEvery(types.CANCEL_PENDING_ORDER, cancelPendingOrder)
    // takeEvery(types.RESERVE_ORDER, reserveOrder),
    // takeEvery(types.CANCEL_RESERVE_ORDER, cancelReserveOrder),
    // takeEvery(types.CANCEL_RESERVE_DELETE_ORDER, cancelDeleteReserveOrder),
    // takeEvery(types.GET_PROJECT_STATS, getProjectStats),
    // takeEvery(types.SET_TRADE_EXTERNAL_REQUEST, tradeExternalRequest),
    // takeEvery(types.PAY_YIELD, payYield),
    // takeEvery(types.INIT_STATS, initProjectStats),
    // takeLatest(types.INIT_USER_STATS, initUserStats),
    // takeEvery(types.LISTEN_FOR_PROJECTS, listenForProjects),
    // takeEvery(types.CANCEL_ORDER, cancelOrder),
    // takeEvery(types.RESERVE_ORDER_NEWx, reserveNewOrder),
    // takeEvery(types.CANCEL_ORDER_EXTERNAL, cancelExternalOrder)
  ];
}
