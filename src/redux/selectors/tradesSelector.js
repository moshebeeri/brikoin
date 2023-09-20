import { createSelector } from "reselect";
import dateUtils from "../../utils/dateUtils";
let getTradesTopBids = (state, props) => state.trades.topBids;
let getTradesTopAsks = (state, props) => state.trades.topAsks;
export const getProjects = (state, props) => state.projects.list;
let getTradesHistory = (state, props) => state.trades.topTradeTransactions;
let getUserTradesHistory = (state, props) => state.trades.usersProjectTrades;
let getUserSalesTradesHistory = (state, props) =>
  state.trades.userProjectSalesTrades;
let getUserProjectTransactions = (state, props) =>
  state.trades.userProjectTransactions;
let getMortgagesRequest = (state, props) => state.mortgage.mortgageRequests;

let getDailyStats = (state, props) => state.trades.dailyStats;
let user = (state, props) => state.login.user;
let state = (state, props) => state.trades;

export const getTopBids = createSelector(
  [getTradesTopBids, getDailyStats, state],
  (topBids, dailyStats, state) => {
    let projectTopBids = {};
    if (!topBids) {
    } else {
      Object.keys(topBids).forEach(projectId => {
        let topProjectBids = topBids[projectId];
        if (topProjectBids && topProjectBids.length > 0) {
          let historyPrice = 0;
          if (dailyStats[projectId] && dailyStats[projectId].historyPrice) {
            historyPrice = dailyStats[projectId].historyPrice;
          }
          projectTopBids[projectId] = topProjectBids
            .map(bid => {
              return {
                price: bid.price,
                size: bid.size,
                volumeDollar: bid.size * bid.price,
                change:
                  historyPrice === 0
                    ? 0
                    : (bid.price * 100) / historyPrice - 100,
                changeView:
                  historyPrice === 0
                    ? 0 + "%"
                    : (bid.price * 100) / historyPrice - 100 + "%"
              };
            })
            .sort(compareBids);
        }
      });
    }
    return projectTopBids;
  }
);

export const getTopBidsAsks = createSelector(
  [getTradesTopBids, getTradesTopAsks, state],
  (topBids, topAsks, state) => {
    let projectTopBidsAsks = {};
    if (topBids.length === 0 && topAsks.length === 0) {
      return projectTopBidsAsks;
    }

    Object.keys(topAsks).forEach(projectId => {
      if (
        Object.keys(topBids[projectId]).length >
        Object.keys(topAsks[projectId]).length
      ) {
        let topProjectBids = [];
        if (topBids[projectId]) {
          topProjectBids = topBids[projectId].sort(compareBids);
        }
        projectTopBidsAsks[projectId] = topProjectBids.map((bid, index) => {
          let priceAsk = "";
          let sizeAsk = "";
          if (topAsks[projectId].length > 0) {
            let sortedTopAsk = topAsks[projectId].sort(compareAsks);
            if (sortedTopAsk[index]) {
              priceAsk = sortedTopAsk[index].price;
              sizeAsk = sortedTopAsk[index].size;
            }
          }
          return {
            id: index,
            priceBid: bid.price,
            sizeBid: bid.size,
            priceAsk: priceAsk,
            sizeAsk: sizeAsk
          };
        });
      } else {
        let topProjectAsks = [];
        if (topAsks[projectId] && topAsks[projectId].length > 0) {
          topProjectAsks = topAsks[projectId].sort(compareBids);
        }
        projectTopBidsAsks[projectId] = topProjectAsks.map((ask, index) => {
          let priceBid = "";
          let sizeBid = "";
          if (topBids[projectId].length > 0) {
            let sortedTopBids = topBids[projectId].sort(compareBids);
            if (sortedTopBids[index]) {
              priceBid = sortedTopBids[index].price;
              sizeBid = sortedTopBids[index].size;
            }
          }
          return {
            id: index,
            priceBid: priceBid,
            sizeBid: sizeBid,
            priceAsk: ask.price,
            sizeAsk: ask.size
          };
        });
      }
    });
    return projectTopBidsAsks;
  }
);

