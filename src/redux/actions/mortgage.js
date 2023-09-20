export const types = {
  ADD_MORTGAGEE: "ADD_MORTGAGEE",
  ADD_MORTGAGEE_EXTERNAL: "ADD_MORTGAGEE_EXTERNAL",
  GET_MORTGAGEE_BALANCE: "GET_MORTGAGEE_BALANCE",
  ASK_MORTGAGE_REQUEST: "ASK_MORTGAGE_REQUEST",
  GET_MORTGAGE_REQUEST: "GET_MORTGAGE_REQUEST",
  CANCEL_MORTGAGE_REQUEST: "CANCEL_MORTGAGE_REQUEST",
  CALCULATE_MORTGAGE: "CALCULATE_MORTGAGE",
  GET_MORTGAGES_PAYMENTS: "GET_MORTGAGES_PAYMENTS",
  LISTEN_FOR_MORTGAGE: "LISTEN_FOR_MORTGAGE",
  PAY_SCHEDULE_PAYMENT: "PAY_SCHEDULE_PAYMENT",
  SET_MORTGAGE: "SET_MORTGAGE",
  SET_MY_MORTGAGES: "SET_MY_MORTGAGES",
  SET_MORTGAGE_USER_KYC: "SET_MORTGAGE_USER_KYC",
  SET_CALCULATION: "SET_CALCULATION",
  RESET_CALCULATION: "RESET_CALCULATION",
  GET_MY_MORTGAGES: "GET_MY_MORTGAGES",
  SET_MORTGAGE_PAYMENTS: "SET_MORTGAGE_PAYMENTS",
  SET_MORTGAGE_REQUESTS: "SET_MORTGAGE_REQUESTS",
  SET_MORTGAGE_ADMIN_REQUESTS: "SET_MORTGAGE_ADMIN_REQUESTS",
  HANDLE_MORTGAGE_REQUEST: "HANDLE_MORTGAGE_REQUEST",
  TAKE_MORTGAGE: "TAKE_MORTGAGE",
  UPLOAD_LOGO: "UPLOAD_LOGO",
  SET_KYC: "SET_KYC",
  ADD_MORTGAGE_CONDITION: "ADD_MORTGAGE_CONDITION",
  CLEAR_MORTGAGE: "CLEAR_MORTGAGE"
};

export const sendKyc = (request, user) => {
  return {
    type: types.SET_KYC,
    request,
    user
  };
};
export const addMortgage = (mortgagee, user, amount) => {
  return {
    type: types.ADD_MORTGAGEE,
    mortgagee,
    user,
    amount
  };
};
export const getMyMortgages = user => {
  return {
    type: types.GET_MY_MORTGAGES,
    user
  };
};
export const uploadLogo = (user, entity) => {
  return {
    type: types.UPLOAD_LOGO,
    user,
    entity
  };
};

export const askMortgage = mortgageRequest => {
  return {
    type: types.ASK_MORTGAGE_REQUEST,
    mortgageRequest
  };
};
export const getMortgagesRequests = () => {
  return {
    type: types.GET_MORTGAGE_REQUEST
  };
};
export const cancelMortgageRequest = (
  key,
  user,
  mortgageId,
  projectAddress
) => {
  return {
    type: types.CANCEL_MORTGAGE_REQUEST,
    user,
    key,
    mortgageId,
    projectAddress
  };
};

export const addMortgageeExternal = (mortgage, user, stackId) => {
  return {
    type: types.ADD_MORTGAGEE_EXTERNAL,
    mortgage,
    user,
    stackId
  };
};
export const calculateMortgage = mortgageCondition => {
  return {
    type: types.CALCULATE_MORTGAGE,
    mortgageCondition
  };
};
export const resetMortgageCalculation = () => {
  return {
    type: types.RESET_CALCULATION
  };
};
export const addMortgageCondition = (mortgageCondition, user) => {
  return {
    type: types.ADD_MORTGAGE_CONDITION,
    mortgageCondition,
    user
  };
};
export const getMortgages = user => {
  return {
    type: types.GET_MORTGAGEE_BALANCE,
    user
  };
};
export const getMortgagesPayments = user => {
  return {
    type: types.GET_MORTGAGES_PAYMENTS,
    user
  };
};
export const paySchedulePayment = (paymentRequest, user) => {
  return {
    type: types.PAY_SCHEDULE_PAYMENT,
    paymentRequest,
    user
  };
};
export const clearMortgage = (request, user) => {
  return {
    type: types.CLEAR_MORTGAGE,
    request,
    user
  };
};

export const listenForMortgage = user => {
  return {
    type: types.LISTEN_FOR_MORTGAGE,
    user
  };
};

export const handleMortgageRequest = (
  user,
  mortgageRequestAddress,
  mortgageConditionAddress,
  projectId,
  mortgageId,
  mortgageRequestId,
  approve,
  mortgagee,
  operationKey
) => {
  return {
    type: types.HANDLE_MORTGAGE_REQUEST,
    user,
    mortgageRequestAddress,
    mortgageConditionAddress,
    projectId,
    mortgageId,
    mortgageRequestId,
    approve,
    mortgagee,
    operationKey
  };
};
