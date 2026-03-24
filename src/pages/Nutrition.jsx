import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MealTable from '../components/MealTable';

function Nutrition() {
  const { user, loading } = useAuth(); //

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження...</div>;

  if (!user) {
    return <Navigate to="/login" replace />; //
  }

  return (
    <section style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Раціон та харчування
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Вітаємо, <strong style={{ color: '#4a148c' }}>{user.email}</strong>! Плануй свій раціон.
        </p>
      </div>
      {/* Передаємо користувача для фільтрації страв у базі */}
      <MealTable user={user} />
    </section>
  );
}

export default Nutrition;