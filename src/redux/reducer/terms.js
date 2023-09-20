import { types } from "../../redux/actions/terms";

const initialState = {
  list: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let termsState = { ...state };
  switch (action.type) {
    case types.TERMS.SYNC:
      return {
        ...state,
        list: action.terms
      };
    case types.TERMS.NEW.SET:
      termsState.list.push(action.terms);
      return termsState;
    case types.TERMS.SET_ALL:
      termsState.list = action.terms;
      return termsState;
    case types.TERMS.NEW.CHANGE:
      return {
        ...state,
        new: action.terms
      };
    case types.TERMS.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
