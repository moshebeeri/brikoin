import firebase from 'firebase'
import '@firebase/firestore'
import ReduxSagaFirebase from 'redux-saga-firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAgqO2_bAaANtNN--nrbR2kcbwaR53-cG8',
  authDomain: 'firestone-1.firebaseapp.com',
  databaseURL: 'https://firestone-1.firebaseio.com',
  projectId: 'firestone-1',
  storageBucket: 'firestone-1.appspot.com',
  messagingSenderId: '448842214347'
  //
  // apiKey: 'AIzaSyBqlUvHBI_pW5JEFbzZv_2h8M9o0DetI88',
  // authDomain: 'cornerstone-1.firebaseapp.com',
  // databaseURL: 'https://cornerstone-1.firebaseio.com',
  // projectId: 'cornerstone-1',
  // storageBucket: 'cornerstone-1.appspot.com',
  // messagingSenderId: '470988064722'
})

const rsf = new ReduxSagaFirebase(firebaseApp)
export default rsf
