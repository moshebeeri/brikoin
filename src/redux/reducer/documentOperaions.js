import { types } from "../../redux/actions/documentOperations";
import { REHYDRATE } from "redux-persist";

const initialState = {
  uploading: false,
  loading: false,
  files: {},
  loadFiles: {},
  loadingFiles:[],
  loadStartingFiles: {}

};
export default function documentOperations(state = initialState, action = {}) {
  if (action.type === REHYDRATE) {
    const savedData = action.payload || initialState;
    return {
      ...state,
      ...savedData.documentOperations
    };
  }
  let currentState = {...state}
  switch (action.type) {
    case types.UPLOADING_FILE:
      return {
        ...state,
        uploading: true
      };
    case types.UPLOADING_FILE_DONE:
      return {
        ...state,
        uploading: false,
        laoding: false,

      };
      
      case types.FILE_LOADING:
          currentState.loadingFiles = action.files
        return currentState
      case types.LOAD_FILE:
          currentState.loading = true
          currentState.loadFiles[action.fileName] = true
          currentState.loadStartingFiles[action.fileName] = new Date().getTime()
        return currentState
      case types.FILE_LOADED:
          currentState.files[action.fileName]= action.file
          currentState.loadFiles[action.fileName] = false
          const index = currentState.loadingFiles.indexOf(action.orginalFileName);
          if (index > -1) {
             currentState.loadingFiles.splice(index, 1);
          }
          if(currentState.loadingFiles.length === 0){
            currentState.loading = false
          }
        return currentState
        case types.FILE_LOADED_DONE:
          return currentState
      case types.UPLOADING_FILE_DONE:
        return {
          ...state,
          uploading: false
        };
    default:
      return state;
  }
}
