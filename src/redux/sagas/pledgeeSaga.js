import { call, takeEvery, put } from "redux-saga/effects";

import { types } from "../../redux/actions/pledgees";
import { uploadFile } from "./propertyLoaderSaga";
import rsf from "../rsf";

function* saveNewPledgee(action) {
  if (!action.pledgee.pdf) {
  } else {
    action.pledgee.pdf_File = undefined;
    const metadata = yield uploadFile(action.pledgee.pdf_file[0]);
    action.pledgee.pdf = metadata.url;
  }
  let docRef = yield call(
    rsf.firestore.addDocument,
    "pledgees",
    action.pledgee
  );
  action.pledgee._id = docRef.id;
  yield put({
    type: types.PLEDGEES.NEW.SET,
    pledgee: action.pledgee
  });
}

export default function*() {
  yield [takeEvery(types.PLEDGEES.NEW.SAVE, saveNewPledgee)];
}
