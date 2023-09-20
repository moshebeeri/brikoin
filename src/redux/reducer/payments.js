import { types } from "../../redux/actions/payments";

const initialState = {
  list: [],
  pendingPayments: {}
};

export default function reducer(state = initialState, action = {}) {
  let paymentsState = { ...state };
  switch (action.type) {
    case types.PAYMENT_REQUEST_SENT:
      paymentsState.pendingPayments[action.id] = "PAYMENT_REQUEST_SENT";
      return paymentsState;
    default:
      return state;
  }
}
