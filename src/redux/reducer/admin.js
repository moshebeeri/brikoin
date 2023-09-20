import { types } from "../../redux/actions/admin";
import { REHYDRATE } from "redux-persist";
const initialState = {
  selectedProject: ""
};

export default function mainReducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.admin
    };
  }
  switch (action.type) {
    case types.PROJECT.SELECT:
      return {
        ...state,
        selectedProject: action.project
      };

    default:
      return state;
  }
}
