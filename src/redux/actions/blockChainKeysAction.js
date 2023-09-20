export const types = {
  SET_KEY: "SET_KEY",
  SET_VALUE: "SET_VALUE",
  REFRESH_KEY: "REFRESH_KEY"
};

export const setKey = (accountId, method, key) => ({
  type: types.SET_KEY,
  accountId,
  method,
  key
});
export const setValueKey = (accountId, method, value) => ({
  type: types.SET_VALUE,
  accountId,
  method,
  value
});

export const refreshKey = (accountId, method, key) => ({
  type: types.REFRESH_KEY,
  accountId,
  method
});
