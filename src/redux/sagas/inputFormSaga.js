import { put, takeEvery, call, all } from "redux-saga/effects";

import { types } from "../../redux/actions/inputForms";

import rsf from "../rsf";
const GOOGLE_API_KEY = "AIzaSyCANiQKGOzNgO5B0WCMuAK41pWi_I1HknE";
import { uploadFile } from "./propertyLoaderSaga";
function* uplodaPdf(action) {
  try {
    const metadata = yield uploadFile(action.entity.pdf_file[0]);
    const md5Hash = metadata.md5;
    const response = yield fetch(
      "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBow_XUX9F2ryeXfsnJhRwjSDy9Z6RvH_E",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          longDynamicLink:
            "https://cornerstonerealestate.page.link/?link=" + metadata.url
        })
      }
    );
    const urlShorten = yield response.json();
    yield put({
      type: types.SET_PDF_FILE,
      formName: action.formName,
      pdfUrl: urlShorten.shortLink,
      pdfMd5: md5Hash,
      urlCode: urlShorten.shortLink.substring(
        urlShorten.shortLink.indexOf("page.link") + 10
      )
    });
    yield put({
      type: types.SET_TRANSACTION_STATE,
      formName: action.formName,
      transactionState: "PDF_UPLOADED"
    });
  } catch (error) {
    console.log(error);
  }
}
function* saveEntity(action) {
  try {
    if (action.entity.pdf_file && action.entity.pdf_file[0]) {
      const metadata = yield uploadFile(action.entity.pdf_file[0]);
      const url = metadata.url;
      const md5Hash = metadata.md5;
      const response = yield fetch(
        "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBow_XUX9F2ryeXfsnJhRwjSDy9Z6RvH_E",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify({
            longDynamicLink:
              "https://cornerstonerealestate.page.link/?link=" + url
          })
        }
      );
      const urlShorten = yield response.json();
      const urlCode = urlShorten.shortLink.substring(
        urlShorten.shortLink.indexOf("page.link") + 10
      );
      action.entity.urlCode = urlCode;
      action.entity.urlShorten = urlShorten.shortLink;
      action.entity.pdfMd5 = md5Hash;
      action.entity.pdf_file = "";
    }

    if (action.entity.pictures && action.entity.pictures.length > 0) {
      const fileListAsArray = Array.from(action.entity.pictures);
      let responses = yield all(
        fileListAsArray.map(file => call(uploadFile, file))
      );
      let pictures = responses.map(response => response.url);
      action.entity.pictures = pictures;
    }

    action.entity.update_chain = false;
    const activeRef = rsf.app
      .database()
      .ref("server")
      .child("projectsCollections")
      .child(action.entityType);
    yield call([activeRef, activeRef.push], action.entity);
    const triggerDb = rsf.app
      .database()
      .ref("server")
      .child("projectsCollections")
      .child(action.entityType)
      .child("trigger");
    yield call([triggerDb, triggerDb.set], { time: new Date().getTime() });
  } catch (error) {
    console.log(error);
  }
}

function* fetchAddress(action) {
  try {
    console.log(action);
    const address = encodeURIComponent(action.address);
    const response = yield fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyACe_Cci4drnZovD8xjJOdrsIOQwyWSyCg&address=" +
        address +
        "",
      {
        method: "GET"
      }
    );
    let results = yield response.json();
    console.log(results);
    if (results.results.length === 0) {
      yield put({
        type: types.SET_ADDRESS,
        formName: action.formName,
        address: { error: "address not found", lat: "", lng: "" }
      });
      return;
    }
    if (results.results.length === 1) {
      yield put({
        type: types.SET_ADDRESS,
        formName: action.formName,
        address: {
          singleResult: true,
          lat: results.results[0].geometry.location.lat,
          lng: results.results[0].geometry.location.lng
        }
      });
      return;
    }
    if (results.results.length > 1) {
      yield put({
        type: types.SET_ADDRESS,
        formName: action.formName,
        address: {
          multipleResults: true,
          addresses: results.results.map(result => {
            return {
              address: result.formatted_address,
              location: result.geometry.location
            };
          })
        }
      });
    }
  } catch (error) {
    yield put({
      type: types.SET_ADDRESS,
      formName: action.formName,
      address: {
        singleResult: false,
        error: "address not found",
        lat: "",
        lng: ""
      }
    });
  }
}

export default function*() {
  yield [
    takeEvery(types.UPLOAD_PDF, uplodaPdf),
    takeEvery(types.GET_ADDRESS, fetchAddress),
    takeEvery(types.SAVE_ENTITY, saveEntity)
  ];
}
