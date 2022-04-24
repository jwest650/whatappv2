import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyClvJUMqJ5H1VXic04cCBVEp1GhbsA61W4",
    authDomain: "whatsapp-e0fc5.firebaseapp.com",
    projectId: "whatsapp-e0fc5",
    storageBucket: "whatsapp-e0fc5.appspot.com",
    messagingSenderId: "855683652264",
    appId: "1:855683652264:web:648149c98440e86718809d",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
export { db, auth, provider };
