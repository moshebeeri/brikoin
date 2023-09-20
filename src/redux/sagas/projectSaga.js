import { call, put, takeEvery, take, fork } from "redux-saga/effects";

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
function* saveNewProject(action) {
  const projectsRoot = rsf.app
    .database()
    .ref(config.firebaseServer)
    .child("projectsCollections")
    .child("projects");

  yield call([projectsRoot, projectsRoot.push], action.project);
  const ref = rsf.app
    .database()
    .ref("server")
    .child("operations")
    .child("project")
    .child("initialOffer");
  const initialOffer = {
    amount: parseInt(action.project.target),
    executed: false,
    name: action.project.name,
    projectId: action.project.address,
    userId: action.user.uid
  };
  yield call([ref, ref.push], initialOffer);
  yield put({
    type: types.PROJECTS.NEW.SET,
    project: action.project
  });
}

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
    takeEvery(types.PROJECTS.NEW.SAVE, saveNewProject),
    takeEvery(types.ASSIGNMENT_REQUEST, assignmentRequest),
    takeEvery(types.PROJECTS.GET_ALL, getProjects),
    fork(updateProjects)
  ];
}
