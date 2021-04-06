import firebase from 'firebase/app';
import 'firebase/firestore';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";
import { firestoreTest } from "./helpers/firestoreTest";
import { gg } from "./helpers/utility";
import moment from 'moment';


document.addEventListener("DOMContentLoaded", event => {
    
    // Firebase stuff
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);
    firestoreTest(db);

    // Create state and add in date info about it
    var state = {};
    var theMoment = moment();
    state.date = moment().format('L');
    state.fsDate = state.date.replace(/\//g, "-");
    state.entryRef = db.collection("entries").doc(state.fsDate);
    state.currentTime = new Date();

    // Format page according to date
    var timeOfDay = getTimeOfDay(theMoment);
    state.timeOfDay = timeOfDay
    gg("dayRegion").innerHTML = state.timeOfDay
    setDateHeader(theMoment);


    //var state = displayDate();
    state.entryRef = db.collection("entries").doc(state.fsDate);
    state.entryRef.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

            state.entryRef.set({
                date: state.fsDate,
                createdAt: state.currentTime,
                updatedAt: state.currentTime
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

        }

        // If state exists, initialize form
        if (state.entryRef){
            initializeForm(state);
        }

    }).catch((error) => {
        console.log("Error getting document:", error);
    });

});

var initializeForm = function(state){
    var outsideOptions = [gg("outsideYes"), gg("outsideNo")];

/*     var setWithMerge = cityRef.set({
        capital: true
    }, { merge: true }); */

    outsideOptions.forEach(function(e){
        e.addEventListener("click", function(){
            var went;
            if (e.id === "outsideYes"){
                e.style.background = "red";
                outsideOptions[1].style.background = "#e8e8e8";
                went = true;
    
            } else {
                outsideOptions[1].style.background = "red";
                outsideOptions[0].style.background = "#e8e8e8";
                went = false;
            }
    
            state.entryRef.set({
                outside: went
            }, { merge: true })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    
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

            var cryNumber = gg("cryNumber").innerHTML;
            state.entryRef.set({
                cryTally: cryNumber
            }, { merge: true })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

        })
    });
    
    var energyOptions = [gg("little"), gg("some"), gg("lots")];
    
    energyOptions.forEach(function(e){
        e.addEventListener("click", function(){
             var selection;
             var counter = 0;

            energyOptions.forEach(function(s){
                s.style.background = "#e8e8e8";
                counter++;
                if (s === e){
                    selection = counter;
                }
            })
    
            e.style.background = "red";
            
            var docObj = {};
            var energyField = 'energy' + state.timeOfDay;
            docObj[energyField] = selection;

            state.entryRef.set(docObj, { merge: true })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    
        })
    })

    createbCGrid(state);
}

var getTimeOfDay = function(m){
    var timeOfDay = gg("dayRegion");
    var timesOfDay = ["morning", "afternoon", "evening"];
    var morningStart = moment('2:00am', 'h:mma');
    var morningEnd = moment('11:59am', 'h:mma');
    var middayEnd = moment('6:00pm', 'h:mma');

    if (m.isBefore(middayEnd) && theMoment.isAfter(morningEnd)){
        timeOfDay = "midday"
        //midday
    } else if (m.isBefore(morningEnd) && theMoment.isAfter(morningStart)){
        timeOfDay = "morning";
        //morning
    } else if (m.isAfter(middayEnd)){
       timeOfDay = "evening";
        //evening
    }

    return timeOfDay
}


var setDateHeader = function(m){

    var dateElement = gg("day");
    var timeElement = gg("time");

    //dateElement.innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
    dateElement.innerHTML = m.format('dddd, MMM Do');
    timeElement.innerHTML = m.format('h:mm a');

}

var createbCGrid = function(state){
    var target = gg("bcGrid");
    for (var i = 0; i < 28; i ++){

        var newEl =  document.createElement('div')
        newEl.classList.add("grid-item");
        newEl.id = `grid-item-${i}`;
        newEl.innerHTML = i + 1;

        newEl.addEventListener("click", function(e){

            for (var j = 0; j < 28; j ++){
                gg(`grid-item-${j}`).style.background = "#e8e8e8";
            }

            e.path[0].style.background = "red";
            
            state.entryRef.set({
                bcNumber: i+1,
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            
        })

        target.appendChild(newEl);
        //`<div class="grid-item">1</div>`

    }
}
