import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";
import { firestoreTest } from "./helpers/firestoreTest";
import { signIn } from "./helpers/auth";


document.addEventListener("DOMContentLoaded", event => {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);
    firestoreTest(db);


    // EVENT LISTENERS
    document.getElementById('login-button').addEventListener('click', function(){
        //signIn(firebase);
        firebase.auth().signInAnonymously()
        .then(() => {
            console.log("signed in");
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
        })
    });

});