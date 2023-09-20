import { combineReducers } from 'redux'
import { firebaseReducer as firebase } from 'react-redux-firebase'
import { reducer as firestore } from 'redux-firestore'
import video from './video'

export default combineReducers({
  video,
  firebase,
  firestore
})
