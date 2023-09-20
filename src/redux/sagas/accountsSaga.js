import {
  call,
  fork,
  put,
  take,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import { types } from "../../redux/actions/accounts";
import { eventChannel } from "redux-saga";
import rsf from "../rsf";

export function* addAccount(action) {
  try {
    let account;
    account = {
      name: action.accountName,
      user_id: action.user.uid,
      accountId: action.accountId,
      type: "EXTERNAL"
    };
    if (action.accountPrivateKey) {
      account.privateKey = action.accountPrivateKey;
    }
    const ref = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("accounts");
    yield call([ref, ref.push], account);
    const activeAccount = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("activeAccount");
    yield call([activeAccount, activeAccount.set], account);
    yield put({
      type: types.ACCOUNTS_SET_ACCOUNT,
      account: account
    });
  } catch (error) {
    console.log(error);
  }
}

function* setAdministratorDetails() {
  console.log("SET Admin");
  try {
    const admin = rsf.app
      .database()
      .ref("server")
      .child("administrator");
    let adminResponse = yield call([admin, admin.once], "value");
    let details = adminResponse.val();
    yield put({
      type: types.ACCOUNTS_ADMIN,
      admin: details
    });
  } catch (error) {
    console.log("FAILED UPDATEING " + JSON.stringify(error));
  }
}

export function* getAccounts(action) {
  try {
    const ref = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("accounts");
    const logos = rsf.app
      .database()
      .ref("server")
      .child("users/logos");
    const avatar = rsf.app
      .database()
      .ref("server")
      .child("usersPublic")
      .child(`${action.user.uid}`);
    const activeRef = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("activeAccount");
    const myHoldingsRef = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("myHoldings");
    const mortgageeQuery = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("mortgagee");
    const kycQuery = rsf.app
      .database()
      .ref("server")
      .child("users")
      .child(`${action.user.uid}`)
      .child("kyc");
    if (action.user.admin) {
      yield call(setAdministratorDetails);
    }
    let response = yield call([ref, ref.once], "value");
    let logosCall = yield call([logos, logos.once], "value");
    let activeAccountId = yield call([activeRef, activeRef.once], "value");
    let myHoldingsResponse = yield call(
      [myHoldingsRef, myHoldingsRef.once],
      "value"
    );
    let mortgageeResponse = yield call(
      [mortgageeQuery, myHoldingsRef.once],
      "value"
    );
    let kycQueryResult = yield call([kycQuery, kycQuery.once], "value");
    let avatarResults = yield call([avatar, avatar.once], "value");
    let responseEntities = response.val();
    let activeResponse = activeAccountId.val();
    let myHoldings = myHoldingsResponse.val();
    let mortgagee = mortgageeResponse.val();
    let logosResponse = logosCall.val();
    let kycResponse = kycQueryResult.val();
    let userAvatar = avatarResults.val();
    if (logosResponse && Object.keys(logosResponse).length > 0) {
      let userLogos = Object.keys(logosResponse).map(key => {
        let logo = logosResponse[key];
        logo.id = key;
        return logo;
      });
      let userLogosMap = userLogos.reduce(function(map, obj) {
        map[obj.user] = obj.logo;
        return map;
      }, {});
      yield put({
        type: types.ACCOUNTS_SET_ALL_LOGOS,
        logos: userLogosMap
      });
    }
    if (userAvatar && userAvatar.photoUrl) {
      yield put({
        type: types.ACCOUNTS_SET_AVATAR,
        photoUrl: userAvatar.photoUrl
      });
    }
    if (responseEntities && activeResponse && activeResponse.accountId) {
      let accounts;
      accounts = Object.keys(responseEntities).map(key => {
        let result = responseEntities[key];
        result.id = key;
        return result;
      });
      yield put({
        type: types.ACCOUNTS_SET_ALL_ACCOUNT,
        accounts: accounts
      });
      yield put({
        type: types.ACCOUNTS_SET_ACTIVE_ACCOUNT,
        accountId: activeResponse.accountId
      });
    }
    if (myHoldings) {
      let holdings = Object.keys(myHoldings).map(key => {
        let result = myHoldings[key];
        result.projectAddress = key;
        return result;
      });
      yield put({
        type: types.ACCOUNTS_SET_HOLDINGS,
        holdings: holdings
      });
    }
    if (mortgagee) {
      yield put({
        type: types.ACCOUNTS_SET_MORTGAGEE,
        mortgagee: mortgagee
      });
    }
    if (kycResponse) {
      yield put({
        type: types.ACCOUNTS_KYC,
        kyc: kycResponse
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function* listenForAccounts(action) {
  yield fork(updateAccounts, action.user);
  yield fork(updateUserPublicAccount, action.user);
}

function* listenForPublicAccounts() {
  yield fork(updatePublicAccounts);
}

export function* setKyc(kyc) {
  yield put({
    type: types.ACCOUNTS_KYC,
    kyc: kyc
  });
}

function createEventChannel(user) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server")
      .child("users")
      .child(user.uid)
      .on("child_changed", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server")
        .child("users")
        .child(user.uid)
        .off(listener);
  });
  return listener;
}

function createPublicEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server")
      .child("usersPublic")
      .on("child_changed", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server")
        .child("usersPublic")
        .off(listener);
  });
  return listener;
}

function createEventChannelPublic(user) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server")
      .child("usersPublic")
      .child(user.uid)
      .on("child_changed", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server")
        .child("usersPublic")
        .child(user.uid)
        .off(listener);
  });
  return listener;
}

