import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WorkoutProvider } from './context/WorkoutContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import WorkoutDetail from './pages/WorkoutDetail';
import Progress from './pages/Progress';
import Nutrition from './pages/Nutrition';
import History from './pages/History';

function App() {
  return (
    <WorkoutProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ backgroundColor: '#f3e5f5', minHeight: '100vh' }}>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/progress"    element={<Progress />} />
            <Route path="/nutrition"   element={<Nutrition />} />
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
  );
}

export default App;