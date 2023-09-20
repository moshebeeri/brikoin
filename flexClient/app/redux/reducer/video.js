import { types } from '../actions/video'
const initialState = {
  token: '',
  newToken: '',
  moveToVideo: false,
  channelId: '',
  change: false
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_CHAT_TOKEN:
      return {
        ...state,
        newToken: action.token,
        change: true
      }
 case types.VIDEO_PARAMS:
      return {
        ...state,
        channelId: action.channelSid,
        moveToVideo: true
      }

    case types.MOVED_TO_VIDEO:
      return {
        ...state,
        moveToVideo: false
      }
    case types.CLEAN_CHAT_TOKEN:
      return {
        ...state,
        newToken: '',
        change: false
      }
    default:
      return state
  }
}