function* updatePublicAccounts() {
  console.log("loading public");
  yield call(getPublicAccounts);
  const updateChannel = createPublicEventChannel();
  while (true) {
    yield take(updateChannel);
    yield call(getPublicAccounts);
  }
}

export function* getPublicAccounts() {
  try {
    const ref = rsf.app
      .database()
      .ref("server")
      .child("usersPublic");
    let response = yield call([ref, ref.once], "value");
    let responseEntities = response.val();
    let users = Object.keys(responseEntities).map(key => {
      let entity = responseEntities[key];
      entity.userId = key;
      return entity;
    });
    yield put({
      type: types.SET_PUBLIC_USERS,
      users: users
    });
  } catch (error) {
    console.log(error);
  }
}

function* updateAccounts(user) {
  const updateChannel = createEventChannel(user);
  const action = {
    user: user
  };
  yield call(getAccounts, action);
  while (true) {
    yield take(updateChannel);
    console.log(user);
    console.log("UPDATING ACCOUNTS");
    yield call(getAccounts, action);
  }
}

function* updateUserPublicAccount(user) {
  const updateChannel2 = createEventChannelPublic(user);
  while (true) {
    yield take(updateChannel2);
    console.log(user);
    console.log("UPDATING ACCOUNTS");
    let action = {
      user: user
    };
    yield call(getAccounts, action);
  }
}

function* sendSmsValidation(action) {
  try {
    let id = new Date().getTime();
    const validation = rsf.app
      .database()
      .ref("/server/operations/events/smsPhoneValidation");
    yield call([validation, validation.push], {
      active: true,
      phoneNumber: action.phoneNumber,
      userId: action.user.uid
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/smsPhoneValidationTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
  }
}

function* checkSmsValidation(action) {
  try {
    let id = new Date().getTime();
    const validation = rsf.app
      .database()
      .ref("/server/operations/events/checkPhoneValidation");
    yield call([validation, validation.push], {
      active: true,
      phoneNumber: action.phoneNumber,
      userId: action.user.uid,
      validationCode: action.validationCode
    });
    const triggerAdd = rsf.app
      .database()
      .ref("/server/operations/events/checkPhoneValidationTrigger");
    yield call([triggerAdd, triggerAdd.set], { time: id });
  } catch (error) {
    console.log(error);
  }
}

export default function*() {
  yield [
    takeEvery(types.ACCOUNTS_ADD_ACCOUNT, addAccount),
    takeEvery(types.ACCOUNTS_VALIDATE_PHONE, sendSmsValidation),
    takeEvery(types.ACCOUNTS_VALIDATE_SMS_CODE, checkSmsValidation),
    takeEvery(types.ACCOUNTS_GET_ALL_ACCOUNT, getAccounts),
    takeLatest(types.LISTEN_ACCOUNT_CHANGE, listenForAccounts),
    takeLatest(types.LISTEN_ACCOUNT_PUBLIC_CHANGE, listenForPublicAccounts)
  ];
}
