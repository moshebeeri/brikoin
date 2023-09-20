import { types } from "../../redux/actions/userProfile";
import { REHYDRATE } from "redux-persist";

const initialState = {
  lang: "En",
  projectsView: "PlayGround",
  direction: "ltr",
  projectType: "",
  projectSearchText: ""
};
export default function reducer(state = initialState, action = {}) {
  let profile = { ...state };
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.userProfileReducer
    };
  }
  switch (action.type) {
    case types.SET_LANGUAGE:
      profile.lang = action.lang;
      profile.direction = action.direction;
      return profile;
    case types.FILTER_PROJECT:
      profile.projectType = action.filterType;
      profile.projectSearchText = action.searchText;
      return profile;
    case types.SET_PROJECTS_VIEW:
      profile.projectsView = action.projectsView;
      return profile;
    default:
      return state;
  }
}
