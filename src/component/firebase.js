import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDvgIfrOR-44vlThBRklamJ1s6r5lvgQsM",
    authDomain: "savradav.firebaseapp.com",
    projectId: "savradav",
    storageBucket: "savradav.appspot.com",
    messagingSenderId: "579019920243",
    appId: "1:579019920243:web:1247c1c66b8548605fab06",
    measurementId: "G-DCZP8V3WTG",
};

// Initialize the Firebase application with the provided configuration object.
// This sets up Firebase services such as authentication, Firestore, and storage for use in the app.
// Firebase authentication instance for managing user authentication
export const auth = getAuth(app);

// Firebase Firestore instance for database operations
export const db = getFirestore(app);
// Firebase Storage instance for file storage operations
export const storage = getStorage(app);
