// =====================================================================
// SPOTLIGHT EVENTS — Servicio de Base de Datos (Espacios y Transacciones)
// =====================================================================
import { db, MOCK_MODE } from '../config/firebase.js';
import { collection, getDocs, addDoc, doc, setDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Carga inicial de datos desde data.js si no hay nada
export async function obtenerTodosLosEspacios() {
    if (MOCK_MODE) {
        return window.ESPACIOS_SPOTLIGHT || [];
    }
    try {
        const querySnapshot = await getDocs(collection(db, "espacios"));
        const espacios = [];
        querySnapshot.forEach((doc) => {
            espacios.push({ id: doc.id, ...doc.data() });
        });
        
        // Guardar en caché para carga instantánea
        if (espacios.length > 0) {
            localStorage.setItem('spotlight_cache_espacios', JSON.stringify(espacios));
        }

        // Si Firestore está vacío, subimos los datos de prueba de data.js automáticamente (solo una vez)
        if (espacios.length === 0 && window.ESPACIOS_SPOTLIGHT) {
            console.log("Subiendo datos iniciales a Firestore...");
            for (const esp of window.ESPACIOS_SPOTLIGHT) {
                await setDoc(doc(db, "espacios", esp.id), esp);
                espacios.push(esp);
            }
            localStorage.setItem('spotlight_cache_espacios', JSON.stringify(espacios));
        }
        return espacios;
    } catch (e) {
        console.error("Error obteniendo espacios: ", e);
        return window.ESPACIOS_SPOTLIGHT || []; // Fallback
    }
}

export function obtenerEspaciosCacheados() {
    return JSON.parse(localStorage.getItem('spotlight_cache_espacios') || 'null');
}

export async function publicarNuevoEspacio(espacio) {
    if (MOCK_MODE) {
        return { success: true, id: 'mock-id' };
    }
    try {
        const docRef = await addDoc(collection(db, "espacios"), espacio);
        localStorage.removeItem('spotlight_cache_espacios'); // Invalidar caché
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error publicando espacio: ", e);
        return { success: false, error: e.message };
    }
}

export async function obtenerEspaciosPorAnfitrion(uid) {
    if (MOCK_MODE) return [];
    try {
        const q = query(collection(db, "espacios"), where("hostUid", "==", uid));
        const querySnapshot = await getDocs(q);
        const espacios = [];
        querySnapshot.forEach((doc) => espacios.push({ id: doc.id, ...doc.data() }));
        return espacios;
    } catch (e) {
        console.error("Error obteniendo espacios del host: ", e);
        return [];
    }
}

export async function guardarTransaccion(tx) {
    if (MOCK_MODE) return { success: true };
    try {
        await addDoc(collection(db, "transacciones"), tx);
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function obtenerTransacciones() {
    if (MOCK_MODE) return [];
    try {
        const querySnapshot = await getDocs(collection(db, "transacciones"));
        const txs = [];
        querySnapshot.forEach((doc) => txs.push({ id: doc.id, ...doc.data() }));
        return txs;
    } catch (e) {
        return [];
    }
}
