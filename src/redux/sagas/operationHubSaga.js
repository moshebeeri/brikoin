import { call, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/operationHub";
import rsf from "../rsf";

function* operationDone(action) {
  const operation = rsf.app
    .database()
    .ref(
      `/server/operationHub/${action.user.uid}/operations/${action.operation.id}`
    );
  yield call([operation, operation.update], { status: "operationDone" });
}

export default function* casesSaga() {
  yield [takeEvery(types.OPERATION_DONE, operationDone)];
}
