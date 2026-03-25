import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useAuth } from './AuthContext'; 

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }
      try {
        const q = query(
          collection(db, 'history'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
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

  const addToHistory = async (workout) => {
    if (!user) return;
    const now = new Date();
    const record = {
      userId: user.uid,
      workoutId: workout.id,
      title: workout.title,
      type: workout.type,
      calories: workout.calories,
      time: workout.time,
      createdAt: now.toISOString(),
      completedDate: now.toLocaleDateString('uk-UA', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }),
      completedTime: now.toLocaleTimeString('uk-UA', {
        hour: '2-digit', minute: '2-digit'
      })
    };

    try {
      const docRef = await addDoc(collection(db, 'history'), record);
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