import { useState, useEffect } from 'react';
import { recipes } from '../data/data';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, orderBy } from 'firebase/firestore';

function MealTable({ user }) {
  // Починаємо з порожнього стану
  const [meals, setMeals] = useState([]);
  const [mealTime, setMealTime] = useState('Сніданок');
  const [mealName, setMealName] = useState('');
  const [mealCal, setMealCal] = useState('');
  const [loading, setLoading] = useState(true);

  // ЗАВАНТАЖЕННЯ: Працює щоразу при оновленні сторінки (F5)
  useEffect(() => {
    const fetchMeals = async () => {
      // Якщо Firebase ще не передав користувача, не робимо запит
      if (!user?.uid) return;
      
      try {
        setLoading(true); 
        console.log("Запитую дані для користувача:", user.uid);

        // Формуємо запит до колекції "meals" тільки для поточного userId
        const q = query(
          collection(db, "meals"), 
          where("userId", "==", user.uid),
          orderBy("createdAt", "asc") // Сортуємо, щоб список був стабільним
        );
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data() 
        }));
        
        setMeals(data);
      } catch (e) {
        console.error("Помилка Firestore:", e);
        // Якщо виникає помилка індексу, Firebase дасть посилання в консолі — по ньому треба перейти
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [user]); // Важливо: стежимо за об'єктом user

  const total = meals.reduce((s, m) => s + m.cal, 0);

  // ДОДАВАННЯ: Записує страву в хмару
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!mealName.trim() || !mealCal || !user) return;

    const newMeal = {
      userId: user.uid, // Прив'язуємо до твого аккаунту
      time: mealTime,
      name: mealName.trim(),
      cal: parseInt(mealCal),
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "meals"), newMeal);
      setMeals(prev => [...prev, { ...newMeal, id: docRef.id }]);
      setMealName(''); 
      setMealCal('');
    } catch (e) {
      alert("Не вдалося зберегти: " + e.message);
    }
  };

  // ВИДАЛЕННЯ: Видаляє документ з бази за його ID
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "meals", id));
      setMeals(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error("Помилка видалення:", e);
    }
  };

  const handleSelectRecipe = async (recipe) => {
    if (!user) return;
    const newMeal = {
      userId: user.uid,
      time: recipe.time || 'Перекус',
      name: recipe.name,
      cal: recipe.cal,
      createdAt: new Date().toISOString()
    };
    
    try {
      const docRef = await addDoc(collection(db, "meals"), newMeal);
      setMeals(prev => [...prev, { ...newMeal, id: docRef.id }]);
    } catch (e) {
      console.error(e);
    }
  };

  // Стан очікування бази даних
  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#4a148c' }}>
      🔄 Отримання даних з Firebase...
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        
        {/* Форма введення */}
        <div style={s.box}>
          <h3 style={s.title}>➕ Додати страву</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <select value={mealTime} onChange={e => setMealTime(e.target.value)} style={s.inp}>
              <option>Сніданок</option>
              <option>Обід</option>
              <option>Вечеря</option>
              <option>Перекус</option>
            </select>
            <input type="text" placeholder="Назва" value={mealName} onChange={e => setMealName(e.target.value)} style={s.inp} required />
            <input type="number" placeholder="Ккал" value={mealCal} onChange={e => setMealCal(e.target.value)} style={s.inp} required />
            <button type="submit" style={s.addBtn}>💾 Зберегти в хмару</button>
          </form>
        </div>

        {/* Таблиця раціону */}
        <div style={{ ...s.box, flex: 2 }}>
          <h3 style={s.title}>🥗 Ваш раціон на сьогодні</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#4a148c', color: 'white' }}>
                <th style={s.th}>Час</th>
                <th style={s.th}>Страва</th>
                <th style={s.th}>Ккал</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {meals.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>У базі поки немає записів</td></tr>
              ) : (
                meals.map((m) => (
                  <tr key={m.id}>
                    <td style={s.td}>{m.time}</td>
                    <td style={s.td}>{m.name}</td>
                    <td style={s.td}>{m.cal} ккал</td>
                    <td style={s.td}>
                      <button onClick={() => handleDelete(m.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ marginTop: '15px', fontWeight: 'bold', color: '#4a148c', fontSize: '1.1rem' }}>
            Загалом: {total} ккал
          </div>
        </div>
      </div>

      {/* Швидкі рецепти */}
      <div>
        <h3 style={{ color: '#4a148c' }}>📖 Додати з рецептів</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
          {recipes.map(r => (
            <div key={r.id} style={s.recipeCard}>
              <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>{r.name}</h4>
              <p style={{ color: '#e64a19', fontWeight: 'bold', fontSize: '0.85rem' }}>{r.cal} ккал</p>
              <button onClick={() => handleSelectRecipe(r)} style={s.selectBtn}>+ Додати</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  box: { background: 'white', padding: '25px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', minWidth: '280px' },
  title: { margin: '0 0 18px', color: '#4a148c', fontSize: '1.1rem' },
  inp: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px', border: '2px solid #ede7f6', outline: 'none', boxSizing: 'border-box' },
  addBtn: { width: '100%', padding: '12px', background: '#4a148c', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  th: { padding: '12px', textAlign: 'left', fontSize: '0.9rem' },
  td: { padding: '12px', borderBottom: '1px solid #f0e6ff', fontSize: '0.9rem' },
  recipeCard: { background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  selectBtn: { background: '#f3e5f5', color: '#4a148c', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }
};

export default MealTable;