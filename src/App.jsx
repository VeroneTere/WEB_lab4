// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';
import Nutrition from './pages/Nutrition';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    // AuthProvider — найзовнішній, бо всі компоненти потребують авторизацію
    <AuthProvider>
      <WorkoutProvider>
        <BrowserRouter>
          <Navbar />
          <div style={{ backgroundColor: '#f3e5f5', minHeight: '100vh' }}>
            <Routes>
              {/* Публічні сторінки */}
              <Route path="/"            element={<Home />} />
              <Route path="/workout/:id" element={<WorkoutDetail />} />
              <Route path="/nutrition"   element={<Nutrition />} />
              <Route path="/login"       element={<Login />} />
              <Route path="/register"    element={<Register />} />

              {/* Захищені сторінки (перевірка всередині компонента) */}
              <Route path="/progress"    element={<Progress />} />
              <Route path="/history"     element={<History />} />
            </Routes>
          </div>
          <footer style={{
            backgroundColor: '#4a148c',
            color: 'white',
            padding: '30px 5%',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0 }}>© 2026 FitnessTrack</p>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.85rem' }}>
              Email: veronika.lviv@lpnu.ua · Telegram: @veronika_fitness
            </p>
          </footer>
        </BrowserRouter>
      </WorkoutProvider>
    </AuthProvider>
  );
}

export default App;