
import { call, takeEvery } from 'redux-saga/effects'

import { LOGIN } from '../actions/login'
import rsf from '../rsf'
const user = 'flex@gmail.com'
const pass = 'Flex123456'
export function * login (action) {
  console.log('LOGIN')
  try {
    // yield call(rsf.auth.signInWithEmailAndPassword, user, pass)
  } catch (error) {
    // yield call(rsf.auth.signInWithEmailAndPassword, user, pass)
  }
}

export default function * loginSaga () {
  console.log('LOGIN init')
  yield takeEvery(LOGIN, login)
}
