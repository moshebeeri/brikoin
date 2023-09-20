import { call, put, takeEvery, take, fork, all } from "redux-saga/effects";

import { types } from "../../redux/actions/projects";
import { config } from "../../conf/config";
import rsf from "../rsf";
import { eventChannel } from "redux-saga";

function createEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/projectsCollections/projects/")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/projectsCollections/projects/")
        .off(listener);
  });

  return listener;
}

function* updateProjects() {
  const updateChannel = createEventChannel();
  while (true) {
    yield take(updateChannel);
    yield getProjects();
  }
}

function* getNextPage(action) {
  let query;
  query = rsf.app
    .database()
    .ref("server/projectsCollections/projects")
    .orderByChild("timestamp")
    .limitToLast(5);
  if (action.key) {
    query = rsf.app
      .database()
      .ref("server/projectsCollections/projects")
      .orderByChild("timestamp")
      .limitToLast(5)
      .endAt(action.key);
  }
  let results = yield queryDB(query);
  yield syncProjectCollections(results);
  yield put({
    type: types.SET_PROJECTS_RESULTS,
    results: results
  });
}

function* syncProjectCollections(projects) {
  yield all(projects).map(project => call(syncProjectAssets(project)));
}

function* syncProjectAssets(project) {
  let query = rsf.app
    .database()
    .ref("server/projectsCollections/assetManagers")
    .orderByChild("address")
    .equalTo(project.assetManager);
  let results = yield queryDB(query);
  if (results.length > 0) {
    let assetManager = results[0];
    query = rsf.app
      .database()
      .ref("server/projectsCollections/estimations")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let estimation = yield queryDB(query);
    query = rsf.app
      .database()
      .ref("server/projectsCollections/managers")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let manager = yield queryDB(query);
    query = rsf.app
      .database()
      .ref("server/projectsCollections/properties")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let properiy = yield queryDB(query);
    query = rsf.app
      .database()
      .ref("server/projectsCollections/registrars")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let registrar = yield queryDB(query);
    query = rsf.app
      .database()
      .ref("server/projectsCollections/terms")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let term = yield queryDB(query);
    query = rsf.app
      .database()
      .ref("server/projectsCollections/trustees")
      .orderByChild("address")
      .equalTo(project.assetManager);
    let trustee = yield queryDB(query);
  }
}

function* getLastPage(action) {
  let query;
  query = rsf.app
    .database()
    .ref(action.listPath)
    .orderByChild(action.sortBy)
    .limitToFirst(action.pageLength);
  if (action.key) {
    query = rsf.app
      .database()
      .ref(action.listPath)
      .orderByChild(action.sortBy)
      .limitToFirst(action.pageLength)
      .startAt(action.key);
  }
  let results = yield queryDB(query);

  yield put({
    type: action.saveTypeAction,
    results: results
  });
}

let queryDB = function*(query) {
  return yield call(function() {
    return new Promise(function(resolve) {
      try {
        query.once("value", function(snap) {
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
};

function* getProjects() {
  try {
    const assets = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("projectsCollections")
      .child("assetManagers");
    let assetsResponse = yield call([assets, assets.once], "value");
    let assetList = assetsResponse.val();
    let assetsArray = Object.keys(assetList)
      .map(key => {
        let data = assetList[key];
        data.id = key;
        if (key === "trigger") {
          return null;
        }
        return data;
      })
      .filter(asset => asset);

    let assetsMap = assetsArray.reduce(function(map, obj) {
      map[obj.address] = obj;
      return map;
    }, {});

    const activeRef = rsf.app
      .database()
      .ref(config.firebaseServer)
      .child("projectsCollections")
      .child("projects");
    let response = yield call([activeRef, activeRef.once], "value");
    let projectsList = response.val();
    let projects = Object.keys(projectsList)
      .map(key => {
        let data = projectsList[key];
        data.id = key;
        if (key === "trigger") {
          return null;
        }
        data.term = assetsMap[data.assetManager].terms;
        data.property = assetsMap[data.assetManager].property;

        return data;
      })
      .filter(project => project);

    yield getProjectsMortgages();
    yield put({
      type: types.PROJECTS.SET_ALL,
      projects: projects
    });
  } catch (error) {
    console.log(error);
  }
}

function* getProjectsMortgages() {
  const activeRef = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("mortgages");
  let response = yield call([activeRef, activeRef.once], "value");
  if (response) {
    let mortgages = response.val();
    if (mortgages && Object.keys(mortgages).length > 0) {
      let mortgageesArr = Object.keys(mortgages).map(key => {
        let mortgage = mortgages[key];
        mortgage.id = key;
        return mortgage;
      });

      let projectToMortgages = mortgageesArr.reduce(function(map, obj) {
        if (!map[obj.project]) {
          map[obj.project] = [];
        }
        map[obj.project].push(obj);
        return map;
      }, {});
      yield put({
        type: types.SET_PROJECTS_MORTGAGE,
        projectsMortgages: projectToMortgages
      });
    }
  }
}

function* assignmentRequest(action) {
  const request = rsf.app
    .database()
    .ref("/server/operations/events/assignUserToProject");
  let id = new Date().getTime();
  action.request.active = true;
  yield call([request, request.push], action.request);
  const triggerAdd = rsf.app
    .database()
    .ref("/server/operations/events/assignUserToProjectTrigger");
  yield call([triggerAdd, triggerAdd.set], { time: id });
}
export default function*() {
  yield [
    takeEvery(types.ASSIGNMENT_REQUEST, assignmentRequest),
    takeEvery(types.PROJECTS.GET_ALL, getProjects),
    fork(updateProjects)
  ];
}
