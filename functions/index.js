const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();

const twilio = require('twilio');
const accountSid = functions.config().twilio.sid;
//const accountSid = functions.config().twilio.token;


// Test function that runs whenever entries are updated. Can be used to test twilio.
exports.test = functions.firestore
    .document('entries/{entryId}')
    .onUpdate(event => {
        console.log("heyo stevie")
        return true;
    });