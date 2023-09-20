export const types = {
  SET_TRADE_ORDER: "SET_TRADE_ORDER",
  GET_PROJECT_STATS: "GET_PROJECT_STATS",
  SET_TRADE_EXTERNAL_REQUEST: "SET_TRADE_EXTERNAL_REQUEST",
  UPDATE_TRADE_PROJECT: "UPDATE_TRADE_PROJECT",
  UPDATE_PROJECT_PENDING_ORDERS: "UPDATE_PROJECT_PENDING_ORDERS",
  UPDATE_USER_TRADE_PROJECT: "UPDATE_USER_TRADE_PROJECT",
  UPDATE_TRADE_DAILY_STATS: "UPDATE_TRADE_DAILY_STATS",
  TRADE_BID_MORTGAGE: "TRADE_BID_MORTGAGE",
  TRADE_BID_MORTGAGE_EXTERNAL: "TRADE_BID_MORTGAGE_EXTERNAL",
  PAY_YIELD: "PAY_YIELD",
  INIT_STATS: "INIT_STATS",
  INIT_USER_STATS: "INIT_USER_STATS",
  RESERVE_ORDER: "RESERVE_ORDER",
  RESERVE_ORDER_NEW: "RESERVE_ORDER_NEW",
  CANCEL_PENDING_ORDER: "CANCEL_PENDING_ORDER",
  CANCEL_RESERVE_ORDER: "CANCEL_RESERVE_ORDER",
  CANCEL_RESERVE_DELETE_ORDER: "CANCEL_RESERVE_DELETE_ORDER",
  LISTEN_FOR_PROJECTS: "LISTEN_FOR_PROJECTS",
  CANCEL_ORDER: "CANCEL_ORDER",
  CANCEL_ORDER_EXTERNAL: "CANCEL_ORDER_EXTERNAL",
  INIT_DATA: "INIT_DATA",
  INIT_PROJECTS_DATA: "INIT_PROJECTS_DATA",
  SET_PENDING_ORDER: "SET_PENDING_ORDER"
};
export const setPendingOrder = (
  user,
  project,
  investAmount,
  investPrice,
  groupId
) => ({
  type: types.SET_PENDING_ORDER,
  user,
  project,
  investAmount,
  investPrice,
  groupId
});
export const cancelPendingOrder = (user, project, pendingOrderId) => ({
  type: types.CANCEL_PENDING_ORDER,
  user,
  project,
  pendingOrderId
});
export const reserveNewOrder = (user, project, investAmount, investPrice) => ({
  type: types.RESERVE_ORDER_NEW,
  user,
  project,
  investAmount,
  investPrice
});
export const reserveOrder = (user, project, id) => ({
  type: types.RESERVE_ORDER,
  user,
  project,
  id
});
export const cancelReserveOrder = (user, project, id) => ({
  type: types.CANCEL_RESERVE_ORDER,
  user,
  project,
  id
});
export const deleteReserveOrder = (user, project, id) => ({
  type: types.CANCEL_RESERVE_DELETE_ORDER,
  user,
  project,
  id
});
export const trade = (order, side) => ({
  type: types.SET_TRADE_ORDER,
  order,
  side
});
export const cancelOrderExternal = (
  projectAddress,
  userId,
  side,
  stackId,
  auctionId
) => ({
  type: types.CANCEL_ORDER_EXTERNAL,
  projectAddress,
  userId,
  side,
  stackId,
  auctionId
});
export const cancelOrder = (projectAddress, userId, side, auctionId) => ({
  type: types.CANCEL_ORDER,
  projectAddress,
  userId,
  side,
  auctionId
});
export const initProjectStats = () => ({
  type: types.INIT_STATS
});
export const initUserProjectStats = user => ({
  type: types.INIT_USER_STATS,
  user
});
export const listenForProjects = userId => ({
  type: types.LISTEN_FOR_PROJECTS,
  userId
});
export const payYield = (projectAddress, yieldAmount) => ({
  type: types.PAY_YIELD,
  projectAddress,
  yieldAmount
});
export const tradeExternalRequest = (order, userAccount, stackId) => ({
  type: types.SET_TRADE_EXTERNAL_REQUEST,
  order,
  userAccount,
  stackId
});
export const tradeBidWithMortgage = order => ({
  type: types.TRADE_BID_MORTGAGE,
  order
});
export const getProjectStats = projectId => ({
  type: types.GET_PROJECT_STATS,
  projectId
});
