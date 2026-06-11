// =====================================================================
// SPOTLIGHT EVENTS — Servicio de Autenticación
// =====================================================================
import { auth, MOCK_MODE } from '../config/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

export async function iniciarSesion(email, pass) {
    if (MOCK_MODE) {
        // ... modo mock
        return { success: false, error: 'MOCK' };
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        
        // BLOQUEO: Validar si verificó el correo
        if (!user.emailVerified) {
            await signOut(auth);
            return { success: false, error: 'Debes verificar tu correo electrónico antes de poder entrar. Revisa tu bandeja de entrada o SPAM.' };
        }
        
        // Simular rol basado en el email para esta versión (idealmente se guarda en Firestore)
        let rol = 'cliente';
        if (email.includes('admin')) rol = 'admin';
        if (email.includes('host') || email.includes('salon')) rol = 'host';
        
        const userData = { email: user.email, uid: user.uid, rol: rol, nombre: user.email.split('@')[0] };
        localStorage.setItem('spotlight_user', JSON.stringify(userData));
        return { success: true, user: userData };
    } catch (error) {
        let msg = 'Error al iniciar sesión';
        if (error.code === 'auth/invalid-credential') msg = 'Correo o contraseña incorrectos';
        return { success: false, error: msg };
    }
}

export async function registrarUsuario(nombre, email, pass) {
    if (MOCK_MODE) {
        return { success: false, error: 'MOCK' };
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        
        // Enviar correo de confirmación
        await sendEmailVerification(user);
        
        // Cerrar sesión inmediatamente para obligarlo a verificar
        await signOut(auth);
        
        return { success: true, message: '¡Registro exitoso! Te hemos enviado un enlace de confirmación a tu correo. Debes hacer clic en él para poder iniciar sesión.' };
    } catch (error) {
        let msg = 'Error al registrar';
        if (error.code === 'auth/email-already-in-use') msg = 'El correo ya está en uso';
        if (error.code === 'auth/weak-password') msg = 'La contraseña debe tener al menos 6 caracteres';
        return { success: false, error: msg };
    }
}

export async function cerrarSesion() {
    if (!MOCK_MODE) {
        await signOut(auth);
    }
    localStorage.removeItem('spotlight_user');
    window.location.href = '../index.html';
}

export function getUsuarioActual() {
    return JSON.parse(localStorage.getItem('spotlight_user'));
}

export async function recuperarContrasena(email) {
    if (!email) return { success: false, error: 'Ingresa tu correo electrónico.' };
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: `Correo de recuperación enviado a ${email}. Revisa tu bandeja de entrada y SPAM.` };
    } catch (error) {
        let msg = 'Error al enviar el correo';
        if (error.code === 'auth/user-not-found') msg = 'No existe cuenta con ese correo.';
        if (error.code === 'auth/invalid-email') msg = 'El correo no es válido.';
        return { success: false, error: msg };
    }
}

export async function cambiarContrasena(passActual, passNueva) {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return { success: false, error: 'No hay sesión activa.' };
    try {
        const credential = EmailAuthProvider.credential(firebaseUser.email, passActual);
        await reauthenticateWithCredential(firebaseUser, credential);
        await updatePassword(firebaseUser, passNueva);
        return { success: true, message: '¡Contraseña actualizada exitosamente!' };
    } catch (error) {
        let msg = 'Error al cambiar la contraseña';
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') msg = 'La contraseña actual es incorrecta.';
        if (error.code === 'auth/weak-password') msg = 'La nueva contraseña debe tener al menos 6 caracteres.';
        return { success: false, error: msg };
    }
}
