import { types } from "../../redux/actions/userRoles";
import { REHYDRATE } from "redux-persist";

const initialState = {
  list: [],
  loaded: false,
  rolesRequests: [],
  rolesLoaded: false
};
export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.userRoles
    };
  }
  switch (action.type) {
    case "LOGOUT.SUCCESS":
      return {
        ...state,
        list: [],
        rolesRequests: [],
        loaded: false,
        rolesLoaded: false
      };
    case types.SET_ROLE_REQUEST:
      return {
        ...state,
        list: action.userRoleRequests,
        loaded: true
      };
    case types.SET_ADMIN_ROLE_REQUESTS:
      return {
        ...state,
        rolesRequests: action.roles,
        rolesLoaded: true
      };
    default:
      return state;
  }
}
