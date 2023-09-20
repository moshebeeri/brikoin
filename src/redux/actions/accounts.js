export const types = {
  ACCOUNTS_ADD_ACCOUNT: "ACCOUNTS_ADD_ACCOUNT",
  ACCOUNTS_SET_AVATAR: "ACCOUNTS_SET_AVATAR",
  ACCOUNTS_GET_ALL_ACCOUNT: "ACCOUNTS_GET_ALL_ACCOUNT",
  LISTEN_ACCOUNT_CHANGE: "LISTEN_ACCOUNT_CHANGE",
  ACCOUNTS_SET_ACCOUNT: "ACCOUNTS_SET_ACCOUNT",
  ACCOUNTS_SET_ALL_ACCOUNT: "ACCOUNTS_SET_ALL_ACCOUNT",
  ACCOUNTS_SET_ALL_LOGOS: "ACCOUNTS_SET_ALL_LOGOS",
  ACCOUNTS_ADMIN: "ACCOUNTS_ADMIN",
  ACCOUNTS_SET_HOLDINGS: "ACCOUNTS_SET_HOLDINGS",
  ACCOUNTS_SET_MORTGAGEE: "ACCOUNTS_SET_MORTGAGEE",
  ACCOUNTS_KYC: "ACCOUNTS_KYC",
  ACCOUNTS_SET_ACTIVE_ACCOUNT: "ACCOUNTS_SET_ACTIVE_ACCOUNT",
  ACCOUNTS_NO_ACCOUNT_FOUND: "ACCOUNTS_NO_ACCOUNT_FOUND",
  ACCOUNTS_VALIDATE_PHONE: "ACCOUNTS_VALIDATE_PHONE",
  ACCOUNTS_VALIDATE_SMS_CODE: "ACCOUNTS_VALIDATE_SMS_CODE",
  SET_PUBLIC_USERS: "SET_PUBLIC_USERS",
  LISTEN_ACCOUNT_PUBLIC_CHANGE: "LISTEN_ACCOUNT_PUBLIC_CHANGE"
};

export const addAccount = (accountId, user, accountName, accountPrivateKey) => {
  return {
    type: types.ACCOUNTS_ADD_ACCOUNT,
    accountId,
    user,
    accountName,
    accountPrivateKey
  };
};
export const sendPhoneSmsValidation = (user, phoneNumber) => {
  return {
    type: types.ACCOUNTS_VALIDATE_PHONE,
    user,
    phoneNumber
  };
};
export const setPublicUsers = users => {
  return {
    type: types.SET_PUBLIC_USERS,
    users
  };
};
export const validateSmsCode = (user, phoneNumber, validationCode) => {
  return {
    type: types.ACCOUNTS_VALIDATE_SMS_CODE,
    user,
    phoneNumber,
    validationCode
  };
};

export const getAccounts = user => {
  return {
    type: types.ACCOUNTS_GET_ALL_ACCOUNT,
    user: user
  };
};
export const listenForAccount = user => {
  return {
    type: types.LISTEN_ACCOUNT_CHANGE,
    user: user
  };
};
export const listenForPublicAccount = () => {
  return {
    type: types.LISTEN_ACCOUNT_PUBLIC_CHANGE
  };
};

export const setActiveAccount = accountId => {
  return {
    type: types.ACCOUNTS_SET_ACTIVE_ACCOUNT,
    accountId: accountId
  };
};

export const noAccount = () => {
  return {
    type: types.ACCOUNTS_NO_ACCOUNT_FOUND
  };
};
