import { put, takeEvery, call, select } from "redux-saga/effects";

import { types } from "../../redux/actions/address";

export const lang = state => state.userProfileReducer.lang;
const GOOGLE_API_KEY = "AIzaSyCANiQKGOzNgO5B0WCMuAK41pWi_I1HknE";

function* fetchAddress(action) {
  console.log(action);
  const address = encodeURIComponent(action.address);
  const la = yield select(lang);
  const response = yield fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyACe_Cci4drnZovD8xjJOdrsIOQwyWSyCg&address=" +
      address +
      "&&language=" +
      la,
    {
      method: "GET"
    }
  );
  let results = yield response.json();
  console.log(results);
  if (results.results.length === 0) {
    yield put({
      type: types.SET_ADDRESS_RESULTS,
      key: action.key,
      addresses: []
    });
  }
  if (results.results.length > 0) {
    yield put({
      type: types.SET_ADDRESS_RESULTS,
      key: action.key,
      addresses: results.results.map(result => {
        return {
          address: result.formatted_address,
          location: result.geometry.location
        };
      })
    });
  }
}

export default function*() {
  yield [takeEvery(types.FIND_ADDRESS, fetchAddress)];
}
