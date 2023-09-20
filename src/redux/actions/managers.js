export const types = {
  MANAGERS: {
    SYNC: "MANAGERS.SYNC",
    SET_STATUS: "MANAGERS.SET_STATUS",
    NEW: {
      CHANGE: "MANAGERS.NEW.CHANGE",
      SAVE: "MANAGERS.NEW.SAVE",
      SET: "MANAGERS.NEW.SET"
    },
    SET_ALL: "MANAGERS.SET_ALL",
    GET_ALL: "MANAGERS.GET_ALL",

    SET_FIRESTORE: "MANAGERS.SET_FIRESTORE"
  }
};

export const manager = (email, password, name) => ({
  type: types.MANAGERS.NEW.SAVE,
  email,
  password,
  name
});
export const getManagers = () => ({
  type: types.MANAGERS.GET_ALL
});

export const syncManagers = managers => ({
  type: types.MANAGERS.SYNC,
  managers
});

export const changeNewManager = manager => ({
  type: types.MANAGERS.NEW.CHANGE,
  manager
});

export const saveNewManager = manager => {
  manager.timestamp = Date.now();
  return {
    type: types.MANAGERS.NEW.SAVE,
    manager
  };
};

export const setManagerStatus = (managerId, done) => ({
  type: types.MANAGERS.SET_STATUS,
  managerId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.MANAGERS.SET_FIRESTORE,
  useFirestore
});
