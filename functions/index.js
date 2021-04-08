const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = "+14159695584"
const myNumber = "‪+15713024423‬";

exports.scheduledFunctionCrontab = functions.pubsub.schedule('6 8 * * *')
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

});

exports.morning = functions.pubsub.schedule('5 10 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const textMessage = {
        body: 'Moonbot: ☀️☀️☀️ Good morning Katie! It\'s time for you to log your mood. Hope you\'re day is off to a good start 💛 (Cutoff for logging morning energy is 11:59)',
        to: myNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

});

exports.afternoon = functions.pubsub.schedule('5 16 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const textMessage = {
        body: 'Moonbot: 🌳 Why it appears the sun is high in the sky. Time for you to log your afternoon energy madame. (Cutoff for logging afternoon energy is 5:59)',
        to: myNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

});

exports.evening = functions.pubsub.schedule('5 20 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const textMessage = {
        body: 'Moonbot: Night is falling like a soft blanket on the world 🌙. Time for you to log your evening energy, as well as any other fields you missed or should update. Hope your day was magical 💛 . (Cutoff for evening energy: 2am)',
        to: myNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

});




/* function validE164(num){
    return /^\+?[1-9]\d{1,14}$/.test(num)
} */


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/* exports.test = functions.https.onCall (async(data, context) => {
    console.log("yoyoyoyo");
    return true;
}); */

/* exports.scheduledFunction = functions.pubsub.schedule('every 1 minutes').onRun((context) => {
    console.log('This will be run every 5 minutes!');
    return null;
  }); */


/* exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

        const textMessage = {
            body: 'Hey dere dis me',
            to: myNumber,
            from: twilioNumber
        }


        console.log("heyo")

        return client.messages.create(textMessage)
        .then(message => console.log(message.sid, 'success'))
        .catch(err => console.log(err))

    }); */