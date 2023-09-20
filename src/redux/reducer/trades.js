import { types } from "../../redux/actions/trade";

const initialState = {
  topBids: {},
  topAsks: {},
  dailyStats: {},
  usersProjectTrades: {},
  topTradeTransactions: {},
  userProjectSalesTrades: {},
  userProjectTransactions: {},
  userUnfundedPendingOrders: {},
  userProjectPosition: {},
  auctionsAskOrders: {},
  auctionsBidOrders: {},
  pendingOrders: {},
  userProjectPendingOrders: {},
  userProjectHistoryAuctions: {},
  userProjectAuctions: {},
  init: false,
  change: false
};

export default function reducer(state = initialState, action = {}) {
  let tradeState = { ...state };
  switch (action.type) {
    case types.UPDATE_PROJECT_PENDING_ORDERS:
      tradeState.pendingOrders[action.projectId] = action.pendingOrders;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.UPDATE_TRADE_PROJECT:
      tradeState.topBids[action.projectId] = action.topProjectBids;
      tradeState.topAsks[action.projectId] = action.topProjectAsks;
      tradeState.pendingOrders[action.projectId] = action.pendingOrders;
      tradeState.topTradeTransactions[action.projectId] =
        action.topHistoryProject;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.INIT_PROJECTS_DATA:
      tradeState.init = true;
      return tradeState;
    case types.UPDATE_USER_TRADE_PROJECT:
      tradeState.usersProjectTrades[action.projectId] =
        action.userProjectTrades;
      tradeState.userProjectAuctions[action.projectId] =
        action.userProjectAuctions;
      tradeState.userProjectSalesTrades[action.projectId] =
        action.userProjectSalesTrades;
      tradeState.userProjectTransactions[action.projectId] =
        action.userTransactions;
      tradeState.userProjectPosition[action.projectId] = action.userPosition;
      tradeState.userProjectPendingOrders[action.projectId] =
        action.userPendingOrders;
      tradeState.userUnfundedPendingOrders[action.projectId] =
        action.userUnfundedPendingOrders;
      tradeState.userProjectHistoryAuctions[action.projectId] =
        action.userProjectHistoryAuctions;
      tradeState.auctionsAskOrders[action.projectId] = action.auctionsAskOrders;
      tradeState.auctionsBidOrders[action.projectId] = action.auctionsBidOrders;
      tradeState.change = !tradeState.change;
      return tradeState;
    case types.INIT_DATA:
      tradeState.init = action.finish;
      return tradeState;
    case types.UPDATE_TRADE_DAILY_STATS:
      tradeState.dailyStats[action.projectId] = action.stats;
      tradeState.change = !tradeState.change;
      return tradeState;
    default:
      return state;
  }
}
