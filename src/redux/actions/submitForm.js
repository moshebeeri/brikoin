export const types = {
  SET_TRANSACTION: "SET_TRANSACTION"
};

export const setTransaction = (transactionId, status) => ({
  type: types.SET_TRANSACTION,
  transactionId,
  status
});
