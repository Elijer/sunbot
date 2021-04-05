import firebase from 'firebase/app';
import 'firebase/firestore';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";
import { firestoreTest } from "./helpers/firestoreTest";
import { gg } from "./helpers/utility";
import moment from 'moment';


document.addEventListener("DOMContentLoaded", event => {

    var state = {};

    displayDate(state);
    console.log(state.date);
    
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);
    firestoreTest(db);

});

var outsideOptions = [gg("outsideYes"), gg("outsideNo")];

outsideOptions.forEach(function(e){
    e.addEventListener("click", function(){
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
        if (e.id === "lessCry"){
            if (gg("cryNumber").innerHTML > 0){
                gg("cryNumber").innerHTML--;
            }
        } else {
            gg("cryNumber").innerHTML++;
        }
    })
});

var energyOptions = [gg("little"), gg("some"), gg("lots")];

energyOptions.forEach(function(e){
    e.addEventListener("click", function(){
        energyOptions.forEach(function(s){
            s.style.background = "#e8e8e8";
        })

        e.style.background = "red";

    })
})


var displayDate = function(state){

    var dateElement = gg("day");
    var timeElement = gg("time");
    var theMoment = moment();
    var dayRegion;

    var timeOfDay = gg("dayRegion");
    var timesOfDay = ["morning", "afternoon", "evening"];
    var morningStart = moment('2:00am', 'h:mma');
    var morningEnd = moment('11:59am', 'h:mma');
    var middayEnd = moment('6:00pm', 'h:mma');

    if (theMoment.isBefore(middayEnd) && theMoment.isAfter(morningEnd)){
        dayRegion = "midday"
        //midday
    } else if (theMoment.isBefore(morningEnd) && theMoment.isAfter(morningStart)){
        dayRegion = "morning";
        //morning
    } else if (theMoment.isAfter(middayEnd)){
       dayRegion = "evening";
        //evening
    }

    gg("dayRegion").innerHTML = dayRegion;
    //gg("timeOfDay").innerHTML = dayRegion;
    

    state.date = moment().format('L');




    //dateElement.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
    dateElement.innerHTML = theMoment.format('dddd, MMM Do');
    timeElement.innerHTML = theMoment.format('h:mm a');

}