import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/loadingProperty";
import firebase from "firebase";
import { eventChannel } from "redux-saga";
import rsf from "../rsf";

function createEventChannel(userId) {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/loadingProperties")
      .orderByChild("userId")
      .equalTo(userId)
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/loadingProperties")
        .off(listener);
  });
  return listener;
}

function createPendingEventChannel() {
  const listener = eventChannel(emit => {
    rsf.app
      .database()
      .ref("/server/loadingProperties")
      .on("value", data => emit(data.val()));
    return () =>
      rsf.app
        .database()
        .ref("/server/loadingProperties")
        .off(listener);
  });
  return listener;
}

function* listenForProperties(action) {
  if (action.user.sync) {
    if (action.user.admin) {
      const updateChannelAdmin = createPendingEventChannel();
      while (true) {
        yield take(updateChannelAdmin);
        yield getLoadingProperties(action);
      }
    } else {
      const updateChannel = createEventChannel(action.user.uid);
      while (true) {
        yield take(updateChannel);
        yield getLoadingProperties(action);
      }
    }
  }
}

function* deleteProject(action) {
  const deleteProperty = rsf.app
    .database()
    .ref("/server/loadingProperties/")
    .child(action.projectId);
  yield call([deleteProperty, deleteProperty.remove]);
}

function* reviewProject(action) {
  const deleteProperty = rsf.app
    .database()
    .ref("/server/loadingProperties/")
    .child(action.projectId);
  yield call([deleteProperty, deleteProperty.update], { reviewed: true });
}

function* projectApproved(action) {
  const deleteProperty = rsf.app
    .database()
    .ref("/server/loadingProperties/")
    .child(action.projectId);
  yield call([deleteProperty, deleteProperty.update], { approved: true });
  const request = rsf.app
    .database()
    .ref("/server/operations/events/loadProject");
  let id = new Date().getTime();
  yield call([request, request.push], {
    active: true,
    projectRequestId: action.projectId
  });
  const triggerAdd = rsf.app
    .database()
    .ref("/server/operations/events/loadProjectTrigger");
  yield call([triggerAdd, triggerAdd.set], { time: id });
}

function* getLoadingProperties(action) {
  let query = rsf.app
    .database()
    .ref("/server/loadingProperties")
    .orderByChild("userId")
    .equalTo(action.user.uid);
  if (action.user.admin) {
    query = rsf.app.database().ref("/server/loadingProperties");
  }
  let results = yield queryDB(query);
  if (results.length > 0) {
    results = yield all(results.map(property => call(donwloadFiles, property)));
  }
  yield put({
    type: types.SET_LOADING_PROPERTY,
    results: results
  });
}

function* donwloadFiles(property) {
  console.log("downloadFiles");
  if (property.estimation) {
    property.estimation = [yield downloadUrlAsPromise(property.estimation)];
  }
  if (property.registrar) {
    property.registrar = [yield downloadUrlAsPromise(property.registrar)];
  }
  if (property.rent) {
    property.rent = [yield downloadUrlAsPromise(property.rent)];
  }
  if (property.management) {
    property.management = [yield downloadUrlAsPromise(property.management)];
  }
  if (property.pictures) {
    property.pictures = yield all(
      property.pictures.map(picture => call(downloadUrlAsPromise, picture))
    );
  }
  if (property.map) {
    property.map = [yield downloadUrlAsPromise(property.map)];
  }
  console.log("download completed");
  return property;
}

function downloadUrlAsPromise(url) {
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onreadystatechange = function(evt) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let blob = xhr.response;
          blob.name = url;
          resolve(blob);
        } else {
          reject(new Error("Ajax error for " + url + ": " + xhr.status));
        }
      }
    };
    xhr.send();
  });
}

export function* uploadFile(file, path, key) {
  console.log(file);
  if (file.name) {
    if (file.name.includes("https") && !file.name.includes("blob")) {
      return { url: file.name, md5: "" };
    }
    let timeStamp = new Date().getTime();
    const task = rsf.storage.uploadFile(path + file.name + timeStamp, file);
    yield task;
    const storage = firebase.storage();
    const url = yield storage
      .ref(path + file.name + timeStamp)
      .getDownloadURL();
    return {
      url: url,
      md5: task.metadata_.md5Hash,
      file: file.name + timeStamp,
      key: key
    };
  }
  return { url: file, md5: "", key: key };
}


export function* uploadSimpleFile(file, fullPath) {
  if (file.name) {
    const task = rsf.storage.uploadFile(fullPath, file);
    yield task;
   
    const storage = firebase.storage();
    const url = yield storage
      .ref(fullPath)
      .getDownloadURL();
    return {
      url: url,
      md5: task.metadata_.md5Hash,
      file:fullPath
    };
  }
  return { url: file, md5: "" };
}

