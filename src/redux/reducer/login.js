import { types } from "../../redux/actions/login";

const initialState = {
  loading: false,
  loggedIn: false,
  user: null,
  errorMessage: "",
  passwordErrorMessage: ""
};

export default function loginReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN.REQUEST:
    case types.LOGOUT.REQUEST:
    case types.SIGN_UP.REQUEST:
      return {
        ...state,
        loading: true,
        errorMessage: "",
        user: null
      };
    case types.LOGIN.SUCCESS:
    case types.SIGN_UP.SUCCESS:
      return {
        ...state,
        loading: false,
        errorMessage: "",
        loggedIn: true
      };
    case types.LOGIN.FAILURE:
    case types.SIGN_UP.FAILURE:
      return {
        ...state,
        loading: false,
        errorMessage: action.error.message
      };
    case types.SIGNUP_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.message
      };
    case types.CHANGE_PASSWORD_MESSAGE:
      return {
        ...state,
        loading: false,
        passwordErrorMessage: action.error.message
      };
    case types.LOGOUT.SUCCESS:
      return {
        ...state,
        errorMessage: "",
        loading: false,
        loggedIn: false
      };
    case types.LOGOUT.FAILURE:
      return {
        ...state,
        loading: false
      };
    case types.USER_RESET_ERRORS:
      return {
        ...state,
        errorMessage: ""
      };
    case types.SYNC_USER:
      return {
        ...state,
        loggedIn: action.user != null,
        user: action.user
      };
    default:
      return state;
  }
}
