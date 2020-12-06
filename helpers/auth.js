export function signIn(firebase){

    //onChange();

    firebase.auth().signInAnonymously()
    .then(() => {
        console.log("signed in");
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    })
}

/* function onChange(){
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var uid = user.uid;
          console.log(uid);
        } else {
            console.log("User signed out");
        }
      });
} */