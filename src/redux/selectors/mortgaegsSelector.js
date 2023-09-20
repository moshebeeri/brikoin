import { createSelector } from "reselect";

export const getMortgages = (state, props) => state.mortgage.mortgageRequests;

export const getMyMortgages = (state, props) => state.mortgage.myMortgages;

export const getMortgagesState = (state, props) => state.mortgage;
export const getUserAccount = (state, props) =>
  state.userAccounts.activeAccount;

export const getMortgagesNextPayment = createSelector(
  [getMortgages, getMortgagesState],
  (mortgages, mortgageState) => {
    let mortgageNextPayment = {};
    if (mortgages && Object.keys(mortgages).length > 0) {
      Object.keys(mortgages).map(project => {
        let mortgagesRequests = mortgages[project];
        mortgagesRequests.forEach(mortgageRequest => {
          mortgageNextPayment[mortgageRequest.key] = getNextPayment(
            mortgageRequest.scheduledPayments
          );
        });
      });
    }
    return mortgageNextPayment;
  }
);
export const getMyMortgagesPayment = createSelector(
  [getMyMortgages, getMortgagesState],
  (mortgages, mortgageState) => {
    let mortgageNextPayment = {};
    if (mortgages && Object.keys(mortgages).length > 0) {
      mortgages.forEach(mortgage => {
        if (
          mortgage.mortgagesRequests &&
          Object.keys(mortgage.mortgagesRequests).length > 0
        ) {
          let requests = Object.keys(mortgage.mortgagesRequests).map(key => {
            let request = mortgage.mortgagesRequests[key];
            request.key = key;
            return request;
          });
          requests = requests.filter(
            request => request.trade && request.scheduledPayments
          );
          requests.forEach(request => {
            let scheduledPayments = request.scheduledPayments;
            let scheduledPaymentsArray = Object.keys(scheduledPayments).map(
              key => {
                let payment = scheduledPayments[key];
                payment.key = key;
                return payment;
              }
            );
            let unPayedPayment = scheduledPaymentsArray.filter(
              payment => !payment.payed
            );
            if (unPayedPayment.length > 0) {
              let sortedPayments = unPayedPayment.sort(comparePayed);
              mortgageNextPayment[request.key] = sortedPayments[0];
            }
          });
        }
      });
    }
    return mortgageNextPayment;
  }
);

export const getMyMortgagesPaymentTotal = createSelector(
  [getMyMortgages, getMortgagesState],
  (mortgages, mortgageState) => {
    let totalReturned = 0;
    if (mortgages && Object.keys(mortgages).length > 0) {
      mortgages.forEach(mortgage => {
        if (
          mortgage.mortgagesRequests &&
          Object.keys(mortgage.mortgagesRequests).length > 0
        ) {
          let requests = Object.keys(mortgage.mortgagesRequests).map(key => {
            let request = mortgage.mortgagesRequests[key];
            request.key = key;
            return request;
          });
          requests = requests.filter(request => request.trade);
          requests.forEach(request => {
            if (request.refinancedLoan) {
              totalReturned =
                parseFloat(request.amount) - parseFloat(request.refinancedLoan);
            }
            let scheduledPayments = request.scheduledPayments;
            let scheduledPaymentsArray = Object.keys(scheduledPayments).map(
              key => {
                let payment = scheduledPayments[key];
                payment.key = key;
                return payment;
              }
            );
            let unPayedPayment = scheduledPaymentsArray.filter(
              payment => payment.payed
            );
            if (unPayedPayment.length > 0) {
              let sortedPayments = unPayedPayment.sort(comparePayed);
              totalReturned =
                totalReturned +
                parseFloat(sortedPayments[0].scheduledMonthlyPayment);
            }
          });
        }
      });
    }
    return totalReturned;
  }
);
export const getMortgageClearances = createSelector(
  [getUserAccount, getMortgagesState],
  (userAccount, mortgageState) => {
    let mortgagesClearances = {};
    if (!userAccount) {
      return mortgagesClearances;
    }
    if (!userAccount.mortgageClearances) {
      return mortgagesClearances;
    }
    if (
      userAccount &&
      userAccount.mortgageClearances &&
      Object.keys(userAccount.mortgageClearances).length > 0
    ) {
      Object.keys(userAccount.mortgageClearances).map(mortgageAddress => {
        let clearance = userAccount.mortgageClearances[mortgageAddress];
        clearance.normalizedClearance =
          parseFloat(clearance.mortgageClearances) / 1000000;
        mortgagesClearances[mortgageAddress] = clearance;
      });
    }
    return mortgagesClearances;
  }
);

