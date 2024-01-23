import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId:import.meta.env.VITE_MEASUREMENT_ID,
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db=getFirestore(app)
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({   
    prompt : "select_account "
});
export default app;
export {googleAuthProvider};
