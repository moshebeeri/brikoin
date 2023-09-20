import { types } from "../../redux/actions/estimations";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.estimations
    };
  }
  let estimationsState = { ...state };
  switch (action.type) {
    case types.ESTIMATIONS.SYNC:
      return {
        ...state,
        list: action.estimations
      };
    case types.ESTIMATIONS.NEW.CHANGE:
      return {
        ...state,
        new: action.estimation
      };
    case types.ESTIMATIONS.SET_ALL:
      estimationsState.list = action.estimations;
      return estimationsState;
    case types.ESTIMATIONS.NEW.SET:
      estimationsState.list.push(action.estimation);
      return estimationsState;
    case types.ESTIMATIONS.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
