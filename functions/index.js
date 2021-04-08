const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+14159695584"
const myNumber = "‪+15713024423‬";
const katieNumber = "+16184313089";

// Morning, afternoon and evening functions
exports.morning = functions.pubsub.schedule('5 10 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const msg = 'Moonbot: 🌞 Good morning Katie! It\'s time for you to log your mood. Hope you\'re day is off to a good start 💛 . Url: https://ktperiodtracker.web.app/';

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
async function checkEnergy(timeOfDay, callback, callback2){

    var answer = false;
    var entriesRef = admin.firestore().collection('entries');
    const today = await entriesRef.orderBy('createdAt', 'desc').limit(1).get();

    if (today.empty){
        // do nothing
    } else {
        // there is a doc
        today.forEach(doc => {

            const id = doc.id;
            const data = doc.data();

            if (!data['energy' + timeOfDay]){

                callback();

            } else {
                callback2();
            }

          });
    }
}

var sendText = function(msg, recipient){
    const textMessage = {
        body: msg,
        to: myNumber,
        from: twilioNumber
    }

    client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))
}

// Test function that runs whenever entries are updated. Can be used to test twilio.
/* exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

        var msg = 'Moonbot: ☀️☀️☀️ Good morning Katie! It\'s time for you to log your mood. Hope your day is off to a good start 💛';

        checkEnergy('evening', function(){
            sendText(msg, myNumber)
        })
        .catch(e => { console.error(e); process.exit(-1); })

        return true
    }); */

// Draft Cron Function
/* exports.scheduledFunctionCrontab = functions.pubsub.schedule('6 8 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const textMessage = {
        body: 'Moonbot: ☀️☀️☀️ Good morning Katie! It\'s time for you to log your mood. Hope you\'re day is off to a good start 💛',
        to: myNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

}); */