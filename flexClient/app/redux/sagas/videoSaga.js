import {call, takeEvery, put, take, select} from 'redux-saga/effects'

import { types } from '../actions/video'
import firebase from 'firebase'
import rsf from '../rsf'
function * createToken (action) {
  console.log('CREATEING TOKEN')
  let response = yield call(firebase.functions().httpsCallable(`flex/token/${action.identify}`))
  console.log(response)
  // yield put({
  //   type: types.SET_TOKEN,
  //   token: response.data.token
  // })
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
function * createVideoTask (action) {
  console.log('CREATEING TASK')

  yield call(firebase.functions().httpsCallable(`flex/taskVideo/${action.room}/${action.clientId}`))
}
function * createChatTask (action) {
  console.log('CREATEING TASK')

  yield call(firebase.functions().httpsCallable(`flex/taskChat/${action.channelSid}/${action.clientId}`))
  const request = rsf.app.database().ref(`flex/chat/${action.channelSid}`)
  yield call([request, request.set], {active: true, type: 'chat'})
}
function * moveToVideo (action) {
  console.log('MOVE TO VIDEO')
  yield put({
    type: types.VIDEO_PARAMS,
    channelSid: action.channelSid
  })
  const request = rsf.app.database().ref(`flex/chat/${action.channelSid}`)
  yield call([request, request.set], {active: true, type: 'video'})
}

export default function * videoSaga () {
  yield takeEvery(types.CREATE_TOKEN, createToken)
  yield takeEvery(types.MOVE_TO_VIDEO, moveToVideo)
  yield takeEvery(types.CREATE_CHAT_TOKEN, createChatToken)
  yield takeEvery(types.CREATE_VIDEO_TASK, createVideoTask)
  yield takeEvery(types.CREATE_CHAT_TASK, createChatTask)
}
