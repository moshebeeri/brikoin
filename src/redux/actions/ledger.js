export const types = {
  LISTEN_FOR_LEDGER: "LISTEN_FOR_LEDGER"
};

export const listenLedger = user => ({
  type: types.LISTEN_FOR_LEDGER,
  user
});
