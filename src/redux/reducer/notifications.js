import { types } from "../../redux/actions/notifications";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.notifications
    };
  }
  switch (action.type) {
    case types.SET_NOTIFICATIONS:
      return {
        ...state,
        list: action.notifications,
        loaded: true
      };
    default:
      return state;
  }
}
