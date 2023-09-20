import { fork } from 'redux-saga/effects'

import loginSaga from './loginSaga'
import videoSaga from './videoSaga'

export default function * rootSaga () {
  console.log('root saga init')
  yield fork(loginSaga)
  yield fork(videoSaga)
}
