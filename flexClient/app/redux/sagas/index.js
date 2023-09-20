import { fork } from 'redux-saga/effects'

import videoSaga from './videoSaga'

export default function * rootSaga () {
  console.log('root saga init')
  yield fork(videoSaga)
}
