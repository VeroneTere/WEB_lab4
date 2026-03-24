// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/user-not-found' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/invalid-credential') {
        setError('Невірний email або пароль!');
      } else if (err.code === 'auth/invalid-email') {
        setError('Невірний формат email!');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Забагато спроб. Спробуй пізніше.');
      } else {
        setError('Помилка входу: ' + err.message);
      }
    }
    setLoading(false);
  };

  const inp = {
    width: '100%',
    padding: '13px 16px',
    border: '2px solid #ede7f6',
    borderRadius: '10px',
    fontSize: '1rem',
    outline: 'none',
    color: '#311b92'
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Лого */}
        <div style={s.logoBox}>
          <span style={s.logoIcon}>💪</span>
          <h1 style={s.logoText}>FitnessTrack</h1>
        </div>

        <h2 style={s.title}>Вхід в акаунт</h2>
        <p style={s.subtitle}>Раді бачити тебе знову!</p>

        {/* Помилка */}
        {error && (
          <div style={s.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.form}>
          <div>
            <label style={s.label}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inp}
              required
            />
          </div>

          <div>
            <label style={s.label}>Пароль</label>
            <input
              type="password"
              placeholder="Твій пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inp}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...s.btn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Вхід...' : '🔑 Увійти'}
          </button>
        </form>

        <p style={s.switchText}>
          Немає акаунта?{' '}
          <Link to="/register" style={s.link}>Зареєструватись</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3e5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 8px 30px rgba(74,20,140,0.15)',
    width: '100%',
    maxWidth: '420px'
  },
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  logoIcon: { fontSize: '2rem' },
  logoText: { margin: 0, color: '#4a148c', fontSize: '1.6rem' },
  title: {
    textAlign: 'center',
    margin: '0 0 6px',
    color: '#311b92',
    fontSize: '1.5rem'
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    margin: '0 0 25px',
    fontSize: '0.9rem'
  },
  errorBox: {
    backgroundColor: '#ffebee',
    border: '1px solid #ef9a9a',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '10px',
    marginBottom: '18px',
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
    color: '#555'
  },
  btn: {
    backgroundColor: '#4a148c',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1rem',
    marginTop: '5px',
    transition: '0.2s',
    width: '100%'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#666',
    fontSize: '0.9rem'
  },
  link: {
    color: '#4a148c',
    fontWeight: 'bold',
    textDecoration: 'none',
    borderBottom: '2px solid #9575cd'
  }
};

export default Login;