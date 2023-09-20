export const types = {
  OPERATION_DONE: "OPERATION_DONE"
};

export const operationDone = (operation, user) => {
  return {
    type: types.OPERATION_DONE,
    operation,
    user
  };
};