export const getProjectsMarketPrice = createSelector(
  [getTradesHistory, state],
  (trades, state) => {
    let results = {};
    console.log("trades " + JSON.stringify(trades));
    if (trades.length === 0) {
      return results;
    }

    Object.keys(trades).forEach(projectId => {
      if (!trades[projectId]) {
        results[projectId] = 1;
      } else {
        if (trades[projectId].length === 0) {
          results[projectId] = 1;
        } else {
          if (trades[projectId] && trades[projectId].length > 0) {
            let lastDeal = trades[projectId].sort(compareHistory);
            // let amounts = trades[projectId].map(history => history.size)
            // let sum = prices.reduce(function (a, b) { return a + b })
            // let sumAmount = amounts.reduce(function (a, b) { return a + b })
            // let avg = sum / sumAmount
            results[projectId] = lastDeal[0].price;
          }
        }
      }
    });
    return results;
  }
);

export const getUserProjectsTrades = createSelector(
  [getUserTradesHistory, getUserSalesTradesHistory, state],
  (trades, salesTrades, state) => {
    let results = {};
    console.log("trades " + JSON.stringify(trades));
    if (trades.length === 0) {
      return results;
    }

    Object.keys(trades).forEach(projectId => {
      if (!trades[projectId]) {
        results[projectId] = 1;
      } else {
        if (trades[projectId].length === 0) {
          results[projectId] = 1;
        } else {
          if (trades[projectId] && trades[projectId].length > 0) {
            let totalPrice = trades[projectId].map(
              history => history.price * history.size
            );
            let sum = totalPrice.reduce(function(a, b) {
              return a + b;
            });
            results[projectId] = sum;
          }
        }
      }
    });

    if (salesTrades) {
      Object.keys(salesTrades).forEach(projectId => {
        if (salesTrades[projectId] && salesTrades[projectId].length > 0) {
          let totalPrice = salesTrades[projectId].map(
            history => history.price * history.size
          );
          let sum = totalPrice.reduce(function(a, b) {
            return a + b;
          });
          results[projectId] = results[projectId] - sum;
        }
      });
    }
    return results;
  }
);

export const showMyLoans = createSelector(
  [getUserTradesHistory, getUserSalesTradesHistory, getProjects, state],
  (trades, salesTrades, projects, state) => {
    let result = false;
    console.log("trades " + JSON.stringify(trades));
    if (trades.length === 0) {
      return result;
    }

    if (projects.length === 0) {
      return result;
    }

    Object.keys(trades).forEach(projectId => {
      let project = projects.filter(
        project => project.address === projectId
      )[0];
      if (
        project &&
        project.fundingProject &&
        trades[projectId] &&
        trades[projectId].length > 0
      ) {
        result = true;
      }
    });

    return result;
  }
);

export const getTopAsks = createSelector(
  [getTradesTopAsks, getDailyStats, state],
  (topAsks, dailyStats, state) => {
    let projectTopAsks = {};
    if (!topAsks) {
    } else {
      Object.keys(topAsks).forEach(projectId => {
        let topProjectAsks = topAsks[projectId];
        let historyPrice = 0;
        if (dailyStats[projectId] && dailyStats[projectId].historyPrice) {
          historyPrice = dailyStats[projectId].historyPrice;
        }
        if (topProjectAsks && topProjectAsks.length > 0) {
          projectTopAsks[projectId] = topProjectAsks
            .map(ask => {
              return {
                price: ask.price,
                size: ask.size,
                volumeDollar: ask.size * ask.price,
                change:
                  historyPrice === 0
                    ? 0
                    : (ask.price * 100) / historyPrice - 100,
                changeView:
                  historyPrice === 0
                    ? 0 + "%"
                    : (ask.price * 100) / historyPrice - 100 + "%"
              };
            })
            .sort(compareAsks);
        }
      });
    }
    return projectTopAsks;
  }
);

