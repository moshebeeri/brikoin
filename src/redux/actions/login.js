export const types = {
  LOGIN: {
    REQUEST: "LOGIN.REQUEST_2",
    SUCCESS: "LOGIN.SUCCESS",
    FAILURE: "LOGIN.FAILURE",
    CREATE: "LOGIN.CREATE"
  },
  LOGOUT: {
    REQUEST: "LOGOUT.REQUEST",
    SUCCESS: "LOGOUT.SUCCESS",
    FAILURE: "LOGOUT.FAILURE"
  },
  SIGN_UP: {
    REQUEST: "SIGN_UP.REQUEST",
    SUCCESS: "SIGN_UP.SUCCESS",
    FAILURE: "SIGN_UP.FAILURE"
  },
  SIGNUP_ERROR_MESSAGE: "SIGNUP_ERROR_MESSAGE",
  SYNC_USER: "SYNC_USER",
  REGISTER_USER: "REGISTER_USER",
  USER_CHANGE_PASSWORD: "USER_CHANGE_PASSWORD",
  USER_RESET_ERRORS: "USER_RESET_ERRORS",
  USER_REFRESH_USER: "USER_REFRESH_USER",
  USER_UPDATE_DETAILS: "USER_UPDATE_DETAILS",
  CHANGE_PASSWORD_MESSAGE: "CHANGE_PASSWORD_MESSAGE"
};

export const login = (email, password) => ({
  type: types.LOGIN.REQUEST,
  email,
  password
});
export const syncUserState = user => ({
  type: types.USER_REFRESH_USER,
  user
});
export const registerUser = (user,brokerToken) => ({
  type: types.REGISTER_USER,
  user,
  brokerToken
});

export const signUpErrorMessage = message => ({
  type: types.SIGNUP_ERROR_MESSAGE,
  message
});

export const changePassword = password => ({
  type: types.USER_CHANGE_PASSWORD,
  password
});

export const resetErrorProfiles = () => ({
  type: types.USER_RESET_ERRORS
});
export const updateDetails = (
  userId,
  userAccountId,
  userName,
  image,
  website,
  description
) => ({
  type: types.USER_UPDATE_DETAILS,
  userId,
  userAccountId,
  userName,
  image,
  website,
  description
});
export const signup = (
  name,
  email,
  password,
  useInternal,
  accountId,
  brokerId
) => ({
  type: types.SIGN_UP.REQUEST,
  name,
  email,
  password,
  useInternal,
  accountId,
  brokerId
});

export const createAccount = (
  name,
  email,
  password,
  useInternal,
  accountId
) => ({
  type: types.SIGN_UP.REQUEST,
  name,
  email,
  password,
  useInternal,
  accountId
});

export const loginSuccess = credential => ({
  type: types.LOGIN.SUCCESS,
  credential
});

export const signUpuccess = credential => ({
  type: types.SIGN_UP.SUCCESS,
  credential
});

export const signupFailure = error => ({
  type: types.SIGN_UP.FAILURE,
  error
});

export const changePasswordMessage = error => ({
  type: types.CHANGE_PASSWORD_MESSAGE,
  error
});

export const loginFailure = error => ({
  type: types.LOGIN.FAILURE,
  error
});

export const logout = () => ({
  type: types.LOGOUT.REQUEST
});

export const logoutSuccess = () => ({
  type: types.LOGOUT.SUCCESS
});

export const logoutFailure = error => ({
  type: types.LOGOUT.FAILURE,
  error
});

export const syncUser = user => ({
  type: types.SYNC_USER,
  user
});
