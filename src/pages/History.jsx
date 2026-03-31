import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function History() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ІНТЕГРАЦІЯ З БЕКЕНДОМ (Завдання 3)
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        // Запит до твого Node.js сервера
        const response = await fetch("http://localhost:5000/api/history");
        const data = await response.json();
        
        // Фільтруємо історію, щоб показувати лише тренування поточного користувача
        const userHistory = data.filter(item => item.userId === user.uid);
        setHistory(userHistory);
      } catch (error) {
        console.error("Помилка завантаження історії з бекенду:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  // Захист роуту
  if (authLoading || (loading && user)) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', color: '#4a148c', fontSize: '1.2rem' }}>
        <div className="spinner"></div> {/* Можна додати CSS спінер */}
        <p></p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Розрахунок статистики
  const totalCal = history.reduce((s, r) => s + (Number(r.calories) || 0), 0);
  const totalMin = history.reduce((s, r) => s + (Number(r.time) || 0), 0);

  // Групування за датою
  const grouped = history.reduce((acc, rec) => {
    const date = rec.completedDate || "Без дати";
    if (!acc[date]) acc[date] = [];
    acc[date].push(rec);
    return acc;
  }, {});

  const typeColors = {
    'Кардіо':   { bg: '#e3f2fd', text: '#1565c0' },
    'Йога':     { bg: '#f3e5f5', text: '#6a1b9a' },
    'Силові':   { bg: '#fce4ec', text: '#880e4f' },
    'Розтяжка': { bg: '#e8f5e9', text: '#1b5e20' }
  };

  return (
    <section style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Мій журнал
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
         <strong style={{color: '#4a148c'}}>{user.email}</strong>
        </p>
      </div>

      {history.length === 0 ? (
        <div style={s.emptyBox}>
          <p style={{ fontSize: '3rem', margin: 0 }}>🏋️</p>
          <h3 style={{ color: '#4a148c', margin: '10px 0' }}>Історія порожня</h3>
          <p style={{ color: '#888', margin: '0 0 20px' }}>
            Виконайте тренування, і сервер Node.js збереже його в базу.
          </p>
          <Link to="/" style={s.goBtn}>→ Обрати тренування</Link>
        </div>
      ) : (
        <>
          <div style={s.statsRow}>
            <div style={s.statCard}>
              <p style={s.statNum}>{history.length}</p>
              <p style={s.statLabel}>Тренувань</p>
            </div>
            <div style={s.statCard}>
              <p style={s.statNum}>{totalMin}</p>
              <p style={s.statLabel}>Хвилин</p>
            </div>
            <div style={s.statCard}>
              <p style={s.statNum}>{totalCal}</p>
              <p style={s.statLabel}>Калорій</p>
            </div>
            <div style={s.statCard}>
              <p style={s.statNum}>{Object.keys(grouped).length}</p>
              <p style={s.statLabel}>Днів</p>
            </div>
          </div>

          {Object.entries(grouped).map(([date, recs]) => (
            <div key={date} style={{ marginBottom: '30px' }}>
              <div style={s.dateHeader}>
                <span>📅 {date}</span>
                <span style={{ fontSize: '0.85rem', opacity: 0.85 }}>{recs.length} занять</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recs.map(rec => {
                  const tc = typeColors[rec.type] || { bg: '#f3e5f5', text: '#4a148c' };
                  return (
                    <div key={rec.id} style={s.recCard}>
                      <div style={s.recLeft}>
                        <span style={{ ...s.typeTag, backgroundColor: tc.bg, color: tc.text }}>
                          {rec.type}
                        </span>
                        <div>
                          <p style={s.recTitle}>{rec.title}</p>
                          <p style={s.recTime}>🕐 о {rec.completedTime}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={s.recStat}>⏱ {rec.time} хв</span>
                        <span style={s.recStat}>🔥 {rec.calories} ккал</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={s.goBtn}>+ Почати нове тренування</Link>
          </div>
        </>
      )}
    </section>
  );
}

// Стилі об'єкта s залишаємо без змін...
const s = {
  emptyBox: { textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 4px 15px rgba(74,20,140,0.08)', maxWidth: '500px', margin: '0 auto' },
  goBtn: { display: 'inline-block', backgroundColor: '#4a148c', color: 'white', padding: '12px 28px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.95rem', textDecoration: 'none' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '35px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '14px', textAlign: 'center', boxShadow: '0 4px 12px rgba(74,20,140,0.08)' },
  statNum: { fontSize: '2rem', fontWeight: 'bold', color: '#4a148c', margin: 0 },
  statLabel: { fontSize: '0.8rem', color: '#888', margin: '5px 0 0' },
  dateHeader: { backgroundColor: '#4a148c', color: 'white', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' },
  recCard: { background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(74,20,140,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  recLeft: { display: 'flex', alignItems: 'center', gap: '14px', flex: 1 },
  typeTag: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' },
  recTitle: { margin: 0, fontWeight: 'bold', color: '#311b92', fontSize: '0.95rem' },
  recTime: { margin: '3px 0 0', color: '#888', fontSize: '0.82rem' },
  recStat: { backgroundColor: '#f3e5f5', padding: '5px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#4a148c', fontWeight: '600' }
};

export default History;