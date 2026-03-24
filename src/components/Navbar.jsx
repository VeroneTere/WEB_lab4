// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWorkoutHistory } from '../context/WorkoutContext';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { history } = useWorkoutHistory();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = [
    { to: '/',          label: 'Тренування' },
    { to: '/nutrition', label: 'Харчування' },
    // Ці сторінки тільки для авторизованих
    ...(user ? [
      { to: '/progress', label: 'Мій прогрес' },
      { to: '/history',  label: 'Історія' }
    ] : [])
  ];

  return (
    <header style={s.header}>
      <Link to="/" style={s.logoLink}>
        <h1 style={s.logoText}>💪 FitnessTrack</h1>
      </Link>

      <nav style={s.nav}>
        <ul style={s.list}>
          {links.map(link => (
            <li key={link.to} style={{ position: 'relative' }}>
              <Link
                to={link.to}
                style={{
                  ...s.link,
                  borderBottom: location.pathname === link.to
                    ? '2px solid #ce93d8'
                    : '2px solid transparent'
                }}
              >
                {link.label}
                {link.to === '/history' && history.length > 0 && (
                  <span style={s.badge}>{history.length}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Блок авторизації */}
        <div style={s.authBlock}>
          {user ? (
            // Якщо увійшли — показуємо email та кнопку виходу
            <>
              <span style={s.userEmail}>
                👤 {user.email.split('@')[0]}
              </span>
              <button onClick={handleLogout} style={s.logoutBtn}>
                Вийти
              </button>
            </>
          ) : (
            // Якщо не увійшли — кнопки входу та реєстрації
            <>
              <Link to="/login" style={s.loginBtn}>Увійти</Link>
              <Link to="/register" style={s.registerBtn}>Реєстрація</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

const s = {
  header: {
    backgroundColor: '#4a148c',
    color: 'white',
    padding: '0.8rem 4%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    gap: '20px',
    flexWrap: 'wrap'
  },
  logoLink: { textDecoration: 'none' },
  logoText: { margin: 0, fontSize: '1.3rem', color: 'white' },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
    padding: 0,
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    paddingBottom: '3px',
    transition: '0.2s',
    position: 'relative',
    textDecoration: 'none'
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    right: '-14px',
    backgroundColor: '#ce93d8',
    color: '#311b92',
    borderRadius: '50%',
    width: '17px',
    height: '17px',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  authBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0
  },
  userEmail: {
    color: '#ce93d8',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.4)',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: '0.2s'
  },
  loginBtn: {
    color: 'white',
    textDecoration: 'none',
    border: '2px solid rgba(255,255,255,0.4)',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: '0.2s'
  },
  registerBtn: {
    backgroundColor: '#ce93d8',
    color: '#311b92',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    transition: '0.2s'
  }
};

export default Navbar;