import { useParams, useNavigate } from 'react-router-dom';
import { useWorkoutHistory } from '../context/WorkoutContext';

// Твій масив тренувань (можна імпортувати з іншого файлу, якщо він там є)
const workoutsData = [
  { id: '1', title: 'Ранкова йога', type: 'Йога', calories: 150, time: 30, level: 'Початківець', video: '', desc: 'Легка розтяжка для гарного початку дня.' },
  { id: '2', title: 'Силове тренування', type: 'Силові', calories: 400, time: 50, level: 'Середній', video: 'JlshQl_-gp4', desc: 'Робота з власною вагою та гантелями.' },
  { id: '3', title: 'Інтенсивне кардіо', type: 'Кардіо', calories: 500, time: 40, level: 'Високий', video: '', desc: 'Спалювання жиру та витривалість.' },
  { id: '4', title: 'Глибока розтяжка', type: 'Розтяжка', calories: 100, time: 25, level: 'Початківець', video: '', desc: 'Відновлення м\'язів після навантажень.' }
];

function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToHistory } = useWorkoutHistory();

  // Знаходимо конкретне тренування за ID з URL
  const workout = workoutsData.find(w => w.id === id);

  if (!workout) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Тренування не знайдено</div>;
  }

  const handleComplete = async () => {
  const record = {
    workoutId: workout.id,
    title: workout.title,
    type: workout.type,
    calories: workout.calories,
    time: workout.time,
    desc: workout.description,  // ← was "description", DB expects "desc"
    level: workout.level || '',  // ← was missing
    video: workout.video || ''   // ← was missing
  };

    try {
      // Викликаємо функцію з контексту, яка робить POST запит на localhost:5000
      await addToHistory(record);
      
      alert(`Вітаємо! "${workout.title}" додано до твоєї історії на сервері.`);
      navigate('/history'); 
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      alert("Сервер не зміг зберегти дані. Перевірте, чи запущено backend.");
    }
  };

  return (
    <section style={{ padding: '40px 5%', maxWidth: '800px', margin: '0 auto' }}>
      <div style={s.card}>
        <span style={s.typeBadge}>{workout.type}</span>
        <h2 style={s.title}>{workout.title}</h2>
        
        <div style={s.infoRow}>
          <div style={s.infoItem}>⏱ <strong>{workout.time}</strong> хв</div>
          <div style={s.infoItem}>🔥 <strong>{workout.calories}</strong> ккал</div>
        </div>

        <p style={s.description}>{workout.description}</p>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button onClick={() => navigate(-1)} style={s.backBtn}>
            ← Назад
          </button>
          <button onClick={handleComplete} style={s.completeBtn}>
            ✅ Завершити тренування
          </button>
        </div>
      </div>
    </section>
  );
}

const s = {
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(74,20,140,0.1)',
    textAlign: 'center'
  },
  typeBadge: {
    backgroundColor: '#f3e5f5',
    color: '#4a148c',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '15px'
  },
  title: { fontSize: '2.2rem', color: '#4a148c', margin: '0 0 20px' },
  infoRow: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '30px', 
    marginBottom: '25px',
    fontSize: '1.1rem'
  },
  infoItem: { color: '#666' },
  description: { lineHeight: '1.6', color: '#555', fontSize: '1.05rem' },
  completeBtn: {
    flex: 2,
    backgroundColor: '#4a148c',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s'
  },
  backBtn: {
    flex: 1,
    backgroundColor: '#f3e5f5',
    color: '#4a148c',
    border: 'none',
    padding: '15px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default WorkoutDetail;