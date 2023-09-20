import { types } from "../../redux/actions/managers";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let managersState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.managers
    };
  }
  switch (action.type) {
    case types.MANAGERS.SYNC:
      return {
        ...state,
        list: action.managers
      };
    case types.MANAGERS.NEW.CHANGE:
      return {
        ...state,
        new: action.manager
      };
    case types.MANAGERS.SET_ALL:
      managersState.list = action.managers;
      return managersState;
    case types.MANAGERS.NEW.SET:
      managersState.list.push(action.manager);
      return managersState;
    case types.MANAGERS.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
