import { useEffect, useState } from 'react'; // Додано useState та useEffect
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
  // Стан для зберігання повідомлення від сервера
  const [backendMessage, setBackendMessage] = useState("Завантаження...");

  // Етап інтеграції (Рис. 5.9 з методички)
  useEffect(() => {
    fetch("http://localhost:5000/api/message")
      .then((response) => response.json())
      .then((data) => {
        console.log("", data);
        setBackendMessage(data.message); // Зберігаємо "Hello from the backend!"
      })
      .catch((error) => {
        console.error("Помилка запиту:", error);
        setBackendMessage();
      });
  }, []);

  return (
    <AuthProvider>
      <WorkoutProvider>
        <BrowserRouter>
          <Navbar />
          
          {/* Плашка з повідомленням від сервера для звіту */}
          

          <div style={{ backgroundColor: '#f3e5f5', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workout/:id" element={<WorkoutDetail />} />
              <Route path="/nutrition" element={<Nutrition />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/history" element={<History />} />
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