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
import { getAnalytics } from "firebase/analytics";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Ensure 'export const db' is present:
export const db = getFirestore(app);
export const auth = getAuth(app);
