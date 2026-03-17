import { createContext, useContext, useState } from 'react';

// Створюємо контекст
const WorkoutContext = createContext();

// Провайдер — огортає весь додаток
export function WorkoutProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addToHistory = (workout) => {
    const now = new Date();
    const record = {
      id: Date.now(),
      workoutId: workout.id,
      title: workout.title,
      type: workout.type,
      calories: workout.calories,
      time: workout.time,
      // Дата і час виконання
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
    setHistory(prev => [record, ...prev]);
  };

  return (
    <WorkoutContext.Provider value={{ history, addToHistory }}>
      {children}
    </WorkoutContext.Provider>
  );
}

// Хук для зручного використання
export function useWorkoutHistory() {
  return useContext(WorkoutContext);
}