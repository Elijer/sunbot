export function firestoreTest(db){
    var citiesRef = db.collection("firestore-collection");
    citiesRef.doc("firestore-document").set({
        name: "Some document", state: "VA", country: "USA?",
        capital: false,
        ridesBicycles: "sure",
        regions: ["west_coast", "norcal"]
    });
}