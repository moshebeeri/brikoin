import { types } from "../../redux/actions/blockChainKeysAction";
import { REHYDRATE } from "redux-persist";
const initialState = {
  keys: {},
  values: {}
};

export default function blockChainKeys(state = initialState, action = {}) {
  let keysState = { ...state };
  switch (action.type) {
    case types.SET_KEY:
      if (!keysState.keys[action.method]) {
        keysState.keys[action.method] = {};
        keysState.keys[action.method][action.accountId] = action.key;
      } else {
        keysState.keys[action.method][action.accountId] = action.key;
      }
      return keysState;
    case types.SET_VALUE:
      if (!keysState.values[action.method]) {
        keysState.values[action.method] = {};
        keysState.values[action.method][action.accountId] = action.value;
      } else {
        keysState.values[action.method][action.accountId] = action.value;
      }
      return keysState;
    case types.REFRESH_KEY:
      keysState.keys[action.method] = "";
      keysState.values[action.method] = "";
      return keysState;
    default:
      return state;
  }
}
