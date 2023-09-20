export const types = {
  CREATE_TOKEN: 'CREATE_TOKEN',
  CREATE_VIDEO_TASK: 'CREATE_VIDEO_TASK',
  JOIN_ROOM: 'JOIN_ROOM',
  CREATE_CHAT_TOKEN: 'CREATE_CHAT_TOKEN',
  SET_CHAT_TOKEN: 'SET_CHAT_TOKEN',
  CHAT_TYPE: 'CHAT_TYPE',
  JOIN_CHAT_ROOM: 'JOIN_CHAT_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  LEAVE_CHAT_ROOM: 'LEAVE_CHAT_ROOM',
  SET_TOKEN: 'SET_TOKEN',
  SET_IDENTIFY: 'SET_IDENTIFY'
}

export const createToken = (identify) => {
  console.log('CREATE TOKEN')
  return {
    type: types.CREATE_TOKEN,
    identify
  }
}
export const createVideoTask = (room, clientId) => {
  console.log('CREATE TOKEN')
  return {
    type: types.CREATE_VIDEO_TASK,
    room,
    clientId
  }
}

export const joinRoom = (room, clientId) => {
  console.log('CREATE TOKEN')
  return {
    type: types.JOIN_ROOM,
    room,
    clientId
  }
}

export const joinChatChannel = (chatChannel, name) => {
  console.log('CREATE TOKEN')
  return {
    type: types.JOIN_CHAT_ROOM,
    chatChannel,
    name
  }
}

export const createChatToken = (identify) => {
  console.log('CREATE CHAT TOKEN')
  return {
    type: types.CREATE_CHAT_TOKEN,
    identify
  }
}

export const leaveRoom = () => {
  console.log('CREATE TOKEN')
  return {
    type: types.LEAVE_ROOM
  }
}

export const leaveChatChanel = () => {
  console.log('LEAVE CHAT ROOM')
  return {
    type: types.LEAVE_CHAT_ROOM
  }
}
