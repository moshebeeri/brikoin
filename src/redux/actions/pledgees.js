export const types = {
  PLEDGEES: {
    SYNC: "PLEDGEES.SYNC",
    SET_STATUS: "PLEDGEES.SET_STATUS",
    NEW: {
      CHANGE: "PLEDGEES.NEW.CHANGE",
      SAVE: "PLEDGEES.NEW.SAVE",
      SET: "PLEDGEES.NEW.SET"
    },
    SET_FIRESTORE: "PLEDGEES.SET_FIRESTORE"
  }
};

export const pledgee = (email, password, name) => ({
  type: types.PLEDGEES.NEW.SAVE,
  email,
  password,
  name
});

export const syncPledgees = pledgees => ({
  type: types.PLEDGEES.SYNC,
  pledgees
});

export const changeNewPledgee = pledgee => ({
  type: types.PLEDGEES.NEW.CHANGE,
  pledgee
});

export const saveNewPledgee = pledgee => {
  pledgee.timestamp = Date.now();
  return {
    type: types.PLEDGEES.NEW.SAVE,
    pledgee
  };
};

export const setPledgeeStatus = (pledgeeId, done) => ({
  type: types.PLEDGEES.SET_STATUS,
  pledgeeId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.PLEDGEES.SET_FIRESTORE,
  useFirestore
});
