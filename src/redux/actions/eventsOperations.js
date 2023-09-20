export const types = {
  SAVE_RANGES: "SAVE_RANGES",
  SELECT_APPOINTMENT: "SELECT_APPOINTMENT"
};

export const saveRanges = (user, ranges) => {
  return {
    type: types.SAVE_RANGES,
    user,
    ranges
  };
};

export const selectAppointment = (user, range, userTo, selected) => {
  return {
    type: types.SELECT_APPOINTMENT,
    user,
    range,
    userTo,
    selected
  };
};
