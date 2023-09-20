export const types = {
  TERMS: {
    SYNC: "TERMS.SYNC",
    SET_STATUS: "TERMS.SET_STATUS",
    NEW: {
      CHANGE: "TERMS.NEW.CHANGE",
      SAVE: "TERMS.NEW.SAVE",
      SET: "TERMS.NEW.SET"
    },
    SET_ALL: "TERMS.SET_ALL",
    GET_ALL: "TERMS.GET_ALL",

    SET_FIRESTORE: "TERMS.SET_FIRESTORE"
  }
};

export const terms = (email, password, name) => ({
  type: types.TERMS.NEW.SAVE,
  email,
  password,
  name
});
export const getTerms = () => ({
  type: types.TERMS.GET_ALL
});
export const syncTerms = terms => ({
  type: types.TERMS.SYNC,
  terms
});

export const changeNewTerms = terms => ({
  type: types.TERMS.NEW.CHANGE,
  terms
});

export const saveNewTerms = terms => {
  terms.timestamp = Date.now();
  return {
    type: types.TERMS.NEW.SAVE,
    terms
  };
};

export const setTermstatus = (termsId, done) => ({
  type: types.TERMS.SET_STATUS,
  termsId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.TERMS.SET_FIRESTORE,
  useFirestore
});
