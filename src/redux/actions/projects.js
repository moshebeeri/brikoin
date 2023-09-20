export const types = {
  PROJECTS: {
    SYNC: "PROJECTS.SYNC",
    SET_STATUS: "PROJECTS.SET_STATUS",
    NEW: {
      CHANGE: "PROJECTS.NEW.CHANGE",
      SAVE: "PROJECTS.NEW.SAVE",
      SET: "PROJECTS.NEW.SET"
    },
    GET_ALL: "PROJECTS.GET_ALL",
    GET: "PROJECTS.GET",
    SET_ALL: "PROJECTS.SET_ALL",
    SET_FIRESTORE: "PROJECTS.SET_FIRESTORE"
  },
  SET_PROJECTS_RESULTS: "SET_PROJECTS_RESULTS",
  ASSIGNMENT_REQUEST: "ASSIGNMENT_REQUEST",
  SET_SUB_PROJECTS: "SET_SUB_PROJECTS",
  SET_PROJECT: "SET_PROJECT",
  SET_ORGANIZATION: "SET_ORGANIZATION",
  SET_FULL_PROJECTS: "SET_FULE_PROJECTS",
  SET_PROJECTS_MORTGAGE: "SET_PROJECTS_MORTGAGE"
};

export const saveNewProject = (project, user) => {
  project.timestamp = Date.now();
  return {
    type: types.PROJECTS.NEW.SAVE,
    project,
    user
  };
};
export const getProjects = () => {
  return {
    type: types.PROJECTS.GET_ALL
  };
};

export const setProjects = projects => {
  return {
    type: types.SET_FULL_PROJECTS,
    projects
  };
};

export const assigmentReqeust = request => {
  return {
    type: types.ASSIGNMENT_REQUEST,
    request
  };
};


export const setSubProjects = (projectId, subProjects) => {
  return {
    type: types.SET_SUB_PROJECTS,
    projectId,
    subProjects
  };
};

export const setProject = (projectAddress, project) => {
  return {
    type: types.SET_PROJECT,
    projectAddress,
    project
  };
};

