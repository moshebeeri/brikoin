import { call, takeEvery } from "redux-saga/effects";
import { types } from "../../redux/actions/eventsOperations";
import rsf from "../rsf";

function* saveDates(action) {
  let query = rsf.app
    .database()
    .ref(`server/operationHub/calendar/${action.user.uid}/availabilities`);
  yield call([query, query.set], action.ranges);
}

function* selectAppointment(action) {
  let query = rsf.app
    .database()
    .ref(`server/operations/events/selectAppointment`);
  yield call([query, query.push], {
    user: action.user.uid,
    userTo: action.userTo,
    selected: action.selected,
    active: true,
    calendarKey: action.range.key
  });
  let triggerQuery = rsf.app
    .database()
    .ref(`server/operations/events/selectAppointmentTrigger`);
  yield call([triggerQuery, triggerQuery.set], { time: new Date().getTime() });
}

export default function* eventsOperationSaga() {
  yield [
    takeEvery(types.SAVE_RANGES, saveDates),
    takeEvery(types.SELECT_APPOINTMENT, selectAppointment)
  ];
}
