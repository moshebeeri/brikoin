import { types } from "../../redux/actions/case";
import { REHYDRATE } from "redux-persist";

const initialState = {
  list: [],
  pendingOrders: {},
  loaded: false
};
export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.cases
    };
  }
  let cases = { ...state };
  switch (action.type) {
    case types.SET_CASES:
      return {
        ...state,
        list: action.cases,
        loaded: true
      };
    case types.SET_CASES_ORDERS:
      cases.pendingOrders = {};
      action.orders.map(order => {
        if (order && order.project) {
          if (!cases.pendingOrders[order.project]) {
            cases.pendingOrders[order.project] = [];
            cases.pendingOrders[order.project].push(order);
          } else {
            cases.pendingOrders[order.project].push(order);
          }
        }
      });
      return cases;
    default:
      return state;
  }
}
