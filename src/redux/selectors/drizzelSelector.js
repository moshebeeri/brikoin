import { createSelector } from "reselect";

const getTransactions = (state, props) => state.transactions;

const getTransactionStack = (state, props) => state.transactionStack;

export const getTransactionRequests = createSelector(
  [getTransactions, getTransactionStack],
  (transactions, transactionsStack) => {
    if (transactions) {
      let results = Object.keys(transactions).map(key => {
        let transaction = transactions[key];
        transaction.key = key;
        transaction.stackId = transactionsStack.indexOf(key);
        return transaction;
      });
      return results;
    }
    return [];
  }
);
