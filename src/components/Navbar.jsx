import { Link, useLocation } from 'react-router-dom';
import { useWorkoutHistory } from '../context/WorkoutContext';

function Navbar() {
  const location = useLocation();
  const { history } = useWorkoutHistory();

  const links = [
    { to: '/',          label: 'Тренування' },
    { to: '/progress',  label: 'Мій прогрес' },
    { to: '/nutrition', label: 'Харчування' },
    { to: '/history',   label: 'Історія' }
  ];

  return (
    <header style={s.header}>
      <div style={s.logo}>
        <h1 style={s.logoText}>💪 FitnessTrack</h1>
      </div>
      <nav>
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
                {/* Бейдж з кількістю виконаних тренувань */}
                {link.to === '/history' && history.length > 0 && (
                  <span style={s.badge}>{history.length}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

const s = {
  header: {
    backgroundColor: '#4a148c',
    color: 'white',
    padding: '1rem 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  logo: { display: 'flex', alignItems: 'center' },
  logoText: { margin: 0, fontSize: '1.4rem', color: 'white' },
  list: {
    listStyle: 'none',
    display: 'flex',
    gap: '25px',
    margin: 0,
    padding: 0,
    alignItems: 'center'
  },
  link: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    paddingBottom: '4px',
    transition: '0.2s',
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: '-10px',
    right: '-14px',
    backgroundColor: '#ce93d8',
    color: '#311b92',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '0.68rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default Navbar;