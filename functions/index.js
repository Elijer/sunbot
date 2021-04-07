const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
const accountSid = functions.config().twilio.token;


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/* exports.test = functions.https.onCall (async(data, context) => {
    console.log("yoyoyoyo");
    return true;
}); */

exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {

/*         const docId = event.params.entryId;

        const data = event.data.data().name; */

        console.log("heyo")

        return true;

    });