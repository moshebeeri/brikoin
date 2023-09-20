export const types = {
  SAVE_CASE: "SAVE_CASE",
  SET_CASES_ORDERS: "SET_CASES_ORDERS",
  SET_CASES: "SET_CASES",
  GET_CASES: "GET_CASES",
  LISTEN_CASE: "LISTEN_CASE",
  LISTEN_PROJECT_REQUESTS: "LISTEN_PROJECT_REQUESTS"
};

export const saveCase = (user, entity) => {
  return {
    type: types.SAVE_CASE,
    user,
    entity
  };
};

export const setCases = cases => {
  return {
    type: types.SET_CASES,
    cases
  };
};

export const listenCases = user => {
  return {
    type: types.LISTEN_CASE,
    user
  };
};

export const listenForProjectRequests = projectAddress => {
  return {
    type: types.LISTEN_PROJECT_REQUESTS,
    projectAddress
  };
};

export const getCases = user => {
  return {
    type: types.GET_CASES,
    user
  };
};

export const setCasesOrders = orders => {
  return {
    type: types.SET_CASES_ORDERS,
    orders
  };
};
