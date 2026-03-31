import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; 

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
  const [history, setHistory] = useState([]);
  const { user } = useAuth();

  // 1. ЗАВАНТАЖЕННЯ ІСТОРІЇ (GET)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) {
        setHistory([]);
        return;
      }
      try {
        // Викликаємо наш API
        const response = await fetch("http://localhost:5000/api/history");
        if (!response.ok) throw new Error("Помилка сервера");
        
        const data = await response.json();
        
        // Фільтруємо за поточним користувачем та сортуємо (свіжі зверху)
        const userHistory = data
          .filter(item => item.userId === user.uid)
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          
        setHistory(userHistory);
      } catch (err) {
        console.error("Помилка завантаження історії:", err);
      }
    };
    
    fetchHistory();
  }, [user]);

  // 2. ЗБЕРЕЖЕННЯ ТРЕНУВАННЯ (POST)
  const addToHistory = async (workout) => {
    // Якщо користувач не залогінений, нічого не робимо
    if (!user) {
      console.error("Користувач не авторизований");
      return;
    }
    
    const now = new Date();
    
    // Формуємо об'єкт строго за структурою, яку очікує база
    const record = {
      userId: user.uid, // Прив'язка до аккаунту
      workoutId: workout.id || workout.workoutId || String(Date.now()),
      title: workout.title || "Тренування",
      type: workout.type || "Інше",
      calories: Number(workout.calories) || 0, // Перетворюємо на число
      time: Number(workout.time) || 0,         // Перетворюємо на число
      createdAt: now.toISOString(),
      completedDate: now.toLocaleDateString('uk-UA'),
      completedTime: now.toLocaleTimeString('uk-UA', {
        hour: '2-digit', minute: '2-digit'
      })
    };

    try {
      console.log("Відправка даних на сервер:", record);

      const response = await fetch("http://localhost:5000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Оновлюємо локальний стан, щоб дані з'явилися миттєво без перезавантаження
        const newRecordWithId = { ...record, id: responseData.id };
        setHistory(prev => [newRecordWithId, ...prev]);
        return true; 
      } else {
        console.error("Сервер повернув помилку:", responseData.error);
        throw new Error(responseData.error || "Помилка сервера");
      }
    } catch (err) {
      console.error("Помилка запиту POST:", err);
      alert("Не вдалося зберегти тренування. Перевір, чи запущено сервер Node.js!");
      throw err;
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