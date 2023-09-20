import firebase from "firebase";
import ReduxSagaFirebase from "redux-saga-firebase";

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: "AIzaSyBjkU3FHBbALgUGOughkUIK0npZEXcjyes",
      authDomain: "brikoinprod.firebaseapp.com",
      databaseURL: "https://brikoinprod.firebaseio.com",
      projectId: "brikoinprod",
      storageBucket: "brikoinprod.appspot.com",
      messagingSenderId: "793695420771",
      appId: "1:793695420771:web:ae24cea255391823"
    })
  : firebase.app();

const rsf = new ReduxSagaFirebase(firebaseApp);
export default rsf;
