import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBrp6OAQ_P2mxuLdpxYErTUEFcUjO6QoKo",
    authDomain: "partyzone-6fd81.firebaseapp.com",
    projectId: "partyzone-6fd81",
    storageBucket: "partyzone-6fd81.appspot.com",
    messagingSenderId: "645239655569",
    appId: "1:645239655569:web:f1ff219292be340dc48330"
})

//export const db = firebase.getFirestore();
export const auth = app.auth()
export default app