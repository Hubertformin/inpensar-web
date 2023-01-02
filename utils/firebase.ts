// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {Auth, getAuth} from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAnvZObrPUafTyKuioi8cxcE1Niu4j7YIw",
    authDomain: "inpensar-enchird.firebaseapp.com",
    projectId: "inpensar-enchird",
    storageBucket: "inpensar-enchird.appspot.com",
    messagingSenderId: "353691467171",
    appId: "1:353691467171:web:c74645c89cfa5d9b56ee16",
    measurementId: "G-WVXMTV6P5H"
};

// Initialize Firebase
let app , analytics, fireAuth: Auth;
if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    fireAuth = getAuth(app);
}
export {
    analytics,
    fireAuth
}