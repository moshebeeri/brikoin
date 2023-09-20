import {
  call,
  fork,
  put,
  take,
  takeEvery,
  takeLatest
} from "redux-saga/effects";
import {
  changePasswordMessage,
  loginFailure,
  loginSuccess,
  logoutFailure,
  logoutSuccess,
  signupFailure,
  signUpuccess,
  syncUser,
  types
} from "../../redux/actions/login";
import rsf from "../rsf";
import { uploadSimpleFile } from "./propertyLoaderSaga";

function* loginSaga(action) {
  try {
    console.log(action);
    const data = yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.email,
      action.password
    );
    yield put(loginSuccess(data));
  } catch (error) {
    yield put(loginFailure(error));
  }
}

function* signUpSaga(action) {
  try {
    const response = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      action.email,
      action.password
    );
    let user = response.user;
    console.log(JSON.stringify(user));
    user.p = action.password;
    user.m = action.email;
    const internalRef = rsf.app.database().ref("server/registerUser");
    yield call([internalRef, internalRef.push], {
      type: action.useInternal ? "INTERNAL" : "EXTERNAL",
      accountId: action.accountId ? action.accountId : " ",
      name: action.name,
      userId: user.uid,
      brokerId: action.brokerId ? action.brokerId : ""
    });
    yield call(rsf.auth.sendEmailVerification);
    yield put(signUpuccess(user));
  } catch (error) {
    console.log(error);
    yield put(signupFailure(error));
  }
}

function* registerUser(action) {
  const userRegistered = yield userAccountExist(action);
  if (!userRegistered) {
    const internalRef = rsf.app.database().ref("server/registerUser");
    yield call([internalRef, internalRef.push], {
      type: "INTERNAL",
      accountId: action.accountId ? action.accountId : " ",
      name: action.user.email,
      userId: action.user.uid,
      brokerId: action.brokerId ? action.brokerId : "",
      brokerToken: action.brokerToken ? action.brokerToken : ""
    });
    yield validUserRegistartion(action);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms));
}

function* userAccountExist(action) {
  const userAccount = rsf.app
    .database()
    .ref("server")
    .child("users")
    .child(`${action.user.uid}`);
  let accounts = yield call(function() {
    return new Promise(function(resolve) {
      try {
        userAccount.once("value", function(snap) {
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
          resolve("");
        });
      } catch (error) {
        console.log("ERROR " + JSON.stringify(error));
      }
    });
  });
  if (!accounts) {
    return false;
  }
  return true;
}

function* syncUserState(action) {
  if (action.user) {
    console.log(action.user);
    if (action.user.m && !action.user.emailVerified) {
      const user = yield call(
        rsf.auth.signInWithEmailAndPassword,
        action.user.m,
        action.user.p
      );
      if (user.emailVerified) {
        yield validUserRegistartion(action);
      }
    } else {
      const userRegistered = yield userAccountExist(action);
      if (!userRegistered) {
        yield validUserRegistartion(action);
      }
    }
  }
  console.log("done sync");
}

