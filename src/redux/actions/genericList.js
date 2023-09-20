export const types = {
  GET_NEXT_PAGE: "GET_NEXT_PAGE",
  GET_LAST_PAGE: "GET_LAST_PAGE",
  SET_USER_LEDGER: "SET_USER_LEDGER",
  SET_ALL_USER_LEDGER: "SET_ALL_USER_LEDGER",
  LISTEN_FOR_LIST: "LISTEN_FOR_LIST"
};

export const getNextPage = (
  listPath,
  pageLength,
  key,
  saveTypeAction,
  sortBy
) => {
  return {
    type: types.GET_NEXT_PAGE,
    listPath,
    pageLength,
    key,
    saveTypeAction,
    sortBy
  };
};

export const getLastPage = (
  listPath,
  pageLength,
  key,
  saveTypeAction,
  sortBy
) => {
  return {
    type: types.GET_LAST_PAGE,
    listPath,
    pageLength,
    key,
    saveTypeAction,
    sortBy
  };
};

export const listenForList = (listPath, pageLength, saveTypeAction, sortBy) => {
  return {
    type: types.LISTEN_FOR_LIST,
    listPath,
    pageLength,
    saveTypeAction,
    sortBy
  };
};
