import { types } from "../../redux/actions/pledgees";

const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let pledgeesState = { ...state };
  switch (action.type) {
    case types.PLEDGEES.SYNC:
      return {
        ...state,
        list: action.pledgees
      };
    case types.PLEDGEES.NEW.CHANGE:
      return {
        ...state,
        new: action.pledgee
      };
    case types.PLEDGEES.NEW.SET:
      pledgeesState.list.push(action.pledgee);
      return pledgeesState;
    case types.PLEDGEES.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
