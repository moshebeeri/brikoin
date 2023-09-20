import { types } from "../../redux/actions/loadingProperty";
import { REHYDRATE } from "redux-persist";
const initialState = {
  list: [],
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.list
    };
  }
  let currentState = { ...state };
  switch (action.type) {
    case types.SET_LOADING_PROPERTY:
      return {
        ...state,
        list: action.results,
        loaded: true
      };
    case types.DELETE_PROJECT:
      return {
        ...state,
        list: currentState.list.filter(
          project => action.projectId !== project.id
        ),
        loaded: true
      };
    case types.PROJECT_REVIEWED:
      const projects = currentState.list.filter(
        project => action.projectId === project.id
      );
      if (projects.length > 0) {
        let project = projects[0];
        project.reviewed = true;
        return {
          ...state,
          list: currentState.list,
          loaded: true
        };
      }
      break;

    case types.PROJECT_REVIEWED_AND_APPROVED:
      const projectsFiltered = currentState.list.filter(
        project => action.projectId === project.id
      );
      if (projectsFiltered.length > 0) {
        let project = projectsFiltered[0];
        project.approved = true;
        return {
          ...state,
          list: currentState.list,
          loaded: true
        };
      }
      break;
    // case types.SAVE_LOADING_PROPERTY:
    //   currentState.list.push(action.entity)
    //   return {
    //     ...state,
    //     list: currentState.list,
    //     loaded: true
    //   }
    default:
      return state;
  }
}
