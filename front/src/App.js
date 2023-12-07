import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CryptoPage from './pages/CryptoPage';
import PressReviewPage from './pages/PressReviewPage';
import AdminPage from './pages/AdminPage';
import { AccessLevelProvider, useAccessLevel } from './contexts/AccessLevelContext';
import './styles/App.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAccessLevel();
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AccessLevelProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/cryptos" element={<CryptoPage />} />
          <Route path="/press-reviews" element={<PressReviewPage />} />
        </Routes>
      </Router>
    </AccessLevelProvider>
  );
}

export default App;