export const getMortgageProjectClearances = createSelector(
  [getUserAccount, getMortgages, getMortgagesState],
  (userAccount, mortgages, mortgageState) => {
    let mortgagesClearances = {};
    let results = {};
    if (!userAccount) {
      return results;
    }
    if (!userAccount.mortgageClearances) {
      return results;
    }
    if (userAccount && Object.keys(userAccount.mortgageClearances).length > 0) {
      Object.keys(userAccount.mortgageClearances).map(mortgageAddress => {
        let clearances = userAccount.mortgageClearances[mortgageAddress];
        let clearancesRows = Object.keys(clearances)
          .map(cleranceKey => {
            if (clearances[cleranceKey].amount) {
              return {
                normalizedClearance:
                  parseFloat(clearances.mortgageClearances) / 1000000,
                amount: clearances[cleranceKey].amount,
                cleared: clearances[cleranceKey].cleared,
                price: clearances[cleranceKey].price,
                time: clearances[cleranceKey].time
              };
            }
            return "";
          })
          .filter(clearance => clearance);
        mortgagesClearances[mortgageAddress] = clearancesRows;
      });
    }

    if (mortgages && Object.keys(mortgages).length > 0) {
      Object.keys(mortgages).map(project => {
        let mortgagesRequests = mortgages[project];
        mortgagesRequests.forEach(mortgageRequest => {
          let clearances = mortgagesClearances[mortgageRequest.mortgageAddress];
          if (clearances && clearances.length > 0) {
            clearances.forEach(clearance => {
              if (!results[mortgageRequest.project]) {
                results[mortgageRequest.project] = [];
              }
              results[mortgageRequest.project].push({
                mortgageAddress: mortgageRequest.mortgageAddress,
                normalizedClearance:
                  parseFloat(clearance.amount) * parseFloat(clearance.price),
                amount: clearance.amount,
                cleared: clearance.cleared ? "true" : "false",
                price: clearance.price,
                time: clearance.time,
                initialLoan: mortgageRequest.amount,
                currentLoan: mortgageRequest.refinancedLoan
              });
            });
          }
        });
      });
    }
    return results;
  }
);
export const getMortgagesTotal = createSelector(
  [getMyMortgages, getMortgagesState],
  (mortgages, mortgageState) => {
    let mortgageToTotal = {};
    if (mortgages && Object.keys(mortgages).length > 0) {
      mortgages.forEach(mortgage => {
        if (
          mortgage.mortgagesRequests &&
          Object.keys(mortgage.mortgagesRequests).length > 0
        ) {
          let requests = Object.keys(mortgage.mortgagesRequests).map(key => {
            let request = mortgage.mortgagesRequests[key];
            request.key = key;
            return request;
          });
          requests = requests.filter(request => request.trade);
          requests.forEach(request => {
            let totalReturned = 0;
            if (request.refinancedLoan) {
              totalReturned =
                parseFloat(request.amount) - parseFloat(request.refinancedLoan);
            }
            let scheduledPayments = request.scheduledPayments;
            let scheduledPaymentsArray = Object.keys(scheduledPayments).map(
              key => {
                let payment = scheduledPayments[key];
                payment.key = key;
                return payment;
              }
            );
            let unPayedPayment = scheduledPaymentsArray.filter(
              payment => payment.payed
            );
            if (unPayedPayment.length > 0) {
              let sortedPayments = unPayedPayment.sort(comparePayed);
              totalReturned =
                totalReturned +
                parseFloat(sortedPayments[0].scheduledMonthlyPayment);
            }
            mortgageToTotal[request.key] = totalReturned;
          });
        }
      });
    }
    return mortgageToTotal;
  }
);
export const getMyMortgagesTotal = createSelector(
  [getMyMortgages, getMortgagesState],
  (mortgages, mortgageState) => {
    let total = 0;
    if (mortgages && Object.keys(mortgages).length > 0) {
      mortgages.forEach(mortgage => {
        if (
          mortgage.mortgagesRequests &&
          Object.keys(mortgage.mortgagesRequests).length > 0
        ) {
          let requests = Object.keys(mortgage.mortgagesRequests).map(key => {
            let request = mortgage.mortgagesRequests[key];
            request.key = key;
            return request;
          });
          requests = requests.filter(request => request.trade);
          requests.forEach(request => {
            total = total + parseFloat(request.amount);
          });
        }
      });
    }
    return total;
  }
);

function comparePayed(a, b) {
  if (a.index < b.index) {
    return -1;
  }
  if (a.index > b.index) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

function getNextPayment(payments) {
  if (!payments) {
    return "";
  }
  let paymentsArr = Object.keys(payments).map(id => {
    let payment = payments[id];
    payment.id = id;
    return payment;
  });
  let unPayedPayments = paymentsArr.filter(payment => !payment.payed);
  if (unPayedPayments.length > 0) {
    return unPayedPayments[0];
  }
  return "";
}
