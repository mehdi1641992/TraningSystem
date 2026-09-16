// 1. Go to https://console.firebase.google.com, create a free project
//    (the free "Spark" plan is enough for this app).
// 2. In the project, click the </> (web app) icon to register a web app —
//    you don't need Hosting, just the config object it gives you.
// 3. Paste that config object below, replacing the placeholder values.
// 4. In the Firebase console, go to Build > Firestore Database > Create
//    database, start in "production mode", pick any region.
// 5. Go to Firestore > Rules and paste the rules from firestore.rules in
//    this folder, then click Publish.
// 6. Enable Authentication > Sign-in method > Google, and add your
//    deployed domain (e.g. <username>.github.io) under Authorized domains.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace the placeholder values below with the real config object
// from your own Firebase project (Project settings > Your apps > SDK setup).
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // optional — safe to delete this line
};

// Keep the login page and static demos usable before Firebase is configured.
// Analytics is optional and deliberately not initialized for previews.
export const isFirebaseConfigured = ['apiKey', 'authDomain', 'projectId', 'appId']
  .every(key => firebaseConfig[key] && !firebaseConfig[key].includes('YOUR_'));
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
