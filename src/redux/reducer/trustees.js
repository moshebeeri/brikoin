import { types } from "../../redux/actions/trustees";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let trusteeState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.trustee
    };
  }
  switch (action.type) {
    case types.TRUSTEES.SYNC:
      return {
        ...state,
        list: action.trustees
      };
    case types.TRUSTEES.NEW.CHANGE:
      return {
        ...state,
        new: action.trustee
      };
    case types.TRUSTEES.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };

    case types.TRUSTEES.SET_ALL:
      trusteeState.list = action.trustees;
      return trusteeState;
    default:
      return state;
  }
}
