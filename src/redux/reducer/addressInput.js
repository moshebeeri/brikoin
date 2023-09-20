import { types } from "../../redux/actions/address";
const initialState = {
  list: {},
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  let currentState = { ...state };
  switch (action.type) {
    case types.SET_ADDRESS_RESULTS:
      currentState.list[action.key] = action.addresses;
      return currentState;
    default:
      return state;
  }
}