function* validUserRegistartion(action) {
  let user = action.user;
  const registerUser = rsf.app
    .database()
    .ref("server/registerUser")
    .orderByChild("userId")
    .equalTo(action.user.uid);
  let registeredObjects = yield call(function() {
    return new Promise(function(resolve) {
      try {
        registerUser.once("value", function(snap) {
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
  console.log(registeredObjects);
  if (registeredObjects.length > 0) {
    console.log(registeredObjects);
    let isInternal = registeredObjects[0].type === "INTERNAL";
    let actionObj = {
      user: user,
      name: registeredObjects[0].name,
      accountId: registeredObjects[0].accountId,
      type: registeredObjects[0].type,
      useInternal: isInternal,
      brokerId: registeredObjects[0].brokerId,
      brokerToken: registeredObjects[0].brokerToken,
    };
    yield createAccount(actionObj);
    let registerUser = rsf.app
      .database()
      .ref("server/registerUser")
      .child(registeredObjects[0].id);
    console.log("rmove");
    yield call([registerUser, registerUser.remove]);
  }
  yield put(signUpuccess(user));
}

function* createAccount(action) {
  if (action.useInternal) {
    const internalRef = rsf.app
      .database()
      .ref("server/operations/events/addInternalAccount");
    yield call([internalRef, internalRef.push], {
      brokerId: action.brokerId,
      brokerToken: action.brokerToken,
      name: action.name,
      userId: action.user.uid,
      active: true
    });
    const ref = rsf.app
      .database()
      .ref("server/operations/events/addInternalAccountTrigger");
    yield call([ref, ref.update], { time: new Date().getTime() });
  } else {
    const internalRef = rsf.app
      .database()
      .ref("server/operations/events/addInternalAccount");
    yield call([internalRef, internalRef.push], {
      type: "EXTERNAL",
      accountId: action.accountId,
      name: action.name,
      brokerId: action.brokerId,
      userId: action.user.uid,
      active: true
    });
    const ref = rsf.app
      .database()
      .ref("server/operations/events/addInternalAccountTrigger");
    yield call([ref, ref.update], { time: new Date().getTime() });
  }
}

function* updateUserDetails(action) {
  try {
    const ref = rsf.app
      .database()
      .ref("server/users")
      .child(action.userId)
      .child("accounts")
      .child(action.userAccountId);
    yield call([ref, ref.update], { name: action.userName });
    let projectDetails = { name: action.userName };
    if (action.image) {
      const metaData = yield uploadSimpleFile(action.image, `public/${action.userId}/profile`);
      projectDetails.photoUrl = metaData.url;
    }
    if (action.website) {
      projectDetails.website = action.website;
    }
    if (action.description) {
      projectDetails.description = action.description;
    }
    const updatePhoto = rsf.app
      .database()
      .ref("server/usersPublic")
      .child(action.userId);
    yield call([updatePhoto, updatePhoto.update], projectDetails);
  } catch (error) {
    yield put(signupFailure(error));
  }
}

function* changePassword(action) {
  try {
    yield call(rsf.auth.updatePassword, action.password);
    yield put(changePasswordMessage(""));
  } catch (error) {
    yield put(changePasswordMessage(error));
  }
}

function* logoutSaga() {
  try {
    const data = yield call(rsf.auth.signOut);
    yield put(logoutSuccess(data));
  } catch (error) {
    yield put(logoutFailure(error));
  }
}

function* syncUserSaga() {
  const channel = yield call(rsf.auth.channel);
  while (true) {
    let { user } = yield take(channel);
    console.log("user changed " + JSON.stringify(user));
    if (user && user.emailVerified) {
      const userRoles = rsf.app
        .database()
        .ref("server")
        .child("usersRoles");
      const userRolesRequests = rsf.app
        .database()
        .ref("server")
        .child("userRoleRequest")
        .child(user.uid);
      let userRolesResponse = yield call([userRoles, userRoles.once], "value");
      let userRolesRequestResponse = yield call(
        [userRolesRequests, userRolesRequests.once],
        "value"
      );
      let userRolesObject = JSON.parse(JSON.stringify(userRolesResponse.val()));
      let userRolesRequestObjects = JSON.parse(
        JSON.stringify(userRolesRequestResponse.val())
      );
      if (userRolesObject.admin) {
        let admins = Object.keys(userRolesObject.admin);
        if (admins.includes(user.uid)) {
          user.admin = true;
        }
      }
      if (userRolesObject.managers) {
        let managers = Object.keys(userRolesObject.managers);
        if (managers.includes(user.uid)) {
          user.manager = true;
        }
      }
      if (userRolesObject.financialOfficer) {
        let financialOfficers = Object.keys(userRolesObject.financialOfficer);
        if (financialOfficers.includes(user.uid)) {
          user.financialOfficer = true;
        }
      }
      let lawyer =
        userRolesRequestObjects &&
        Object.keys(userRolesRequestObjects).length > 0 &&
        Object.keys(userRolesRequestObjects).filter(
          key =>
            userRolesRequestObjects[key].role === "LAWYER" &&
            userRolesRequestObjects[key].approved
        );
      if (lawyer) {
        user.lawyer = true;
      }
      let trustee =
        userRolesRequestObjects &&
        Object.keys(userRolesRequestObjects).length > 0 &&
        Object.keys(userRolesRequestObjects).filter(
          key =>
            userRolesRequestObjects[key].role === "TRUSTEE" &&
            userRolesRequestObjects[key].approved
        );
      if (trustee) {
        user.trustee = true;
      }

      let broker =
        userRolesRequestObjects &&
        Object.keys(userRolesRequestObjects).length > 0 &&
        Object.keys(userRolesRequestObjects).filter(
          key =>
            userRolesRequestObjects[key].role === "BROKER" &&
            userRolesRequestObjects[key].approved
        ).length > 0;
      
      user.broker = broker ? true : false;
      
      user.sync = true;
    }
    yield put(syncUser(user));
  }
}

export default function* loginRootSaga() {
  yield fork(syncUserSaga);
  yield [
    takeEvery(types.LOGIN.REQUEST, loginSaga),
    takeEvery(types.LOGIN.CREATE, createAccount),
    takeEvery(types.LOGOUT.REQUEST, logoutSaga),
    takeEvery(types.REGISTER_USER, registerUser),
    takeEvery(types.SIGN_UP.REQUEST, signUpSaga),
    takeEvery(types.USER_CHANGE_PASSWORD, changePassword),
    takeLatest(types.USER_REFRESH_USER, syncUserState),
    takeEvery(types.USER_UPDATE_DETAILS, updateUserDetails)
  ];
}