export const getTopHistory = createSelector(
  [getTradesHistory, getDailyStats, state],
  (history, dailyStats, state) => {
    let projectHistory = {};
    if (!history) {
    } else {
      Object.keys(history).forEach(projectId => {
        let topProjectHistory = history[projectId];
        let historyPrice = 0;
        if (dailyStats[projectId] && dailyStats[projectId].historyPrice) {
          historyPrice = dailyStats[projectId].historyPrice;
        }
        if (topProjectHistory && topProjectHistory.length > 0) {
          projectHistory[projectId] = topProjectHistory
            .map(his => {
              return {
                price: his.price,
                size: his.size,
                volumeDollar: his.size * his.price,
                time: dateUtils.messageFormater(his.timestamp),
                timestamp: his.timestamp,
                change:
                  historyPrice === 0
                    ? 0
                    : (his.price * 100) / historyPrice - 100,
                changeView:
                  historyPrice === 0
                    ? 0 + "%"
                    : (his.price * 100) / historyPrice - 100 + "%"
              };
            })
            .sort(compareHistory);
        }
      });
    }
    return projectHistory;
  }
);

export const projectBulkTransaction = createSelector(
  [getUserProjectTransactions, user, getMortgagesRequest, state],
  (userTransaction, user, mortgagesRequests, state) => {
    let bulkTransaction = {};
    if (Object.keys(userTransaction).length > 0 && user) {
      Object.keys(userTransaction).map(projectId => {
        let projectTransaction = userTransaction[projectId];
        if (projectTransaction) {
          let bulks = projectTransaction
            .map(transaction => {
              if (user.uid === transaction.buyer) {
                return transaction.buyerMortgageAddress > 0
                  ? transaction.buyerMortgageAddress
                  : 0;
              }
              if (user.uid === transaction.seller) {
                return transaction.sellerMortgageAddress > 0
                  ? transaction.sellerMortgageAddress
                  : 0;
              }
            })
            .filter(onlyUnique);

          bulkTransaction[projectId] =
            bulks.length > 0
              ? bulks.map(bulk =>
                  createBulk(
                    bulk,
                    projectTransaction,
                    user.uid,
                    mortgagesRequests,
                    projectId
                  )
                )
              : [];
        }
      });
    }

    return bulkTransaction;
  }
);

function createBulk(
  bulk,
  projectTransaction,
  userId,
  mortgagesRequests,
  projectId
) {
  let buySizes = projectTransaction
    .filter(
      transaction =>
        transaction.buyer === userId &&
        transaction.buyerMortgageAddress === bulk
    )
    .reduce(function(accumulator, currentValue) {
      return accumulator + currentValue.size;
    }, 0);
  let sellingSizes = projectTransaction
    .filter(
      transaction =>
        transaction.seller === userId &&
        transaction.sellerMortgageAddress === bulk
    )
    .reduce(function(accumulator, currentValue) {
      return accumulator + currentValue.size;
    }, 0);
  if (
    bulk !== "0" &&
    mortgagesRequests[projectId] &&
    mortgagesRequests[projectId].length > 0
  ) {
    let requests = mortgagesRequests[projectId];
    let request = requests.filter(
      bulkRequest => bulkRequest.mortgageAddress === bulk
    )[0];
    return {
      mortgageRequestAddress:
        request && request.mortgageRequestAddress
          ? request.mortgageRequestAddress
          : "",
      mortgageConditionAddress:
        request && request.mortgageConditionAddress
          ? request.mortgageConditionAddress
          : "",
      mortgageAddress:
        request && request.mortgageAddress ? request.mortgageAddress : "",
      mortgageId: request && request.mortgageId ? request.mortgageId : "",
      mortgageeAddress: request && request.mortgagee ? request.mortgagee : "",
      mortgageRequestId: request && request.key ? request.key : "",
      remainingSize: buySizes - sellingSizes
    };
  }
  return { mortgageAddress: bulk, remainingSize: buySizes - sellingSizes };
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function compareBids(b, a) {
  if (a.price < b.price) {
    return -1;
  }
  if (a.price > b.price) {
    return 1;
  }
  return 0;
}

function compareAsks(a, b) {
  if (a.price < b.price) {
    return -1;
  }
  if (a.price > b.price) {
    return 1;
  }
  return 0;
}

function compareHistory(b, a) {
  if (a.timestamp < b.timestamp) {
    return -1;
  }
  if (a.timestamp > b.timestamp) {
    return 1;
  }
  return 0;
}
