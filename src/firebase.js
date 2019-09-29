const firebase = require("firebase/app");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: 'AIzaSyC2fcIeThle-DQGJB6Pq5jjrjhMQm9CEl4',
  authDomain: 'nonograms-44146.firebaseapp.com',
  projectId: 'nonograms-44146'
});

const db = firebase.firestore();

export default db;