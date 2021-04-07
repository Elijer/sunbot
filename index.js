import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

import { firebaseConfig } from "./helpers/firebaseConfig";
import { handleEmulators } from "./helpers/handleEmulators";
import { firestoreTest } from "./helpers/firestoreTest";
import { gg, set } from "./helpers/utility";
import moment from 'moment';


document.addEventListener("DOMContentLoaded", event => {
    
    // Firebase stuff
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
    handleEmulators(db);
    firestoreTest(db);

        // test HTTPs function
/*         var findNewGame = firebase.functions().httpsCallable('fn');
        findNewGame({whatever: "this doesn't matter"}) */

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
            var data = doc.data();

            if (data.outside){
                setOutside(data.outside);
            }

            if (data.cryTally){
                setCry(data.cryTally);
            }

            if (data.bcNumber){
                state.bcNumber = data.bcNumber
            }

            if (data['energy'+state.timeOfDay]){
                gg("energyOptions").style.display = "none";
                gg("energyHeader").innerHTML = "⚡️ Nice!"
                gg("energyNote").style.display = "inline"
                gg("energyNote").innerHTML = `You already logged your ${state.timeOfDay} energy.`
                console.log("already done");
            }


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

    outsideOptions.forEach(function(e){
        e.addEventListener("click", function(){
            var went;
            if (e.id === "outsideYes"){
                went = true;
            } else {
                went = false;
            }

            setOutside(went);
    
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

            gg("cryNumber").style.background = "#6e5cc8";

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
    
            e.style.background = "#6e5cc8";
            
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

    if (m.isBefore(middayEnd) && m.isAfter(morningEnd)){
        timeOfDay = "midday"
        //midday
    } else if (m.isBefore(morningEnd) && m.isAfter(morningStart)){
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

    console.log(state);

    var target = gg("bcGrid");
    for (var i = 1; i < 29; i ++){

        var newEl =  document.createElement('div')
        newEl.classList.add("grid-item");
        newEl.id = `grid-item-${i}`;
        newEl.innerHTML = i;

        newEl.addEventListener("click", function(e){

            for (var j = 1; j < 29; j ++){
                gg(`grid-item-${j}`).style.background = "#e8e8e8";
            }

            e.path[0].style.background = "#6e5cc8";
            
            state.entryRef.set({
                bcNumber: e.path[0].innerHTML,
            }, {merge: true})
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

    if(state.bcNumber){
        gg(`grid-item-${state.bcNumber}`).style.background = "#6e5cc8";
    }
}

var setOutside = function(o){
    var options = [gg("outsideYes"), gg("outsideNo")];

    if (o === true){
        options[0].style.background = "#6e5cc8";
        options[1].style.background = "#e8e8e8";
    } else {
        options[1].style.background = "#6e5cc8";
        options[0].style.background = "#e8e8e8";
    }

}

var setCry = function(c){
    var cryNumber = gg("cryNumber")
    cryNumber.style.background = "#6e5cc8";
    cryNumber.innerHTML = c;
}