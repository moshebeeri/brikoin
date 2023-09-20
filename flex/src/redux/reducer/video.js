import { types } from '../actions/video'
import {REHYDRATE} from 'redux-persist'
const initialState = {
  identify: '',
  videoToken: '',
  chatToken: '',
  chatChannel: '',
  room: '',
  clientId: '',
  chatType: 'chat'
}

export default function reducer (state = initialState, action = {}) {
  // if (action.type === REHYDRATE) {
  //   const savedData = action.payload || initialState
  //   return {
  //     ...state, ...savedData.video
  //   }
  // }
  switch (action.type) {
    case types.SET_TOKEN:
      return {
        ...state,
        videoToken: action.token
      }
    case types.SET_CHAT_TOKEN:
      return {
        ...state,
        chatToken: action.token
      }
    case types.JOIN_ROOM:
      return {
        ...state,
        room: action.room,
        clientId: action.clientId
      }
    case types.JOIN_CHAT_ROOM:
      return {
        ...state,
        chatChannel: action.chatChannel,
        customerName: action.name
      }
case types.CHAT_TYPE:
      return {
        ...state,
        chatType: action.chatType
      }

    case types.LEAVE_ROOM:
      return {
        ...state,
        room: '',
        clientId: ''
      }
    case types.LEAVE_CHAT_ROOM:
      return {
        ...state,
        chatToken: '',
        chatType: 'chat',
        clientId: '',
        chatChannel: '',
        customerName: ''
      }
    case types.SET_IDENTIFY:
      return {
        ...state,
        identify: action.identify
      }
    default:
      return state
  }
}
