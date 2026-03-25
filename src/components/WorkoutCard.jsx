import { useState } from 'react';
import { useWorkoutHistory } from '../context/WorkoutContext';

function WorkoutCard({ workout }) {
  const [status, setStatus] = useState('idle');
  const { addToHistory } = useWorkoutHistory();

  const handleClick = async () => {
    if (status === 'idle') {
      setStatus('progress');
    } else if (status === 'progress') {
      setStatus('done');
      
      // Зберігаємо в базу
      await addToHistory(workout);

      // Повертаємо кнопку в початковий стан через 3 сек
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }
  };

  const getBtnStyle = () => {
    if (status === 'progress') return { ...s.btn, backgroundColor: '#ffa000' };
    if (status === 'done') return { ...s.btn, backgroundColor: '#4caf50' };
    return s.btn; 
  };

  const getBtnText = () => {
    if (status === 'progress') return 'В процесі... (Натисни щоб завершити)';
    if (status === 'done') return 'Завершено ✓';
    return 'Почати тренування';
  };

  return (
    <article style={s.card}>
      <div style={s.videoBox}>
        <iframe
          src={`https://www.youtube.com/embed/${workout.video}`}
          frameBorder="0"
          allowFullScreen
          style={s.iframe}
        ></iframe>
      </div>
      <h3 style={s.title}>{workout.title}</h3>
      <div style={s.descBox}>
        <p style={s.desc}>{workout.desc}</p>
        <ul style={s.list}>
          <li>⏳ {workout.time} хв</li>
          <li>🔥 {workout.calories} ккал</li>
          <li>💪 {workout.type}</li>
        </ul>
      </div>
      <button onClick={handleClick} style={getBtnStyle()}>
        {getBtnText()}
      </button>
    </article>
  );
}

const s = {
  card: {
    background: 'white', padding: '25px', borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(74, 20, 140, 0.1)', display: 'flex',
    flexDirection: 'column', transition: 'transform 0.3s ease'
  },
  videoBox: {
    position: 'relative', paddingBottom: '56.25%', height: 0,
    overflow: 'hidden', marginBottom: '15px', borderRadius: '10px'
  },
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  title: { color: '#311b92', marginTop: 0, marginBottom: '10px', fontSize: '1.2rem' },
  descBox: { flexGrow: 1, marginBottom: '15px' },
  desc: { color: '#666', fontSize: '0.9rem', marginBottom: '10px' },
  list: { listStyle: 'none', padding: 0, margin: 0, color: '#555', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '5px' },
  btn: {
    backgroundColor: '#4a148c', color: 'white', border: 'none', padding: '12px',
    borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold',
    transition: '0.3s', marginTop: 'auto', width: '100%'
  }
};

export default WorkoutCard;