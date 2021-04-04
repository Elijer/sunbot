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
        var grey = "rgb(232, 232, 232);"
        if (e.id === "outsideYes"){
            e.style.background = "red";
            outsideOptions[1].style.background = "#e8e8e8";
        } else {
            outsideOptions[1].style.background = "red";
            outsideOptions[0].style.background = "#e8e8e8";
        }
    })
})

var cryOptions = [gg("moreCry"), gg("lessCry")];

cryOptions.forEach(function(e){

    e.addEventListener("click", function(){
        var grey = "rgb(232, 232, 232);"
        if (e.id === "lessCry"){
            if (gg("cryNumber").innerHTML > 0){
                gg("cryNumber").innerHTML--;
            }
        } else {
            gg("cryNumber").innerHTML++;
        }
    })
});


var displayDate = function(){

    var dateElement = gg("day");
    var timeElement = gg("time");
    //dateElement.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
    dateElement.innerHTML = moment().format('dddd, MMM Do');
    timeElement.innerHTML = moment().format('h:mm a');

}