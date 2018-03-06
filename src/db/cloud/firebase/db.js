const firebaseAdmin = require('firebase-admin');
const firebaseConfig = require('../../../config/db/firebase');

module.exports = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig.admin),
  databaseURL: firebaseConfig.admin.databaseURL,
});
