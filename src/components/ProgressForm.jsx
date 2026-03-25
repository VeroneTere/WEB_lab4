import { useState, useEffect } from 'react';
import { db } from '../firebase'; // імпортуємо базу даних
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

function ProgressForm({ user }) {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState('');
  const [steps, setSteps] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Завантаження даних з Firebase при старті
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Запит: шукаємо в колекції "progress" записи поточного користувача, сортуємо за датою
        const q = query(
          collection(db, "progress"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Сортуємо вручну за датою (або можна налаштувати індекси у Firebase)
        setRecords(data.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate)));
      } catch (e) {
        console.error("Помилка отримання даних: ", e);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchRecords();
  }, [user]);

  const maxSteps = Math.max(...records.map(r => r.steps), 1);

  // 2. Збереження нового запису в Firebase
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!date || !steps || !weight) return;

    const formattedDate = date.slice(5).split('-').reverse().join('.');
    
    const newRec = {
      userId: user.uid, // Прив'язуємо до користувача
      date: formattedDate,
      rawDate: date, // для зручного сортування
      steps: parseInt(steps),
      weight: parseFloat(weight),
      cal: Math.round(parseInt(steps) * 0.04)
    };

    try {
      // Додаємо в хмару
      const docRef = await addDoc(collection(db, "progress"), newRec);
      
      // Оновлюємо локальний стейт, щоб одразу побачити результат
      setRecords(prev => [...prev, { ...newRec, id: docRef.id }].sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate)));
      
      // Очищуємо форму
      setDate(''); setSteps(''); setWeight('');
    } catch (e) {
      alert("Помилка при збереженні: " + e.message);
    }
  };

  if (loading) return <p>Завантаження даних...</p>;

  const inp = {
    width: '100%',
    padding: '11px 14px',
    border: '2px solid #ede7f6',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    color: '#311b92'
  };

  return (
    <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
      {/* Форма */}
      <div style={s.box}>
        <h3 style={s.boxTitle}>📋 Записати показники</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={s.label}>Дата</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inp} required />
          </div>
          <div>
            <label style={s.label}>Кроки</label>
            <input type="number" placeholder="напр: 10000" value={steps} onChange={e => setSteps(e.target.value)} style={inp} required />
          </div>
          <div>
            <label style={s.label}>Вага (кг)</label>
            <input type="number" step="0.1" placeholder="напр: 68.5" value={weight} onChange={e => setWeight(e.target.value)} style={inp} required />
          </div>
          <button type="submit" style={s.saveBtn}>
            💾 Зберегти в хмару
          </button>
        </form>
      </div>

      {/* Графік + таблиця */}
      <div style={{ ...s.box, flex: 2, minWidth: '300px' }}>
        <h3 style={s.boxTitle}>📊 Твій прогрес</h3>

        {/* Стовпчаста діаграма */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px', borderBottom: '2px solid #ede7f6', marginBottom: '8px' }}>
          {records.slice(-7).map(r => (
            <div key={r.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '0.58rem', color: '#888' }}>{r.steps}</span>
              <div style={{
                width: '100%',
                height: `${(r.steps / maxSteps) * 140}px`,
                backgroundColor: '#9575cd',
                borderRadius: '5px 5px 0 0',
                minHeight: '4px',
                transition: '0.3s'
              }} />
              <span style={{ fontSize: '0.62rem', color: '#666', textAlign: 'center' }}>{r.date}</span>
            </div>
          ))}
        </div>

        {/* Таблиця */}
        <div style={{ overflowX: 'auto', marginTop: '15px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr>
                {['Дата', 'Кроки', 'Вага', 'Ккал'].map(h => (
                  <th key={h} style={{ backgroundColor: '#4a148c', color: 'white', padding: '9px 12px', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#faf4ff' : 'white' }}>
                  <td style={s.td}>{r.date}</td>
                  <td style={s.td}>{r.steps.toLocaleString()}</td>
                  <td style={s.td}>{r.weight} кг</td>
                  <td style={s.td}>{r.cal} ккал</td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>Даних поки немає. Додай свій перший результат!</p>}
        </div>
      </div>
    </div>
  );
}

const s = {
  box: {
    background: 'white',
    padding: '25px',
    borderRadius: '18px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    flex: 1,
    minWidth: '270px'
  },
  boxTitle: { marginTop: 0, marginBottom: '18px', color: '#4a148c', fontSize: '1.1rem' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.85rem', color: '#555' },
  saveBtn: {
    backgroundColor: '#4a148c',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: '0.2s'
  },
  td: { padding: '9px 12px', borderBottom: '1px solid #f0e6ff' }
};

export default ProgressForm;