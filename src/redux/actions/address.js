export const types = {
  FIND_ADDRESS: "FIND_ADDRESS",
  SET_ADDRESS_RESULTS: "SET_ADDRESS_RESULTS"
};

export const findAddress = (address, key) => {
  return {
    type: types.FIND_ADDRESS,
    key,
    address
  };
};

export const deleteAddress = key => {
  return {
    type: types.SET_ADDRESS_RESULTS,
    addresses: [],
    key
  };
};
