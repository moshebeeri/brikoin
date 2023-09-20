export const types = {
  APPROVE_ORDER_DOWN_PAYMENT: "APPROVE_ORDER_DOWN_PAYMENT",
  APPROVE_PENDING_ORDER: "APPROVE_PENDING_ORDER",
  APPROVE_PROJECT: "APPROVE_PROJECT",
  APPROVE_PENDING_ORDER_SECOND_PAYMENT: "APPROVE_PENDING_ORDER_SECOND_PAYMENT",
  BUYER_SIGNED_INITIAL: "BUYER_SIGNED_INITIAL",
  SIGN_KYC: "SIGN_KYC",
  SELLER_SIGNED_INITIAL: "SELLER_SIGNED_INITIAL",
  ACCEPT_PENDING_ORDER: "ACCEPT_PENDING_ORDER",
  REJECT_PENDING_ORDER: "REJECT_PENDING_ORDER",
  COUNTER_OFFER_PENDING_ORDER: "COUNTER_OFFER_PENDING_ORDER",
  WITHDRAW_PROJECT_FUNDS: "WITHDRAW_PROJECT_FUNDS",
  WITHDRAW_NO_RESERVED: "WITHDRAW_NO_RESERVED",
  CANCEL_ALL_ORDER: "CANCEL_ALL_ORDER",
  UPLOADING_KYC: "UPLOADING_KYC",
  UPLOADING_BUYER_DOCUMENT: "UPLOADING_BUYER_DOCUMENT",
  UPLOADING_KYC_DONE: "UPLOADING_KYC_DONE",
  UPLOADING_BUYER_DOCUMENT_DONE: "UPLOADING_BUYER_DOCUMENT_DONE",
  APPROVE_ORDER_FULL_FUND: "APPROVE_ORDER_FULL_FUND"
};
export const buyerSignedDocument = (
  userId,
  project,
  pendingOrderId,
  file,
  signature,
  id,
  address
) => {
  return {
    type: types.BUYER_SIGNED_INITIAL,
    userId,
    project,
    pendingOrderId,
    signature,
    id,
    address,
    file
  };
};
export const sellerSignedDocument = (userId, project, pendingOrderId, file) => {
  return {
    type: types.SELLER_SIGNED_INITIAL,
    userId,
    project,
    pendingOrderId,
    file
  };
};
export const signKyc = (userId, project, pendingOrderId, file, fileBase64) => {
  return {
    type: types.SIGN_KYC,
    userId,
    project,
    pendingOrderId,
    file,
    fileBase64
  };
};
export const approveDownPayment = (buyer, project, pendingOrderId) => {
  return {
    type: types.APPROVE_ORDER_DOWN_PAYMENT,
    buyer,
    project,
    pendingOrderId
  };
};
export const approveProject = project => {
  return {
    type: types.APPROVE_PROJECT,
    project
  };
};
export const withdrawANoReserved = (buyer, project, pendingOrderId) => {
  return {
    type: types.WITHDRAW_NO_RESERVED,
    buyer,
    project,
    pendingOrderId
  };
};
export const cancelAllOrder = (buyer, project, pendingOrderId) => {
  return {
    type: types.CANCEL_ALL_ORDER,
    buyer,
    project,
    pendingOrderId
  };
};
export const withdrawProjectFunds = (buyer, project, pendingOrderId) => {
  return {
    type: types.WITHDRAW_PROJECT_FUNDS,
    buyer,
    project,
    pendingOrderId
  };
};
export const approveFullFund = (buyer, project, pendingOrderId) => {
  return {
    type: types.APPROVE_ORDER_FULL_FUND,
    buyer,
    project,
    pendingOrderId
  };
};
export const approvePendingOrder = (buyer, project, pendingOrderId) => {
  return {
    type: types.APPROVE_PENDING_ORDER,
    buyer,
    project,
    pendingOrderId
  };
};
export const approvePendingOrderSecondPayment = (
  buyer,
  project,
  pendingOrderId
) => {
  return {
    type: types.APPROVE_PENDING_ORDER_SECOND_PAYMENT,
    buyer,
    project,
    pendingOrderId
  };
};
export const acceptOrder = (owner, project, pendingOrderId) => {
  return {
    type: types.ACCEPT_PENDING_ORDER,
    owner,
    project,
    pendingOrderId
  };
};
export const rejectOrder = (owner, project, pendingOrderId) => {
  return {
    type: types.REJECT_PENDING_ORDER,
    owner,
    project,
    pendingOrderId
  };
};
export const counterOffer = (owner, project, pendingOrderId, offer) => {
  return {
    type: types.COUNTER_OFFER_PENDING_ORDER,
    owner,
    project,
    pendingOrderId,
    offer
  };
};
