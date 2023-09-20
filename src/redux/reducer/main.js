import { types } from "../../redux/actions/main";

const initialState = {
  showHoldings: false,
  showProjects: false,
  showAdmin: false,
  showHome: true,
  showLogin: false,
  showSignUp: false,
  showMortgage: false
};

export default function mainReducer(state = initialState, action = {}) {
  switch (action.type) {
    case types.MAIN.SHOW_HOLDINGS:
      return {
        ...state,
        showHoldings: true,
        showProjects: false,
        showAdmin: false,
        showHome: false,
        showLogin: false,
        showSignUp: false,
        showMortgage: false
      };
    case types.MAIN.SHOW_SIGN_UP:
      return {
        ...state,
        showHoldings: false,
        showProjects: false,
        showAdmin: false,
        showHome: false,
        showLogin: false,
        showSignUp: true,
        showMortgage: false
      };
    case types.MAIN.SHOW_PROJECTS:
      return {
        ...state,
        showProjects: true,
        showHoldings: false,
        showAdmin: false,
        showHome: false,
        showLogin: false,
        showSignUp: false,
        showMortgage: false
      };
    case types.MAIN.SHOW_ADMIN:
      return {
        ...state,
        showProjects: false,
        showHoldings: false,
        showAdmin: true,
        showHome: false,
        showLogin: false,
        showSignUp: false,
        showMortgage: false
      };
    case types.MAIN.SHOW_HOME:
      return {
        ...state,
        showProjects: false,
        showHoldings: false,
        showAdmin: false,
        showHome: true,
        showLogin: false,
        showSignUp: false,
        showMortgage: false
      };
    case types.MAIN.SHOW_LOGIN:
      return {
        ...state,
        showProjects: false,
        showHoldings: false,
        showAdmin: false,
        showHome: false,
        showLogin: true,
        showSignUp: false,
        showMortgage: false
      };
    case types.MAIN.SHOW_MORTGAGE:
      return {
        ...state,
        showProjects: false,
        showHoldings: false,
        showAdmin: false,
        showHome: false,
        showLogin: false,
        showSignUp: false,
        showMortgage: true
      };
    default:
      return state;
  }
}
