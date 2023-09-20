export const types = {
  TRUSTEES: {
    SYNC: "TRUSTEES.SYNC",
    SET_STATUS: "TRUSTEES.SET_STATUS",
    NEW: {
      CHANGE: "TRUSTEES.NEW.CHANGE",
      SAVE: "TRUSTEES.NEW.SAVE",
      SET: "TRUSTEES.NEW.SET"
    },
    GET_ALL: "TRUSTEES.GET_ALL",
    SET_ALL: "TRUSTEES.SET_ALL",
    SET_FIRESTORE: "TRUSTEES.SET_FIRESTORE"
  }
};

export const trustee = (email, password, name) => ({
  type: types.TRUSTEES.NEW.SAVE,
  email,
  password,
  name
});

export const syncTrustees = trustees => ({
  type: types.TRUSTEES.SYNC,
  trustees
});

export const changeNewTrustee = trustee => ({
  type: types.TRUSTEES.NEW.CHANGE,
  trustee
});

export const getTrustees = () => ({
  type: types.TRUSTEES.GET_ALL
});

export const saveNewTrustee = trustee => {
  trustee.timestamp = Date.now();
  return {
    type: types.TRUSTEES.NEW.SAVE,
    trustee
  };
};

export const setTrusteeStatus = (trusteeId, done) => ({
  type: types.TRUSTEES.SET_STATUS,
  trusteeId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.TRUSTEES.SET_FIRESTORE,
  useFirestore
});
