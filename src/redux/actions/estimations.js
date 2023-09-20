export const types = {
  ESTIMATIONS: {
    SYNC: "ESTIMATIONS.SYNC",
    SET_STATUS: "ESTIMATIONS.SET_STATUS",
    NEW: {
      CHANGE: "ESTIMATIONS.NEW.CHANGE",
      SAVE: "ESTIMATIONS.NEW.SAVE",
      SET: "ESTIMATIONS.NEW.SET"
    },
    GET_ALL: "ESTIMATIONS.GET_ALL",
    SET_ALL: "ESTIMATIONS.SET_ALL",
    SET_FIRESTORE: "ESTIMATIONS.SET_FIRESTORE"
  }
};

export const estimation = (email, password, name) => ({
  type: types.ESTIMATIONS.NEW.SAVE,
  email,
  password,
  name
});

export const getEstimations = () => ({
  type: types.ESTIMATIONS.GET_ALL
});

export const syncEstimations = estimations => ({
  type: types.ESTIMATIONS.SYNC,
  estimations
});

export const plus = a => {
  a.b = 1;
  return a;
};

export const changeNewEstimation = estimation => {
  estimation.timestamp = Date.now();
  return {
    type: types.ESTIMATIONS.NEW.CHANGE,
    estimation
  };
};

export const saveNewEstimation = (estimation, drizzle) => {
  estimation.timestamp = Date.now();
  return {
    type: types.ESTIMATIONS.NEW.SAVE,
    estimation,
    drizzle
  };
};

export const setEstimationStatus = (estimationId, done) => ({
  type: types.ESTIMATIONS.SET_STATUS,
  estimationId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.ESTIMATIONS.SET_FIRESTORE,
  useFirestore
});
