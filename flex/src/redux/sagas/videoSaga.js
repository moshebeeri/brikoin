import {call, takeEvery, put, take, select} from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { types } from '../actions/video'
import firebase from 'firebase'
import rsf from '../rsf'

function createEventChannel (channelSid) {
  const listener = eventChannel(
    emit => {
      rsf.app.database().ref('flex/chat/').child(channelSid)
        .on(
          'value',
          data => emit(data.val()
          ))
      return () => rsf.app.database().ref('flex/chat/').child(channelSid).off(listener)
    }
  )
  return listener
}

function * createToken (action) {
  console.log('CREATEING TOKEN')
  let response = yield call(firebase.functions().httpsCallable(`flex/token/${action.identify}`))
  console.log(response)
  yield put({
    type: types.SET_TOKEN,
    token: response.data.token
  })
}
function * createVideoTask (action) {
  console.log('CREATING TASK')

  yield call(firebase.functions().httpsCallable(`flex/taskVideo/${action.room}/${action.clientId}`))
}


function * listenForChatEvents (action) {
  console.log(action)
  if (action.chatChannel) {
    const updateChannel = createEventChannel(action.chatChannel)
    while (true) {
      let chat = yield take(updateChannel)
      yield put({
        type: types.CHAT_TYPE,
        chatType: chat.type
      })
    }
  }
}
function * createChatToken (action) {
  console.log('CREATEING CHAT TOKEN')
  let response = yield call(firebase.functions().httpsCallable(`flex/chatToken/${action.identify}/test`))
  console.log('GETTING RESPONSE')
  console.log(response)
  yield put({
    type: types.SET_CHAT_TOKEN,
    token: response.data.token
  })
}

export default function * videoSaga () {
  yield takeEvery(types.CREATE_TOKEN, createToken)
  yield takeEvery(types.CREATE_CHAT_TOKEN, createChatToken)
  yield takeEvery(types.JOIN_CHAT_ROOM, listenForChatEvents)
  yield takeEvery(types.CREATE_VIDEO_TASK, createVideoTask)
}
