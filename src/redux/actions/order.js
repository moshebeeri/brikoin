export const types = {
  LISTEN_FOR_ORDER: "LISTEN_FOR_ORDER"
};

export const listenOrder = (
  projectAddress,
  orderId,
  investAmount,
  investPrice
) => ({
  type: types.LISTEN_FOR_ORDER,
  projectAddress,
  orderId
});
