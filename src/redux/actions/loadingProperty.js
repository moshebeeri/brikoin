export const types = {
  SAVE_LOADING_PROPERTY: "SAVE_LOADING_PROPERTY",
  SET_LOADING_PROPERTY: "SET_LOADING_PROPERTY",
  GET_LOADING_PROPERTIES: "GET_LOADING_PROPERTIES",
  DELETE_PROJECT: "DELETE_PROJECT",
  PROJECT_REVIEWED: "PROJECT_REVIEWED",
  PROJECT_REVIEWED_AND_APPROVED: "PROJECT_REVIEWED_AND_APPROVED",
  LISTEN_LOADING_PROJECTS: "LISTEN_LOADING_PROJECTS"
};

export const save = (user, entity) => {
  return {
    type: types.SAVE_LOADING_PROPERTY,
    user,
    entity
  };
};

export const listenProperties = user => {
  return {
    type: types.LISTEN_LOADING_PROJECTS,
    user
  };
};
export const deleteProject = projectId => {
  return {
    type: types.DELETE_PROJECT,
    projectId
  };
};
export const projectReviewed = projectId => {
  return {
    type: types.PROJECT_REVIEWED,
    projectId
  };
};

export const approveProject = projectId => {
  return {
    type: types.PROJECT_REVIEWED_AND_APPROVED,
    projectId
  };
};
//
// export const listenForProjectRequests = (projectAddress) => {
//   return {
//     type: types.LISTEN_PROJECT_REQUESTS,
//     projectAddress
//   }
// }
//
export const getAll = user => {
  return {
    type: types.GET_LOADING_PROPERTIES,
    user
  };
};


export const setLoadingProperties = results => {
  return {
    type: types.SET_LOADING_PROPERTY,
    results
  };
};
