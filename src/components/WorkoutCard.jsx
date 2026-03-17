import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkoutHistory } from '../context/WorkoutContext';

function WorkoutCard({ workout }) {
  const [status, setStatus] = useState('idle');
  const { addToHistory } = useWorkoutHistory();

  const handleBtn = () => {
    if (status === 'idle') {
      setStatus('active');
    } else if (status === 'active') {
      setStatus('done');
      // Зберігаємо в історію при завершенні
      addToHistory(workout);
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const btnText = {
    idle:   '▶ Почати тренування',
    active: '⏳ В процесі... (натисни щоб завершити)',
    done:   '✅ Завершено!'
  };
  const btnColor = {
    idle:   '#4a148c',
    active: '#f57f17',
    done:   '#2e7d32'
  };

  const typeColors = {
    'Кардіо':    { bg: '#e3f2fd', text: '#1565c0' },
    'Йога':      { bg: '#f3e5f5', text: '#6a1b9a' },
    'Силові':    { bg: '#fce4ec', text: '#880e4f' },
    'Розтяжка':  { bg: '#e8f5e9', text: '#1b5e20' }
  };
  const tc = typeColors[workout.type] || { bg: '#f3e5f5', text: '#4a148c' };

  return (
    <article style={s.card}>
      {/* Відео */}
      <div style={s.videoBox}>
        <iframe
          style={s.iframe}
          src={`https://www.youtube.com/embed/${workout.video}`}
          title={workout.title}
          allowFullScreen
        />
      </div>

      {/* Тег типу */}
      <span style={{ ...s.tag, backgroundColor: tc.bg, color: tc.text }}>
        {workout.type}
      </span>

      {/* Назва */}
      <h3 style={s.title}>
        <Link to={`/workout/${workout.id}`} style={s.titleLink}>
          {workout.title}
        </Link>
      </h3>

      <p style={s.desc}>{workout.desc}</p>

      {/* Статистика */}
      <div style={s.stats}>
        <span style={s.stat}>⏱ {workout.time} хв</span>
        <span style={s.stat}>📊 {workout.level}</span>
        <span style={s.stat}>🔥 ~{workout.calories} ккал</span>
      </div>

      {/* Кнопка */}
      <button
        onClick={handleBtn}
        style={{ ...s.btn, backgroundColor: btnColor[status] }}
      >
        {btnText[status]}
      </button>
    </article>
  );
}

const s = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '0 4px 15px rgba(74,20,140,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  videoBox: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
    borderRadius: '10px',
    backgroundColor: '#000'
  },
  iframe: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    border: 'none',
    borderRadius: '10px'
  },
  tag: {
    alignSelf: 'flex-start',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: 'bold'
  },
  title: { margin: 0, fontSize: '1.05rem' },
  titleLink: {
    color: '#311b92',
    borderBottom: '2px dotted #9575cd',
    paddingBottom: '2px'
  },
  desc: { color: '#555', fontSize: '0.9rem', margin: 0 },
  stats: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  stat: {
    backgroundColor: '#f3e5f5',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    color: '#4a148c',
    fontWeight: '600'
  },
  btn: {
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    marginTop: 'auto',
    transition: '0.3s'
  }
};

export default WorkoutCard;