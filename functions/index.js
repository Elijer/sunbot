const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const moment = require('moment-timezone');

const twilio = require('twilio');
const { response } = require("express");
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+14159695584"
const elijah = "‪+15713024423‬";
const katie = "+16184313089";

var affirmations = [
    'You\'re the bee\'s knees. 🐝 Cause you\'re sweet I guess? Since bees collect pollen on their knees? Although, pollen isn\'t sweet, that\'s honey. Idk.',
    'When things get hard, I just like to remember that nobody really knows what their doing.',
    'You have a beautiful singing voice and I hope you know it.',
    'You is smart, you is kind, you is important. Great movie.',
    'Do you ever wish you were a bird? That\'s pretty reckless though. Nobody has any idea how bad bird problems can be.',
    'I hear babies cry, I watch them grow, They\'ll learn much more, Than I\'ll never know, And I think to myself, What a wonderful world'
]


// Morning, afternoon and evening functions
exports.morning = functions.pubsub.schedule('30 8 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const reminder = 'Moonbot: 🌞 Good morning Katie! Hope your day is off to a good start. Just wanted to remind you to take your birth control and start logging. https://ktperiodtracker.web.app/';

    const congrats = 'Moonbot: Yo! Good job already submitting your energy level this morning. You are ahead of the GAME. 🔥';
    
    standardReminder('morning', reminder, congrats);

    return true;


});

exports.afternoon = functions.pubsub.schedule('5 14 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const reminder = 'Moonbot: 🌳 Why, it appears the sun is high in the sky. Time for you to log your afternoon energy senorita. https://ktperiodtracker.web.app/';
    const congrats = 'Moonbot: Hey! You beat me to it and submitted your afternoon energy level before I could remind you. Good work. Have a cat 🐈'

    standardReminder('afternoon', reminder, congrats);

    return true;

});

exports.evening = functions.pubsub.schedule('36 21 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const reminder = 'Moonbot: Night is falling like a soft blanket on the world 🌙 Time for you to log your evening energy, as well as any other fields you missed or want to update. Hope your day had some magic in it 💛  https://ktperiodtracker.web.app/';
    const congrats = 'Moonbot: Looks like you already submitted your evening energy level. Well done. Sleep well bambina ✨'

    standardReminder('evening', reminder, congrats);

    return true;

});


// Draft for a standard function, since all of these are mostly the same.
var standardReminder = function(time, reminder, congrats){
    checkEnergy(time).then(energyLevelLogged => {
        if (energyLevelLogged){

            sendText(congrats, katie);

        } else if (!energyLevelLogged){

            sendText(reminder, katie);

        }
    })
}



////// Helper Functions
var sendText = function(msg, recipient){
    const textMessage = {
        body: msg,
        to: recipient,
        from: twilioNumber
    }
    
    client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success', textMessage))
    .catch(err => console.log(err))

}


var checkEnergy = function(timeOfDay){

    // returns a promise with the data of whether the specified energy time of day field has been filled out.
    var answer = false
    var theDate = moment().tz('America/New_York').format('L');
    var fsDate = theDate.replace(/\//g, "-");
    var entriesRef = admin.firestore().collection('entries').doc(fsDate);
    

    const promise = entriesRef.get().then(function(e){

        const data = e.data();
        const field = 'energy'+timeOfDay;
        var answer = false;

        if (data){
            if (data[field]){
                answer = true;
            }
        }
        return answer
    });
    
    return promise

    /* Implementation:
        checkEnergy('evening').then(e => {
            console.log(e);
        })
    */
}


// Test function that runs whenever entries are updated. Can be used to test twilio.
/* exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

        checkEnergy('evening').then(e => {
            console.log(e);
        })

        return true
    }); */