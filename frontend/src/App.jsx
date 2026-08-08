import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { TopNav } from './components/layout/TopNav';
import { ControlSidebar } from './components/layout/ControlSidebar';
import { Footer } from './components/layout/Footer';

import Dashboard  from './pages/Dashboard';
import Prediction from './pages/Prediction';
import Fleet      from './pages/Fleet';
import Reports    from './pages/Reports';
import Settings   from './pages/Settings';

import './index.css';

function AppLayout() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#F8FAFC',
    }}>
      {/* Top navigation */}
      <TopNav />

      {/* Body: sidebar + content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ControlSidebar />

        {/* Main scrollable content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: '#F8FAFC',
        }}>
          <Routes>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/prediction"  element={<Prediction />} />
            <Route path="/fleet"       element={<Fleet />} />
            <Route path="/reports"     element={<Reports />} />
            <Route path="/settings"    element={<Settings />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}