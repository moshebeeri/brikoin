import { types } from "../../redux/actions/groups";
import { REHYDRATE } from "redux-persist";

const initialState = {
  groupsStats: {},
  projectGroups: {},
  myGroups: {}
};
export default function reducer(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.groups
    };
  }
  let groupState = { ...state };
  switch (action.type) {
    case types.SAVE_STATS:
      groupState.groupsStats[action.groupId] = action.stats;
      return groupState;
    case types.SAVE_GROUPS:
      groupState.projectGroups[action.project] = action.groups;
      return groupState;
    case types.SAVE_MY_GROUPS:
        groupState.myGroups= action.groups;
        return groupState;
    default:
      return state;
  }
}
