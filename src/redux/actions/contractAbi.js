export const types = {
  CONTRACT_INVEST: "CONTRACT_INVEST"
};

export const invest = (accountId, user, amount) => {
  return {
    type: types.CONTRACT_INVEST,
    amount,
    user,
    accountId
  };
};
