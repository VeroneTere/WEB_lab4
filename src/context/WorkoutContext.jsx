import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase'; //
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext'; //

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const [history, setHistory] = useState([]);
  const { user } = useAuth(); // Отримуємо поточного користувача

  // 1. Завантажуємо історію з Firebase при вході користувача
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }

      try {
        const q = query(
          collection(db, 'history'),
          where('userId', '==', user.uid), // Фільтруємо лише для поточного користувача
          orderBy('createdAt', 'desc') // Найновіші зверху
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHistory(data);
      } catch (err) {
        console.error("Помилка завантаження історії:", err);
      }
    };

    fetchHistory();
  }, [user]);

  // 2. Функція додавання тренування в базу
  const addToHistory = async (workout) => {
    if (!user) return;

    const now = new Date();
    const record = {
      userId: user.uid, // Прив'язка до аккаунту
      workoutId: workout.id,
      title: workout.title,
      type: workout.type,
      calories: workout.calories,
      time: workout.time,
      createdAt: now.toISOString(), // Поле для сортування
      completedAt: now.toLocaleString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      completedDate: now.toLocaleDateString('uk-UA', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      completedTime: now.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    try {
      // Записуємо в Firestore
      const docRef = await addDoc(collection(db, 'history'), record);
      
      // Оновлюємо локальний стейт, щоб зміни відобразилися миттєво
      setHistory(prev => [{ ...record, id: docRef.id }, ...prev]);
    } catch (err) {
      console.error("Помилка збереження тренування:", err);
      alert("Не вдалося зберегти тренування в базі.");
    }
  };

  return (
    <WorkoutContext.Provider value={{ history, addToHistory }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutHistory() {
  return useContext(WorkoutContext);
}