// Initialize the SDK
const admin = require("firebase-admin");

console.log(`Set user ${process.argv[2]} role to admin`);

// from external machine
// const serviceAccount = require('path/to/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
// })

// use from within Google Cloud Platform
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://firestone-1.firebaseio.com"
});

admin
  .auth()
  .setCustomUserClaims(process.argv[2], { admin: true })
  .then(() => {
    console.log(`user ${process.argv[2]} set to admin successfully`);
    // The new custom claims will propagate to the user's ID token the
    // next time a new one is issued.
  })
  .catch(err => {
    console.error(err.message);
  });
