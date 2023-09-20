import { types } from "../../redux/actions/genericList";
import { REHYDRATE } from "redux-persist";

const initialState = {
  list: [],
  fullList: [],
  loaded: false,
  changed: false
};
export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.userLedger
    };
  }
  let ledgerState = { ...state };
  switch (action.type) {
    case "LOGOUT.SUCCESS":
      return {
        ...state,
        list: [],
        fullList: [],
        loaded: false,
        changed: false
      };
    case types.SET_USER_LEDGER:
      return {
        ...state,
        list: action.results,
        loaded: true
      };
    case types.SET_ALL_USER_LEDGER:
      return {
        ...state,
        fullList: action.results,
        changed: !ledgerState.changed
      };
    default:
      return state;
  }
}
