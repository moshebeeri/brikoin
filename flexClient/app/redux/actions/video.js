export const types = {
  CREATE_TOKEN: 'CREATE_TOKEN',
  CREATE_CHAT_TOKEN: 'CREATE_CHAT_TOKEN',
  CLEAN_CHAT_TOKEN: 'CLEAN_CHAT_TOKEN',
  CREATE_VIDEO_TASK: 'CREATE_VIDEO_TASK',
  CREATE_CHAT_TASK: 'CREATE_CHAT_TASK',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  SET_TOKEN: 'SET_TOKEN',
  MOVE_TO_VIDEO: 'MOVE_TO_VIDEO',
  MOVED_TO_VIDEO: 'MOVED_TO_VIDEO',
  VIDEO_PARAMS: 'VIDEO_PARAMS',
  SET_CHAT_TOKEN: 'SET_CHAT_TOKEN',
  SET_IDENTIFY: 'SET_IDENTIFY'
}

export const createToken = (identify) => {
  console.log('CREATE TOKEN')
  return {
    type: types.CREATE_TOKEN,
    identify
  }
}
export const createChatToken = (identify) => {
  console.log('CREATE CHAT TOKEN')
  return {
    type: types.CREATE_CHAT_TOKEN,
    identify
  }
}

export const createChatTask = (channelSid, clientId) => {
  console.log('CREATE Chat Task')
  return {
    type: types.CREATE_CHAT_TASK,
    channelSid,
    clientId
  }
}
export const moveToVideo = (channelSid) => {
  console.log('CREATE Chat Task')
  return {
    type: types.MOVE_TO_VIDEO,
    channelSid
  }
}
export const cleanToken = () => {
  console.log('CLEAN Chat Token')
  return {
    type: types.CLEAN_CHAT_TOKEN,
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
export const movedToVideo = () => {
  console.log('CREATE TOKEN')
  return {
    type: types.MOVED_TO_VIDEO,
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

export const leaveRoom = () => {
  console.log('CREATE TOKEN')
  return {
    type: types.LEAVE_ROOM
  }
}
