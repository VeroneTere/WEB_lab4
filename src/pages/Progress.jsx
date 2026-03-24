// src/pages/Progress.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressForm from '../components/ProgressForm';

function Progress() {
  const { user } = useAuth();

  // Якщо не авторизований — перенаправляємо на login
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
      <ProgressForm />
    </section>
  );
}

export default Progress;