import { types } from "../../redux/actions/registrars";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let registrarsState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.registrars
    };
  }
  switch (action.type) {
    case types.REGISTRARS.SYNC:
      return {
        ...state,
        list: action.registrars
      };
    case types.REGISTRARS.NEW.CHANGE:
      return {
        ...state,
        new: action.registrar
      };
    case types.REGISTRARS.NEW.SET:
      registrarsState.list.push(action.registrar);
      return registrarsState;
    case types.REGISTRARS.SET_ALL:
      registrarsState.list = action.registrars;
      return registrarsState;
    case types.REGISTRARS.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
