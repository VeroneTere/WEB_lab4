import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { workouts } from '../data/data';
import { useWorkoutHistory } from '../context/WorkoutContext';

function WorkoutDetail() {
  const { id } = useParams();
  const workout = workouts.find(w => w.id === parseInt(id));
  const [status, setStatus] = useState('idle');
  const { addToHistory } = useWorkoutHistory();

  if (!workout) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2 style={{ color: '#4a148c' }}>Тренування не знайдено</h2>
        <Link to="/" style={{ color: '#7b1fa2', fontWeight: 'bold' }}>
          ← Повернутись на головну
        </Link>
      </div>
    );
  }

  const handleBtn = () => {
    if (status === 'idle') {
      setStatus('active');
    } else if (status === 'active') {
      setStatus('done');
      addToHistory(workout);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const btnText = {
    idle:   '▶ Почати тренування',
    active: '⏳ В процесі... (натисни щоб завершити)',
    done:   '✅ Завершено! Чудова робота!'
  };
  const btnColor = {
    idle:   '#4a148c',
    active: '#f57f17',
    done:   '#2e7d32'
  };

  return (
    <main style={{ padding: '35px 5%' }}>
      <Link to="/" style={s.backBtn}>← Назад до тренувань</Link>

      <div style={s.card}>
        <h2 style={s.cardTitle}>{workout.title}</h2>

        {/* Відео */}
        <div style={s.videoBox}>
          <iframe
            style={s.iframe}
            src={`https://www.youtube.com/embed/${workout.video}`}
            title={workout.title}
            allowFullScreen
          />
        </div>

        {/* Статистика */}
        <div style={s.statsRow}>
          <div style={s.statItem}>⏱<br /><strong>{workout.time} хв</strong></div>
          <div style={s.statItem}>📊<br /><strong>{workout.level}</strong></div>
          <div style={s.statItem}>💪<br /><strong>{workout.type}</strong></div>
          <div style={s.statItem}>🔥<br /><strong>~{workout.calories} ккал</strong></div>
        </div>

        {/* Опис */}
        <h3 style={s.sectionTitle}>Про тренування</h3>
        <p style={{ color: '#555', lineHeight: 1.8 }}>{workout.desc}</p>

        {/* Поради */}
        <h3 style={s.sectionTitle}>💡 Поради</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: 2.2, color: '#444' }}>
          {workout.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>

        {/* зберігає в історію */}
        <button
          onClick={handleBtn}
          style={{ ...s.startBtn, backgroundColor: btnColor[status] }}
        >
          {btnText[status]}
        </button>

        {/* Підказка після завершення */}
        {status === 'done' && (
          <div style={s.successMsg}>
            🎉 Тренування збережено в <Link to="/history" style={{ color: '#4a148c', fontWeight: 'bold' }}>Історії</Link>!
          </div>
        )}
      </div>
    </main>
  );
}

const s = {
  backBtn: {
    display: 'inline-block',
    backgroundColor: '#4a148c',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    fontWeight: 'bold',
    marginBottom: '20px',
    fontSize: '0.9rem'
  },
  card: {
    maxWidth: '860px',
    margin: '0 auto',
    background: 'white',
    padding: '35px',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(74,20,140,0.12)'
  },
  cardTitle: { marginTop: 0, color: '#4a148c', fontSize: '1.6rem' },
  videoBox: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    marginBottom: '25px',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  iframe: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    border: 'none'
  },
  statsRow: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '25px'
  },
  statItem: {
    flex: 1,
    minWidth: '80px',
    backgroundColor: '#f3e5f5',
    padding: '12px',
    borderRadius: '12px',
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#4a148c',
    lineHeight: 1.6
  },
  sectionTitle: {
    color: '#4a148c',
    marginTop: '20px',
    marginBottom: '10px'
  },
  startBtn: {
    width: '100%',
    marginTop: '25px',
    color: 'white',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: '0.3s'
  },
  successMsg: {
    marginTop: '15px',
    padding: '14px 18px',
    backgroundColor: '#e8f5e9',
    border: '1px solid #66bb6a',
    borderRadius: '10px',
    color: '#2e7d32',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '1rem'
  }
};

export default WorkoutDetail;