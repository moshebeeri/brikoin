import { types } from "../../redux/actions/submitForm";

const initialState = {
  transactions: {}
};

export default function reducer(state = initialState, action = {}) {
  let transactionState = { ...state };
  switch (action.type) {
    case types.SET_TRANSACTION:
      transactionState.transactions[action.transactionId] = action.status;
      return transactionState;
    default:
      return state;
  }
}
