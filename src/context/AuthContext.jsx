// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // loading = true поки Firebase перевіряє чи є збережена сесія
  const [loading, setLoading] = useState(true);

  // Реєстрація нового користувача
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Вхід існуючого користувача
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Вихід
  const logout = () => {
    return signOut(auth);
  };

  // Слідкуємо за станом авторизації
  // Це спрацьовує коли: користувач увійшов, вийшов,
  // або при першому завантаженні сторінки (перевіряє cookies)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Відписуємось при розмонтуванні компонента
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {/* Не рендеримо дітей поки Firebase не перевірив сесію */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}