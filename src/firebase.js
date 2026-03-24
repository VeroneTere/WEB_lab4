import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Заміни ці значення на свої з Firebase Console!
const firebaseConfig = {
  apiKey: "AIzaSyAuO6xULyV3aP6W-YHPltf8BBzDUH4oNm4",
  authDomain: "fitness-tracker-96bbe.firebaseapp.com",
  projectId: "fitness-tracker-96bbe",
  storageBucket: "fitness-tracker-96bbe.firebasestorage.app",
  messagingSenderId: "502053817465",
  appId: "1:502053817465:web:f3d4f2e929fce6b67958a8"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експортуємо auth та db для використання в інших файлах
export const auth = getAuth(app);
export const db = getFirestore(app);