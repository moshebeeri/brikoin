import { types } from "../../redux/actions/mortgage";
import { REHYDRATE } from "redux-persist";
export const mortgageInitialState = {
  myMortgageAccount: {},
  mortgagePayments: [],
  mortgageRequests: {},
  payments: {},
  myMortgages: [],
  userKyc: {},
  init: false
};

export function mortgage(state = mortgageInitialState, action = {}) {
  let currentState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || mortgageInitialState;
    return {
      ...state,
      ...savedData.mortgage
    };
  }
  switch (action.type) {
    case "LOGOUT.SUCCESS":
      return {
        ...state,
        myMortgageAccount: [],
        mortgagePayments: [],
        mortgageRequests: {},
        payments: {},
        myMortgages: [],
        userKyc: {},
        init: false
      };
    case types.SET_MY_MORTGAGES:
      return {
        ...state,
        myMortgages: action.myMortgages,
        init: true
      };
    case types.SET_MORTGAGE_PAYMENTS:
      return {
        ...state,
        mortgagePayments: action.mortgagePayments
      };
    case types.SET_MORTGAGE_ADMIN_REQUESTS:
      return {
        ...state,
        mortgagesAdmin: action.mortgagesAdmin
      };
    case types.SET_MORTGAGE_REQUESTS:
      if (
        currentState.mortgageRequests[action.projectId] &&
        currentState.mortgageRequests[action.projectId].length > 0
      ) {
        let mortgagesIsd = currentState.mortgageRequests[action.projectId].map(
          mortgage => mortgage.key
        );
        action.mortgageRequests.forEach(mortgageRequest => {
          if (!mortgagesIsd.includes(mortgageRequest.key)) {
            currentState.mortgageRequests[action.projectId].push(
              mortgageRequest
            );
          }
        });
      } else {
        currentState.mortgageRequests[action.projectId] =
          action.mortgageRequests;
      }
      return currentState;
    case types.SET_MORTGAGE_USER_KYC:
      currentState.userKyc[action.user] = action.kyc;
      return currentState;
    case types.SET_CALCULATION:
      return {
        ...state,
        payments: action.payments
      };
    case types.RESET_CALCULATION:
      return {
        ...state,
        payments: {}
      };
    case types.SET_MORTGAGE:
      return {
        ...state,
        myMortgageAccount: action.myMortgageAccount
      };
    default:
      return state;
  }
}
