import firebase from 'firebase/app';
import 'firebase/firestore';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";
import { firestoreTest } from "./helpers/firestoreTest";
import { gg } from "./helpers/utility";
import moment from 'moment';


document.addEventListener("DOMContentLoaded", event => {

    displayDate();
    
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);
    firestoreTest(db);

});

var outsideOptions = [gg("outsideYes"), gg("outsideNo")];

outsideOptions.forEach(function(e){
    e.addEventListener("click", function(){
        if (e.id === "outsideYes"){
            e.style.background = "green";
            outsideOptions[1].style.background = "grey";
        } else {
            outsideOptions[1].style.background = "green";
            outsideOptions[0].style.background = "grey";
        }
    })
})


var displayDate = function(){

    var dateElement = gg("date");
    var timeElement = gg("time");
    //dateElement.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
    dateElement.innerHTML = moment().format('dddd, MMM Do');
    timeElement.innerHTML = moment().format('h:mm a');

}