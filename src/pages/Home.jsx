import { useState } from 'react';
import WorkoutCard from '../components/WorkoutCard';
import { workouts } from '../data/data';

const TYPES = ['Всі', 'Кардіо', 'Силові', 'Йога', 'Розтяжка'];

function Home() {
  const [activeType, setActiveType] = useState('Всі');

  const filtered = activeType === 'Всі'
    ? workouts
    : workouts.filter(w => w.type === activeType);

  return (
    <section style={{ padding: '40px 5%' }}>

      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Відео-тренування
        </h2>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '1rem' }}>
          Обери тип активності та фіксуй результат
        </p>
      </div>

      {/* Кнопки фільтрації — ГОЛОВНА ФУНКЦІЯ ЛР */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
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

      {/* Лічильник */}
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px', fontSize: '0.9rem' }}>
        Показано: <strong style={{ color: '#4a148c' }}>{filtered.length}</strong> з {workouts.length} тренувань
      </p>

      {/* Сітка карток */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px'
        }}>
          {filtered.map(w => (
            <WorkoutCard key={w.id} workout={w} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '1.1rem', padding: '50px' }}>
          Тренувань за цим типом не знайдено.
        </p>
      )}
    </section>
  );
}

export default Home;