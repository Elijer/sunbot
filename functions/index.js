const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const moment = require('moment');

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

    const textMessage = {
        body: 'Moonbot: 🌞 Good morning Katie! It\'s time for you to log your mood. Hope you\'re day is off to a good start 💛 . Url: https://ktperiodtracker.web.app/',
        to: katieNumber,
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
        body: 'Moonbot: 🌳 Why it appears the sun is high in the sky. Time for you to log your afternoon energy madame. Url: https://ktperiodtracker.web.app/',
        to: katieNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

});

exports.evening = functions.pubsub.schedule('36 21 * * *')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun((context) => {

    const textMessage = {
        body: 'Moonbot: Night is falling like a soft blanket on the world 🌙. Time for you to log your evening energy, as well as any other fields you missed or should update. Hope your day was magical 💛 . Url: https://ktperiodtracker.web.app/',
        to: katieNumber,
        from: twilioNumber
    }

    return client.messages.create(textMessage)
    .then(message => console.log(message.sid, 'success'))
    .catch(err => console.log(err))

});

// Test function that runs whenever entries are updated. Can be used to test twilio.
exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

        var theMoment = moment();
        var fsDate = theMoment.format('L').replace(/\//g, "-");
        var docRef = admin.firestore().collection('entries').doc(fsDate)
    
        docRef.get().then(function(doc){
            data = doc.data();

            if (data.morningenergy){
                console.log("no morning energy")
            } else {
                console.log("some morning energy");
            }
            
        })

        const textMessage = {
            body: 'Moonbot: ☀️☀️☀️ Good morning Katie! It\'s time for you to log your mood. Hope you\'re day is off to a good start 💛 (Cutoff for logging morning energy is 11:59)',
            to: myNumber,
            from: twilioNumber
        }
    
        return client.messages.create(textMessage)
        .then(message => console.log(message.sid, 'success'))
        .catch(err => console.log(err))
    });

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