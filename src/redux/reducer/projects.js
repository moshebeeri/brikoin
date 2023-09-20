import { types } from "../../redux/actions/projects";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  projects: [],
  projectByAddress:{},
  subProjectsById:{},
  projectsMortgages: {},
  organizations: [],
  new: "",
  useFirestore: false
};

export default function reducer(state = initialState, action = {}) {
  let projectsState = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.projects
    };
  }
  switch (action.type) {
    case types.PROJECTS.SYNC:
      return {
        ...state,
        list: action.projects
      };
    case types.SET_FULL_PROJECTS:
      return {
        ...state,
        projects: action.projects
      };
    case types.SET_PROJECTS_MORTGAGE:
      console.log(action.projectsMortgages);
      return {
        ...state,
        projectsMortgages: action.projectsMortgages
      };
      case types.SET_SUB_PROJECTS:
        projectsState.subProjectsById[action.projectId] = action.subProjects;
        return projectsState;
      case types.SET_PROJECT:
        projectsState.projectByAddress[action.projectAddress] = action.project;
        return projectsState;
    case types.PROJECTS.NEW.CHANGE:
      return {
        ...state,
        new: action.project
      };
    case types.PROJECTS.NEW.SET:
      projectsState.list.push(action.project);
      return projectsState;
    case types.PROJECTS.SET_ALL:
      projectsState.list = action.projects;
      return projectsState;
    case types.SET_ORGANIZATION:
      projectsState.organizations = action.organizations;
      return projectsState;
    case types.PROJECTS.SET_FIRESTORE:
      return {
        ...state,
        useFirestore: action.useFirestore
      };
    default:
      return state;
  }
}
