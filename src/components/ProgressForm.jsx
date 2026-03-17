import { useState } from 'react';

const INITIAL = [
  { id: 1, date: '13.03', steps: 8500, weight: 70.2, cal: 340 },
  { id: 2, date: '14.03', steps: 10200, weight: 70.0, cal: 408 },
  { id: 3, date: '15.03', steps: 9100, weight: 69.8, cal: 364 },
  { id: 4, date: '16.03', steps: 11500, weight: 69.6, cal: 460 },
  { id: 5, date: '17.03', steps: 8800, weight: 69.5, cal: 352 }
];

function ProgressForm() {
  const [records, setRecords] = useState(INITIAL);
  const [date, setDate] = useState('');
  const [steps, setSteps] = useState('');
  const [weight, setWeight] = useState('');

  const maxSteps = Math.max(...records.map(r => r.steps), 1);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!date || !steps || !weight) return;

    const formatted = date.slice(5).split('-').reverse().join('.');
    const newRec = {
      id: Date.now(),
      date: formatted,
      steps: parseInt(steps),
      weight: parseFloat(weight),
      cal: Math.round(parseInt(steps) * 0.04)
    };
    setRecords(prev => [...prev, newRec]);
    setDate(''); setSteps(''); setWeight('');
  };

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
            💾 Зберегти
          </button>
        </form>
      </div>

      {/* Графік + таблиця */}
      <div style={{ ...s.box, flex: 2, minWidth: '300px' }}>
        <h3 style={s.boxTitle}>📊 Графік кроків</h3>

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