import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CryptoPage from './pages/CryptoPage';
import CryptoHistoryPage from './pages/CryptoHistoryPage';
import PressReviewPage from './pages/PressReviewPage';
import AdminPage from './pages/AdminPage';
import {
  AccessLevelProvider,
  useAccessLevel,
} from './contexts/AccessLevelContext';
import './styles/App.css';

function AppRoutes() {
  const { userRole } = useAccessLevel();

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={userRole === 'admin' ? <AdminPage /> : <Navigate to="/" />}
      />
      <Route
        path="/profile"
        element={
          userRole !== 'anonymous' ? <ProfilePage /> : <Navigate to="/login" />
        }
      />
      <Route path="/cryptos" element={<CryptoPage />} />
      <Route
        path="/crypto-history"
        element={
          userRole !== 'anonymous' ? (
            <CryptoHistoryPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/press-reviews" element={<PressReviewPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AccessLevelProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AccessLevelProvider>
  );
}

export default App;
