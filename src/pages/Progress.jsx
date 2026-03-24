import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressForm from '../components/ProgressForm';

function Progress() {
  const { user, loading } = useAuth(); // Додаємо loading, щоб уникнути помилкового редіректу

  // Поки Firebase перевіряє сесію, показуємо заглушку
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Завантаження...</div>;
  }

  // Якщо не авторизований — перенаправляємо на сторінку входу
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section style={{ padding: '40px 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '35px' }}>
        <h2 style={{ fontSize: '2rem', color: '#4a148c', margin: 0 }}>
          Мій прогрес
        </h2>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Вітаємо, <strong style={{ color: '#4a148c' }}>{user.email}</strong>! 
          Відстежуй свої результати.
        </p>
      </div>
      
      {/* Передаємо об'єкт користувача, щоб форма знала, чиї дані завантажувати з бази */}
      <ProgressForm user={user} />
    </section>
  );
}

export default Progress;