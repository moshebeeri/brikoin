import { createSelector } from "reselect";

export const getUserAccount = (state, props) =>
  state.userAccounts.activeAccount;
export const getUserAccountState = (state, props) => state.userAccounts;

export const getUserFees = createSelector(
  [getUserAccount, getUserAccountState],
  (activeAccount, userState) => {
    let result = [];
    if (
      activeAccount &&
      activeAccount.brokerCustomers &&
      Object.keys(activeAccount.brokerCustomers).length > 0
    ) {
      Object.keys(activeAccount.brokerCustomers).forEach(userKey => {
        let user = activeAccount.brokerCustomers[userKey];
        if (user.fees && Object.keys(user.fees).length > 0) {
          Object.keys(user.fees).forEach(feeKey => {
            result.push({
              price: parseInt(user.fees[feeKey].price) / 1000000,
              amount: user.fees[feeKey].amount,
              fee: parseInt(user.fees[feeKey].fee) / 1000000,
              projectAddress: user.fees[feeKey].projectAddress,
              date: parseInt(user.fees[feeKey].time) * 1000,
              user: user.userAccount
            });
          });
        }
      });
    }
    return result;
  }
);

export const getUserFeesTotal = createSelector(
  [getUserAccount, getUserAccountState],
  (activeAccount, userState) => {
    let result = 0;
    if (
      activeAccount &&
      activeAccount.brokerCustomers &&
      Object.keys(activeAccount.brokerCustomers).length > 0
    ) {
      Object.keys(activeAccount.brokerCustomers).forEach(userKey => {
        let user = activeAccount.brokerCustomers[userKey];
        if (user.fees && Object.keys(user.fees).length > 0) {
          Object.keys(user.fees).forEach(feeKey => {
            result = result + parseInt(user.fees[feeKey].fee) / 1000000;
          });
        }
      });
    }
    return result;
  }
);
