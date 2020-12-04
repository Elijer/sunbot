import firebase from 'firebase/app';
import 'firebase/firestore';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";


document.addEventListener("DOMContentLoaded", event => {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);


    // Local Emulators Test
    var citiesRef = db.collection("cities");
    citiesRef.doc("sferd").set({
        name: "San Francisco", state: "CA", country: "USA",
        capital: false, population: 860000,
        regions: ["west_coast", "norcal"]
    });

});