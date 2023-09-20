import firebase from "firebase";
import ReduxSagaFirebase from "redux-saga-firebase";

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp({
      apiKey: "AIzaSyBqlUvHBI_pW5JEFbzZv_2h8M9o0DetI88",
      authDomain: "cornerstone-1.firebaseapp.com",
      databaseURL: "https://cornerstone-1.firebaseio.com",
      projectId: "cornerstone-1",
      storageBucket: "cornerstone-1.appspot.com",
      messagingSenderId: "470988064722"
    })
  : firebase.app();

const rsf = new ReduxSagaFirebase(firebaseApp);
export default rsf;
