class AccountUtils {
  getUserAccountId(userAccounts, accounts) {
    if (userAccounts) {
      let internalAccounts = userAccounts.filter(
        account => account.type === "INTERNAL"
      );
      if (internalAccounts.length > 0) {
             return internalAccounts[0].accountId;
      }
      if (accounts) {
        return accounts[0];
      }
    }
    return "";
  }
}

const accountUtils = new AccountUtils();
export default accountUtils;
