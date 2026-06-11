// =====================================================================
// SPOTLIGHT EVENTS — Configuración de Firebase (Real)
// =====================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDfwVy4ICMmSQxE114-GpQELX75GHPvxVU",
    authDomain: "spotlight-events-b3bcd.firebaseapp.com",
    projectId: "spotlight-events-b3bcd",
    storageBucket: "spotlight-events-b3bcd.firebasestorage.app",
    messagingSenderId: "560948834084",
    appId: "1:560948834084:web:94dfd23fd7672b26ca0db1",
    measurementId: "G-S61RZCZFB4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cambiamos a FALSE porque ya tenemos Firebase real conectado
const MOCK_MODE = false;

export { app, auth, db, MOCK_MODE };
