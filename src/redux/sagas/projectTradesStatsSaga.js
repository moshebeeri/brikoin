import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/projectTradeStats";
import { eventChannel } from "redux-saga";
import rsf from "../rsf";

export const loginUser = state => state.login.user;
const PROJECT_ORDER_BOOK = "server/projects/orders";
const PROJECT_TRADE_HISTORY = "server/projects/tradesHistory";
const PROJECT_TRADE_PENDING_ORDERS = "server/projects/pendingOrders";
const PROJECT_AUCTIONS = "server/projects/events/auctionOrdersRequest";
const PROJECT_MORTGAGES = "server/mortgages";
const PROJECT_AUCTIONS_ORDERS = "server/projects/events/auctionOrders";
const PROJECT_HOLDERS = "server/projects/holders/";
let projectListeners = {};

function createEventChanel(askPath) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref(askPath)
      .on("child_changed", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref(askPath)
        .off(listener);
  });
  return listener;
}

function* listenProject(action) {
  const project = action.project;
  if (!project.address) {
    return;
  }
  let user = yield select(loginUser);
  projectListeners[action.project.address] = true;
  project.tradeMethod === "auction"
    ? yield fork(listenProjectAuctions, project)
    : yield fork(listenProjectOrder, project);
  yield fork(listenProjectMortgages, project);
  const historyPath = PROJECT_TRADE_HISTORY + "/" + project.address;
  yield fork(
    setData,
    historyPath,
    types.SET_PROJECT_HISTORY_TRADES,
    project,
    ""
  );
  const pendingOrders = PROJECT_TRADE_PENDING_ORDERS + "/" + project.address;
  if (user && user.uid) {
    if (user.trustee || user.lawyer) {
      yield fork(
        setData,
        pendingOrders,
        types.SET_PROJECT_PENDING_ORDERS,
        project,
        ""
      );
    } else {
      yield fork(
        setUserData,
        pendingOrders,
        types.SET_PROJECT_PENDING_ORDERS,
        project,
        user,
        "userId"
      );
    }
    // const holdingPath = PROJECT_HOLDERS + "/" + project.address;
    // yield fork(
    //   setUserData,
    //   holdingPath,
    //   types.SET_PROJECT_HOLDINGS,
    //   project,
    //   user,
    //   "holder"
    // );
  }
}

function* listenProjectMortgages(project) {
  let projectMortgages = yield getProjectMortgages(project);
  if (projectMortgages && Object.keys(projectMortgages).length > 0) {
    yield Object.keys(projectMortgages).map(key => {
      if (projectListeners[project.address + key]) {
        return;
      }
      projectListeners[project.address + key] = true;
      let mortgage = projectMortgages[key];
      mortgage.id = key;
      return fork(listenProjectMortgage, mortgage, project);
    });
  }
}

function* listenProjectAuctions(project) {
  let projectAuctions = yield getProjectAuctions(project);
  if (projectAuctions && Object.keys(projectAuctions).length > 0) {
    yield Object.keys(projectAuctions).map(key => {
      if (projectListeners[project.address + key]) {
        return;
      }
      projectListeners[project.address + key] = true;
      let auction = projectAuctions[key];
      auction.id = key;
      return fork(listenProjectAuction, auction, project);
    });
  } else {
    yield put({
      type: types.SET_PROJECT_ASKS,
      project: project.address,
      results: []
    });
  }
}

function* listenProjectAuction(auction, project) {
  const askPath =
    PROJECT_AUCTIONS_ORDERS + "/" + project.address + "/" + auction.id + "/ask";
  yield fork(
    setData,
    askPath,
    types.SET_PROJECT_AUCTION_ASKS,
    project,
    auction
  );
  const bidPath =
    PROJECT_AUCTIONS_ORDERS + "/" + project.address + "/" + auction.id + "/bid";
  yield setData(bidPath, types.SET_PROJECT_AUCTION_BIDS, project, auction);
}

