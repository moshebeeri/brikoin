import { types } from "../../redux/actions/properties";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let propertiesState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.properties
    };
  }
  switch (action.type) {
    case types.PROPERTIES.NEW.SET:
      propertiesState.list.push(action.property);
      return propertiesState;
    case types.PROPERTIES.SET_ALL:
      propertiesState.list = action.properties;
      return propertiesState;
    case types.PROPERTIES.SYNC:
      return {
        ...state,
        list: action.propertys
      };
    case types.PROPERTIES.NEW.CHANGE:
      return {
        ...state,
        new: action.property
      };
    case types.PROPERTIES.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
