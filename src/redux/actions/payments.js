export const types = {
  PAYMENTS_CHARGE: "PAYMENTS_CHARGE",
  PAYMENTS_CONNECT_BANK: "PAYMENTS_CONNECT_BANK",
  PAYMENTS_DEPOSIT: "PAYMENTS_DEPOSIT",
  PAYMENTS_ADD_ACCOUNT: "PAYMENTS_ADD_ACCOUNT",
  PAY: "PAY",
  PAYMENT_REQUEST_SENT: "PAYMENT_REQUEST_SENT"
};

export const depositPayments = (userId, amount) => {
  return {
    type: types.PAYMENTS_DEPOSIT,
    userId,
    amount
  };
};
export const chargePayment = request => {
  console.log(request);
  return {
    type: types.PAYMENTS_CHARGE,
    request
  };
};

export const pay = request => {
  console.log(request);
  return {
    type: types.PAY,
    request
  };
};

export const connectBank = (token, accountId, userId) => {
  return {
    type: types.PAYMENTS_CONNECT_BANK,
    token,
    accountId,
    userId
  };
};
