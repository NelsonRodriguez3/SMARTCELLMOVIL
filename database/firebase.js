import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdUes6uk-bY_g68cHzEp3hZa0vejN_QFY",
    authDomain: "dbsmartcell-e2894.firebaseapp.com",
    projectId: "dbsmartcell-e2894",
    storageBucket: "dbsmartcell-e2894.appspot.com",
    messagingSenderId: "386689613420",
    appId: "1:386689613420:web:f45d86f8dbc0ac70976249",
    measurementId: "G-7X00LJRLNL"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Exporta db directamente
export {auth, db };
