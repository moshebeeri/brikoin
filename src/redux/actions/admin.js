export const types = {
  PROJECT: {
    SELECT: "PROJECT.SELECT"
  },
  USER_DISPOSITION: "USER_DISPOSITION",
  USER_ASSIGN_BROKER: "USER_ASSIGN_BROKER",
  ADD_ORGANIZATION: "ADD_ORGANIZATION",
  ASSIGN_PROJECT_TO_ORGANIZATION: "ASSIGN_PROJECT_TO_ORGANIZATION",
  USER_PAY_BROKER: "USER_PAY_BROKER",
  USER_FEES_STATE: "USER_FEES_STATE",
  SET_FEE_RATIOS: "SET_FEE_RATIOS",
  CLEAR_FEES: "CLEAR_FEES"
};

export const selectProject = project => ({
  type: types.PROJECT.SELECT,
  project
});
export const setDispositionState = (userId, dispositionState) => ({
  type: types.USER_DISPOSITION,
  userId,
  dispositionState
});

export const assignBroker = userId => ({
  type: types.USER_ASSIGN_BROKER,
  userId
});

export const addOrganization = (name, phone, email) => ({
  type: types.ADD_ORGANIZATION,
  name,
  phone,
  email
});
export const assignProjectOrganization = (projectAddress, organization) => ({
  type: types.ASSIGN_PROJECT_TO_ORGANIZATION,
  projectAddress,
  organization
});
export const paynBroker = (userId, amount) => ({
  type: types.USER_PAY_BROKER,
  userId,
  amount
});
export const setFeesState = (userId, feesState) => ({
  type: types.USER_FEES_STATE,
  userId,
  feesState
});
export const clearFees = (userId, feesState) => ({
  type: types.CLEAR_FEES
});

export const setFeesRations = (buyingFee, sellingFee) => ({
  type: types.SET_FEE_RATIOS,
  buyingFee,
  sellingFee
});
