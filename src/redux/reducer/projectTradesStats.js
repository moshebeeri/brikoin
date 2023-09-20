import { types } from "../../redux/actions/projectTradeStats";

export const initialState = {
  change: false,
  projectAsks: {},
  projectBids: {},
  projectHistory: {},
  projectHoldings: {},
  projectMortgages: {},
  projectMortgagesRequests: {},
  loaded: {},
  projectPendingOrders: {}
};

export function projectTradesStats(state = initialState, action = {}) {
  let tradeState = { ...state };
  switch (action.type) {
    case types.SET_PROJECT_ASKS:
      tradeState.projectAsks[action.project] = action.results;
      tradeState.change = !tradeState.change;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["ASKS"] = true;

      return tradeState;

    case types.SET_PROJECT_AUCTION_ASKS:
      let currentAsks = tradeState.projectAsks[action.project];

      if (currentAsks && currentAsks.length > 0) {
        currentAsks = currentAsks.filter(
          ask => ask.auctionId !== action.param.id
        );
        let newAsks = action.results.map(ask => {
          ask.auctionId = action.param.id;
          ask.auction = action.param;
          return ask;
        });
        tradeState.projectAsks[action.project] = currentAsks.concat(newAsks);
      } else {
        tradeState.projectAsks[action.project] = action.results.map(ask => {
          ask.auctionId = action.param.id;
          ask.auction = action.param;
          return ask;
        });
      }
      tradeState.change = !tradeState.change;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["ASKS"] = true;
      return tradeState;
    case types.SET_PROJECT_AUCTION_BIDS:
      let currentBids = tradeState.projectBids[action.project];
      if (currentBids && currentBids.length > 0) {
        currentBids = currentBids.filter(
          bid => bid.auctionId !== action.param.id
        );
        let newBids = action.results.map(bid => {
          bid.auctionId = action.param.id;
          bid.auction = action.param;
          return bid;
        });
        tradeState.projectBids[action.project] = currentBids.concat(newBids);
      } else {
        let newBids = action.results.map(bid => {
          bid.auctionId = action.param.id;
          bid.auction = action.param;
          return bid;
        });
        tradeState.projectBids[action.project] = newBids;
      }
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["BIDS"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.SET_PROJECT_MORTGAGE:
      let currentMortgages = tradeState.projectMortgages[action.project];
      if (currentMortgages && currentMortgages.length > 0) {
        currentMortgages = currentMortgages.filter(
          mortgage => mortgage.id !== action.param.id
        );
        let newMortgage = action.results;
        newMortgage.mortgageId = action.param.id;
        tradeState.projectMortgages[action.project] = currentMortgages.concat(
          newMortgage
        );
      } else {
        tradeState.projectMortgages[action.project] = [];
        let newMortgage = action.results;
        newMortgage.mortgageId = action.param.id;
        tradeState.projectMortgages[action.project].push(newMortgage);
      }
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["MORTGAGE"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.SET_PROJECT_BIDS:
      tradeState.projectBids[action.project] = action.results;
      tradeState.change = !tradeState.change;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["BIDS"] = true;
      return tradeState;
    case types.SET_PROJECT_HOLDINGS:
      tradeState.projectHoldings[action.project] = action.results;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["HOLDINGS"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.SET_PROJECT_HISTORY_TRADES:
      tradeState.projectHistory[action.project] = action.results;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["TRADES"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.SET_PROJECT_PENDING_ORDERS:
      tradeState.projectPendingOrders[action.project] = action.results;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["PENDING"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.SET_PROJECT_MORTGAGE_REQUEST:
      tradeState.projectMortgagesRequests[action.project] = action.results;
      if (!tradeState.loaded[action.project]) {
        tradeState.loaded[action.project] = {};
      }
      tradeState.loaded[action.project]["MortgageREqeust"] = true;
      tradeState.change = !tradeState.change;
      return tradeState;

    default:
      return tradeState;
  }
}
