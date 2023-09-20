export const types = {
  REGISTRARS: {
    SYNC: "REGISTRARS.SYNC",
    SET_STATUS: "REGISTRARS.SET_STATUS",
    NEW: {
      CHANGE: "REGISTRARS.NEW.CHANGE",
      SAVE: "REGISTRARS.NEW.SAVE",
      SET: "REGISTRARS.NEW.SET"
    },
    GET: "REGISTRARS.GET",
    GET_ALL: "REGISTRARS.GET_ALL",
    SET_ALL: "REGISTRARS.SET_ALL",
    SET_FIRESTORE: "REGISTRARS.SET_FIRESTORE"
  }
};

export const registrar = registrar => ({
  type: types.REGISTRARS.NEW.SAVE,
  registrar
});

export const syncRegistrars = registrars => ({
  type: types.REGISTRARS.SYNC,
  registrars
});
export const getRegistrars = () => ({
  type: types.REGISTRARS.GET_ALL
});

export const changeNewRegistrar = registrar => ({
  type: types.REGISTRARS.NEW.CHANGE,
  registrar
});

export const saveNewRegistrar = registrar => {
  registrar.timestamp = Date.now();
  return {
    type: types.REGISTRARS.NEW.SAVE,
    registrar
  };
};

export const setRegistrarStatus = (registrarId, done) => ({
  type: types.REGISTRARS.SET_STATUS,
  registrarId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.REGISTRARS.SET_FIRESTORE,
  useFirestore
});