function* listenProjectMortgage(mortgage, project) {
  const mortgagePath = PROJECT_MORTGAGES + "/" + mortgage.id;
  yield fork(
    setSingleData,
    mortgagePath,
    types.SET_PROJECT_MORTGAGE,
    project,
    mortgage
  );
  let user = yield select(loginUser);
  if (user && user.emailVerified) {
    yield fork(
      setUserData,
      mortgagePath + "/" + "mortgagesRequests",
      types.SET_PROJECT_MORTGAGE_REQUEST,
      project,
      user,
      "user"
    );
  }
}

function* listenProjectOrder(project) {
  const askPath = PROJECT_ORDER_BOOK + "/" + project.address + "/ask";
  yield fork(setData, askPath, types.SET_PROJECT_ASKS, project, "");
  const bidPath = PROJECT_ORDER_BOOK + "/" + project.address + "/bid";
  yield fork(setData, bidPath, types.SET_PROJECT_BIDS, project, "");
}

function* setUserData(path, type, project, user, attribute) {
  if (projectListeners[project.address + type]) {
    return;
  }
  let data = yield getUserData(path, user, attribute);
  if (data) {
    projectListeners[project.address + type] = true;
    let dataArray = yield toArray(data);
    yield put({
      type: type,
      project: project.address,
      results: dataArray
    });
    const updateChannel = createEventChanel(path);
    while (true) {
      yield take(updateChannel);
      let data = yield getUserData(path, user, attribute);
      let dataArray = yield toArray(data);
      yield put({
        type: type,
        project: project.address,
        results: dataArray
      });
    }
  } else {
    yield put({
      type: type,
      project: project.address,
      results: []
    });
  }
}

function* setSingleData(path, type, project, param) {
  yield setData(path, type, project, param, true);
}

function* setData(path, type, project, param, single) {
  if (projectListeners[project.address + type]) {
    return;
  }
  let data = yield getData(path);
  if (data) {
    projectListeners[project.address + type] = true;
    let dataArray = single ? data : yield toArray(data);
    yield put({
      type: type,
      project: project.address,
      results: dataArray,
      param: param
    });
    const updateChannel = createEventChanel(path);
    while (true) {
      yield take(updateChannel);
      let data = yield getData(path);
      let dataArray = single ? data : yield toArray(data);
      yield put({
        type: type,
        project: project.address,
        results: dataArray,
        param: param
      });
    }
  } else {
    yield put({
      type: type,
      project: project.address,
      results: [],
      param: param
    });
  }
}

function* toArray(data) {
  let dataArray = Object.keys(data).map(key => {
    let value = data[key];
    if(!value){
      return ''
    }
    value.id = key;
    return value;
  }).filter(data => data);
  return dataArray;
}

function* getData(path) {
  let refernce = rsf.app.database().ref(path);
  let value = yield call([refernce, refernce.once], "value");
  return value.val();
}

function* getUserData(path, user, attribute) {
  console.log(path);
  console.log(user.uid);
  let refernce = rsf.app
    .database()
    .ref(path)
    .orderByChild(attribute)
    .equalTo(user.uid);
  let value = yield call([refernce, refernce.once], "value");
  return value.val();
}

function* getProjectAuctions(project) {
  let refernce = rsf.app
    .database()
    .ref(PROJECT_AUCTIONS)
    .orderByChild("projectId")
    .equalTo(project.address);
  let value = yield call([refernce, refernce.once], "value");
  let auctions = value.val();
  return auctions;
}

function* getProjectMortgages(project) {
  let reference = rsf.app
    .database()
    .ref(PROJECT_MORTGAGES)
    .orderByChild("project")
    .equalTo(project.address);
  let value = yield call([reference, reference.once], "value");
  let mortgages = value.val();
  return mortgages;
}

export default function*() {
  yield [takeEvery(types.LISTEN_FOR_PROJECT_TRADE_STATS, listenProject)];
}
