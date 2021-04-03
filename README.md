# Parcel.js
To start, run the following command: `parcel index.html`. Make sure that an `index.js` is linked in the index.html and that file will be used as an entry point for all js files. Parcel allows you to use ES6 module syntax or a bunch of other stuff including SCSS, which it just accepts automatically. All you need to do is name a file SCSS and it will pase it for you.

# Firebase
Firebase is a google suite that essentially aids in fast development by bundling a bunch of (relatively) easy to use tools together, like hosting, local testing, a choice of 2 databases, storage, etc. Nice to have it all in one place. In order to use this project, you actually need to do the following:
* Have or make a project on [firebase](http://console.firebase.google.com/)
* Activate firestore on that project (just go to the firestore tab on the left sidebar)
* Press the gear next to `Project Overview` on the top left > project settings, scroll down, and copy that firebaseConfig var. Paste it into helpers/firebaseConfig.js. You're now hooked up to the firestore database on your own firebase project

# Firebase Modules
It's possible to load Firebase using script tags, and this is how I started out using it. In some ways it is easier. However, in this project, I am loading `firebase` and `firebase/firestore` using NPM modules.

* [Firebase](https://www.npmjs.com/package/firebase)
* [Firebase/Firestore](https://www.npmjs.com/package/@firebase/firestore)

# Firebase Emulators
The Firebase Commandline Tools (CLI) can be installed here: [firebase-tools](https://www.npmjs.com/package/firebase-tools). The Firebase CLI can do a bunch of different things, mostly focused on getting your project started more quickly, but for this starter kit I am only using the firestore emulator. Firestore is a database in the firebase suite, and the firebase emulator allows you to use firestore locally. However, a special snippet of code (unfortunately) must be including in your project in order for firebase to know it should be talking to the local, emulated database, and NOT the production version on the cloud. This snippet is located in `helpers/handleEmulators.js` in the form of an importable function. Basically what it does is check to see if the site is hosted locally as a test, and if so it points it to the emulators.

# Summary
Run `npm test` and `npm run ems`, and then go to `localhost:1234` (or whatever port Parcel.js prints in the console in the event that 1234 is being used already). You should see your project there! Now go to `localhost:4000` and press on `Firestore emulator`. You should see a collection and a document in there.

I didn't install the firebase hosting functionality from the CLI, so if you want to deploy this, you will need to run `firebase init` and select the `hosting` line using spacebar. If you decide to do that and test it for production, then you can just run `firebase deploy` and it will host it live online for you to see what that looks like. You can then head to `http://console.firebase.google.com/` to check out the production database.# ktperiodtracker
