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
const myNumber = "‪+15713024423‬";
const katieNumber = "+16184313089";

//birth control reminder
// Haven't deployed this one yet
exports.morning = functions.pubsub.schedule('30 8 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const msg = 'Moonbot: 🌞 Good morning Katie! This is a quick reminder for you take your birth control if you haven\'t already. You can log which pill you took today here: https://ktperiodtracker.web.app/';

    sendText(msg, katieNumber);

});

// Morning, afternoon and evening functions
exports.morning = functions.pubsub.schedule('5 10 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const msg = 'Moonbot: 🌞 Good morning Katie! Hope your day is off to a good start. It\'s time for you to log your mood.. Url: https://ktperiodtracker.web.app/';

    const msg2 = 'Moonbot: Yo! Good job already submitting your energy level this morning. You are ahead of the game.';

    // send Message
    checkEnergy('morning', sendText(msg, katieNumber), sendText(msg2, katieNumber))
    .catch(e => { console.error(e); process.exit(-1); })

});

exports.afternoon = functions.pubsub.schedule('5 16 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const msg = 'Moonbot: 🌳 Why it appears the sun is high in the sky. Time for you to log your afternoon energy madame. Url: https://ktperiodtracker.web.app/';
    const msg2 = 'Moonbot: Hey! You beat me to it and submitted your afternoon energy level before I could remind you.'
    // send Message
    checkEnergy('afternoon', sendText(msg, katieNumber), sendText(msg2, katieNumber))
    .catch(e => { console.error(e); process.exit(-1); })

});

exports.evening = functions.pubsub.schedule('36 21 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const msg = 'Moonbot: Night is falling like a soft blanket on the world 🌙. Time for you to log your evening energy, as well as any other fields you missed or should update. Hope your day was magical 💛 . Url: https://ktperiodtracker.web.app/';

    const msg2 = 'Moonbot: Looks like you already submitted your night energy level. Well done. Sleep well.'

            // send Message
    checkEnergy('evening', sendText(msg, katieNumber), sendText(msg2, katieNumber))
    .catch(e => { console.error(e); process.exit(-1); })

});


// async function that checks to see if energy field has been filled out in a certain time of day
/* var checkEnergy = async function (timeOfDay, callback, callback2){

    var entriesRef = admin.firestore().collection('entries');
    const today = await entriesRef.orderBy('createdAt', 'desc').limit(1).get();

    if (today.empty){
        console.log('today.empty');
        // do nothing
    } else {
        // there is a doc
        today.forEach(doc => {

            const id = doc.id;
            const data = doc.data();

            if (!data['energy' + timeOfDay]){
                console.log('there was an energy field')

                //callback();

            } else {
                console.log('there was no energy field')
                //callback2();
            }

          });
    }
} */

var sendText = function(msg, recipient){
    const textMessage = {
        body: msg,
        //to: recipient,
        to: myNumber,
        from: twilioNumber
    }
    
    client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success', textMessage))
    .catch(err => console.log(err))

}

/* var checkEnergy = function(t){

    var answer = false
    var theDate = moment().tz('America/New_York').format('L');
    var fsDate = theDate.replace(/\//g, "-");
    var entriesRef = admin.firestore().collection('entries').doc(fsDate);

    const promise = entriesRef.get();
    promise.then(snapshot => {
        const data = snapshot.data()
        response.send(data);
    })

    const promise2 = promise.then()

    entriesRef.get()
    .then((doc) => {

        if (doc.exists) {
            var data = doc.data();
            console.log(data);
            if (data['energy' + t]){
                answer = true;
            }
        }

        return answer;

    });
} */


// Test function that runs whenever entries are updated. Can be used to test twilio.
/* exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

        console.log(checkEnergy('evening'));


        return true
    }); */