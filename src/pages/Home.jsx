// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import WorkoutCard from '../components/WorkoutCard';

const TYPES = ['Всі', 'Кардіо', 'Силові', 'Йога', 'Розтяжка'];

function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeType, setActiveType] = useState('Всі');

  // Завантажуємо тренування з Firestore при першому рендері
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'workouts'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorkouts(data);
      } catch (err) {
        setError('Помилка завантаження тренувань: ' + err.message);
      }
      setLoading(false);
    };

    fetchWorkouts();
  }, []);

  const filtered = activeType === 'Всі'
    ? workouts
    : workouts.filter(w => w.type === activeType);

  // Стан завантаження
  if (loading) {
    return (
      <div style={s.center}>
        <div style={s.spinner}></div>
        <p style={{ color: '#9575cd', marginTop: '15px', fontSize: '1rem' }}>
          Завантаження тренувань...
        </p>
      </div>
    );
  }

  // Помилка
  if (error) {
    return (
      <div style={s.center}>
        <p style={{ color: '#c62828', fontSize: '1rem' }}>❌ {error}</p>
      </div>
    );
  }

  return (
    <section style={{ padding: '40px 5%' }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Відео-тренування
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Дані завантажені з хмарної бази даних Firebase 🔥
        </p>
      </div>

      {/* Фільтри */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '25px' }}>
        {TYPES.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            style={{
              padding: '10px 24px',
              border: '2px solid #4a148c',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: '0.25s',
              backgroundColor: activeType === type ? '#4a148c' : 'transparent',
              color: activeType === type ? 'white' : '#4a148c'
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px', fontSize: '0.9rem' }}>
        Показано: <strong style={{ color: '#4a148c' }}>{filtered.length}</strong> з {workouts.length}
      </p>

      {/* Картки */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {filtered.map(w => <WorkoutCard key={w.id} workout={w} />)}
      </div>
    </section>
  );
}

const s = {
  center: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #ede7f6',
    borderTop: '5px solid #4a148c',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }
};

export default Home;