import { useState } from 'react';
import { recipes } from '../data/data';

const INITIAL_MEALS = [
  { id: 1, time: 'Сніданок', name: 'Омлет з авокадо', cal: 320 },
  { id: 2, time: 'Обід', name: 'Лосось з рисом', cal: 450 }
];

function MealTable() {
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [mealTime, setMealTime] = useState('Сніданок');
  const [mealName, setMealName] = useState('');
  const [mealCal, setMealCal] = useState('');

  const total = meals.reduce((s, m) => s + m.cal, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!mealName.trim() || !mealCal) return;
    setMeals(prev => [...prev, {
      id: Date.now(),
      time: mealTime,
      name: mealName.trim(),
      cal: parseInt(mealCal)
    }]);
    setMealName(''); setMealCal('');
  };

  const handleDelete = (id) => setMeals(prev => prev.filter(m => m.id !== id));

  const handleSelectRecipe = (recipe) => {
    setMeals(prev => [...prev, {
      id: Date.now(),
      time: recipe.time,
      name: recipe.name,
      cal: recipe.cal
    }]);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>

        {/* Форма додавання */}
        <div style={s.box}>
          <h3 style={s.title}>➕ Додати страву вручну</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={s.label}>Прийом їжі</label>
              <select value={mealTime} onChange={e => setMealTime(e.target.value)} style={inp}>
                <option>Сніданок</option>
                <option>Обід</option>
                <option>Вечеря</option>
                <option>Перекус</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Назва страви</label>
              <input type="text" placeholder="напр: Гречана каша" value={mealName} onChange={e => setMealName(e.target.value)} style={inp} required />
            </div>
            <div>
              <label style={s.label}>Калорії (ккал)</label>
              <input type="number" placeholder="напр: 300" value={mealCal} onChange={e => setMealCal(e.target.value)} style={inp} required />
            </div>
            <button type="submit" style={s.addBtn}>Додати в план</button>
          </form>
        </div>

        {/* Таблиця плану */}
        <div style={{ ...s.box, flex: 2, minWidth: '300px' }}>
          <h3 style={s.title}>🥗 Ваш раціон на сьогодні</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  {['Прийом їжі', 'Страва', 'Калорії', ''].map((h, i) => (
                    <th key={i} style={{ backgroundColor: '#4a148c', color: 'white', padding: '10px 14px', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meals.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>
                      Раціон порожній. Додайте першу страву!
                    </td>
                  </tr>
                ) : (
                  meals.map((m, i) => (
                    <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#faf4ff' : 'white' }}>
                      <td style={s.td}>{m.time}</td>
                      <td style={s.td}>{m.name}</td>
                      <td style={s.td}>{m.cal} ккал</td>
                      <td style={s.td}>
                        <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }} title="Видалити">❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {meals.length > 0 && (
                <tfoot>
                  <tr style={{ backgroundColor: '#f3e5f5', fontWeight: 'bold' }}>
                    <td colSpan="2" style={{ padding: '12px 14px', textAlign: 'right' }}>Загалом за день:</td>
                    <td style={{ padding: '12px 14px', color: total > 2000 ? '#c62828' : '#2e7d32', fontSize: '1.05rem' }}>
                      {total} ккал
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {total > 2000 && (
            <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#fff3e0', border: '1px solid #ffb300', borderRadius: '10px', color: '#e65100', fontWeight: '600' }}>
              ⚠️ Ви перевищили рекомендовану денну норму (2000 ккал)!
            </div>
          )}
          {total > 0 && total <= 2000 && (
            <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#e8f5e9', border: '1px solid #66bb6a', borderRadius: '10px', color: '#2e7d32', fontWeight: '600' }}>
              ✅ Чудово! Ви вкладаєтесь у денну норму.
            </div>
          )}
        </div>
      </div>

      {/* Рецепти */}
      <div>
        <h3 style={{ color: '#4a148c', marginBottom: '15px' }}>📖 Готові рецепти — натисни щоб додати</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '15px' }}>
          {recipes.map(r => (
            <div key={r.id} style={s.recipeCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={s.recipeTag}>{r.time}</span>
                <span style={{ fontWeight: 'bold', color: '#e64a19', fontSize: '0.85rem' }}>🔥 {r.cal} ккал</span>
              </div>
              <h4 style={{ margin: '0 0 6px', color: '#311b92', fontSize: '1rem' }}>{r.name}</h4>
              <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: '#666' }}><strong>Інгредієнти:</strong> {r.ingredients}</p>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: '#666' }}><strong>Рецепт:</strong> {r.recipe}</p>
              <button onClick={() => handleSelectRecipe(r)} style={s.selectBtn}>
                + Додати до раціону
              </button>
            </div>
          ))}
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
  title: { marginTop: 0, marginBottom: '18px', color: '#4a148c', fontSize: '1.1rem' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '0.85rem', color: '#555' },
  addBtn: {
    backgroundColor: '#4a148c',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  td: { padding: '10px 14px', borderBottom: '1px solid #f0e6ff' },
  recipeCard: {
    background: 'white',
    padding: '18px',
    borderRadius: '14px',
    boxShadow: '0 3px 10px rgba(74,20,140,0.08)',
    display: 'flex',
    flexDirection: 'column'
  },
  recipeTag: {
    display: 'inline-block',
    backgroundColor: '#ede7f6',
    color: '#4a148c',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  selectBtn: {
    backgroundColor: '#7b1fa2',
    color: 'white',
    border: 'none',
    padding: '9px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    marginTop: 'auto',
    transition: '0.2s'
  }
};

export default MealTable;