export const types = {
  PROPERTIES: {
    SYNC: "PROPERTIES.SYNC",
    SET_STATUS: "PROPERTIES.SET_STATUS",
    NEW: {
      CHANGE: "PROPERTIES.NEW.CHANGE",
      SAVE: "PROPERTIES.NEW.SAVE",
      SET: "PROPERTIES.NEW.SET"
    },
    SET_ALL: "PROPERTIES.SET_ALL",
    GET_ALL: "PROPERTIES.GET_ALL",
    SET_FIRESTORE: "PROPERTIES.SET_FIRESTORE"
  }
};

export const property = property => ({
  type: types.PROPERTIES.NEW.SAVE,
  property
});

export const syncProperties = properties => ({
  type: types.PROPERTIES.SYNC,
  properties
});

export const changeNewProperty = property => ({
  type: types.PROPERTIES.NEW.CHANGE,
  property
});

export const saveNewProperty = property => {
  property.timestamp = Date.now();
  return {
    type: types.PROPERTIES.NEW.SAVE,
    property
  };
};

export const getProperties = () => ({
  type: types.PROPERTIES.GET_ALL
});

export const setPropertiestatus = (propertyId, done) => ({
  type: types.PROPERTIES.SET_STATUS,
  propertyId,
  done
});

export const setFirestore = useFirestore => ({
  type: types.PROPERTIES.SET_FIRESTORE,
  useFirestore
});