function* saveLoadingProperty(action) {
  console.log(action);
  console.log("WHATT");
  console.log("WHATT");
  if (action.entity.pictures && action.entity.pictures.length > 0) {
    action.entity.pictures = yield all(
      action.entity.pictures.map(picture =>
        call(uploadFile, picture, "properties/pictures/")
      )
    );
    action.entity.pictures = action.entity.pictures.map(
      metadata => metadata.url
    );
  }

  if (action.entity.map && action.entity.map.length > 0) {
    if (action.entity.map[0] instanceof File) {
      action.entity.map = yield uploadFile(
        action.entity.map[0],
        "properties/pictures/"
      );
      action.entity.map = action.entity.map.url;
    }
  }
  if (action.entity.officials && Object.keys(action.entity.officials)) {
    let officialDocuments = yield all(
      Object.keys(action.entity.officials).map(key =>
        call(
          uploadFile,
          action.entity.officials[key].document
            ? action.entity.officials[key].document[0]
            : "",
          "properties/pictures/",
          key
        )
      )
    );
    Object.keys(action.entity.officials).forEach(key => {
      if (action.entity.officials[key].document) {
        let uploadedDocument = officialDocuments.filter(doc => doc.key === key);
        if (uploadedDocument.length > 0 && uploadedDocument[0].md5) {
          action.entity.officials[key].document = uploadedDocument[0]
            ? uploadedDocument[0].url
            : "";
          action.entity.officials[key].documentFile = uploadedDocument[0]
            ? uploadedDocument[0].file
            : "";
          action.entity.officials[key].documentMd5 = uploadedDocument[0]
            ? uploadedDocument[0].md5
            : "";
        }
      }
    });
  }
  if (action.entity.estimation && action.entity.estimation.length > 0) {
    if (action.entity.estimation[0] instanceof File) {
      let estimationResults = yield uploadFile(
        action.entity.estimation[0],
        "properties/documents/"
      );
      action.entity.estimation = estimationResults.url;
      action.entity.estimatiorMd5 = estimationResults.md5;
      action.entity.estimationFile = estimationResults.file;
    }
  }
  if (action.entity.registrar && action.entity.registrar.length > 0) {
    if (action.entity.registrar[0] instanceof File) {
      let registrarResult = yield uploadFile(
        action.entity.registrar[0],
        "properties/documents/"
      );
      action.entity.registrar = registrarResult.url;
      action.entity.registrarMd5 = registrarResult.md5;
      action.entity.registrarFile = registrarResult.file;
    }
  }
  if (action.entity.rent && action.entity.rent.length > 0) {
    if (action.entity.rent[0] instanceof File) {
      let result = yield uploadFile(
        action.entity.rent[0],
        "properties/documents/"
      );
      action.entity.rent = result.url;
      action.entity.rentMd5 = result.md5;
      action.entity.rentFile = result.file;
    }
  }
  if (action.entity.management && action.entity.management.length > 0) {
    if (action.entity.management[0] instanceof File) {
      let managementResult = yield uploadFile(
        action.entity.management[0],
        "properties/documents/"
      );
      action.entity.management = managementResult.url;
      action.entity.managementMd5 = managementResult.md5;
      action.entity.managementFile = managementResult.file;
    }
  }
  action.entity.userId = action.user.uid;
  if (!action.entity.projectAddressLocationLat) {
    action.entity.projectAddressLocationLat = "";
  }
  if (!action.entity.projectAddressLocationLng) {
    action.entity.projectAddressLocationLng = "";
  }
  let id = ''
  if (action.entity.id && action.entity.id !== 0) {
    const updateProperty = rsf.app
      .database()
      .ref("/server/loadingProperties/")
      .child(action.entity.id);
    yield call([updateProperty, updateProperty.update], action.entity);
    id = action.entity.id
  } else {
    action.entity.id = "";

    const addProperty = rsf.app.database().ref("/server/loadingProperties/");
   
    id = yield call(function() {
      return new Promise(function(resolve, reject) {
        let result = addProperty.push(action.entity)
        resolve(result.key)
      })
    })

    const updateProperty = rsf.app
    .database()
    .ref("/server/loadingProperties/")
    .child(id);
    yield call([updateProperty, updateProperty.update], {id: id, propertyId: id});
 
  }
  const syncProperty = rsf.app.database().ref("/server/operations/events/loadingPropertiesSync/");
  yield call([syncProperty, syncProperty.push], {active: true, 'propertyId': id});

  const syncPropertyTrigger = rsf.app.database().ref("/server/operations/events/loadingPropertiesSyncTrigger/");
  yield call([syncPropertyTrigger, syncPropertyTrigger.set], {'time': new Date().getTime()});

  yield getLoadingProperties(action);
}

let queryDB = function*(query) {
  return yield call(function() {
    return new Promise(function(resolve) {
      try {
        query.on("value", function(snap) {
          console.log("RESPONSE");
          let results = snap.val();
          console.log(JSON.stringify(results));
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
export default function* propertyLoaderSaga() {
  yield [
    takeEvery(types.SAVE_LOADING_PROPERTY, saveLoadingProperty),
    // takeEvery(types.LISTEN_CASE, listenForCases),
    takeEvery(types.GET_LOADING_PROPERTIES, getLoadingProperties),
    takeEvery(types.LISTEN_LOADING_PROJECTS, listenForProperties),
    takeEvery(types.DELETE_PROJECT, deleteProject),
    takeEvery(types.PROJECT_REVIEWED, reviewProject),
    takeEvery(types.PROJECT_REVIEWED_AND_APPROVED, projectApproved)
  ];
}
