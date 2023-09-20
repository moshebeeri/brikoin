import { types } from "../../redux/actions/accounts";
import { REHYDRATE } from "redux-persist";

const initialState = {
  accounts: [],
  activeAccount: "",
  holdings: {},
  mortgagee: {},
  usersLogos: {},
  admin: {},
  avatar: "",
  publicUUsers: [],
  publicUserLoaded: false,
  kyc: "",
  accountChange: false,
  accountInit: false,
  update: true
};
export default function reducer(state = initialState, action = {}) {
  let accountsState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.userAccounts
    };
  }
  switch (action.type) {
    case "LOGOUT.SUCCESS":
      return {
        ...state,
        accounts: [],
        activeAccount: "",
        holdings: {},
        kyc: "",
        mortgagee: {},
        usersLogos: {},
        publicUUsers: [],
        publicUserLoaded: false,
        avatar: "",
        admin: {},
        accountChange: false,
        accountInit: false
      };
    case types.ACCOUNTS_SET_ACCOUNT:
      let account = accountsState.accounts.filter(
        account => account.id === action.account.accountId
      );
      if (account.length === 0) {
        accountsState.accounts.push(action.account);
      }
      accountsState.activeAccount = action.account;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_SET_ALL_ACCOUNT:
      accountsState.accounts = action.accounts;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_ADMIN:
      accountsState.admin = action.admin;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.SET_PUBLIC_USERS:
      accountsState.publicUUsers = action.users;
      accountsState.publicUserLoaded = true;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_KYC:
      accountsState.kyc = action.kyc;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_SET_ALL_LOGOS:
      accountsState.usersLogos = action.logos;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_SET_HOLDINGS:
      accountsState.holdings = action.holdings;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_SET_MORTGAGEE:
      accountsState.mortgagee = action.mortgagee;
      accountsState.update = !accountsState.update;
      return accountsState;
    case types.ACCOUNTS_NO_ACCOUNT_FOUND:
      accountsState.accountInit = false;
      return accountsState;
    case types.ACCOUNTS_SET_AVATAR:
      accountsState.avatar = action.photoUrl;
      return accountsState;
    case types.ACCOUNTS_SET_ACTIVE_ACCOUNT:
      if (!action.accountId) {
        accountsState.activeAccount = "";
      }
      let activeAccount = accountsState.accounts.filter(
        account => account.accountId === action.accountId
      );
      if (activeAccount.length > 0) {
        accountsState.activeAccount = activeAccount[0];
        // accountsState.activeAccount.accountGasBalance = action.accountGasBalance
      }
      accountsState.accountChange = !accountsState.accountChange;
      return accountsState;
    default:
      return state;
  }
}
