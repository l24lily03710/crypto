import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserProfile from './components/UserProfile';
import CryptoList from './components/CryptoList';
import CryptoDetails from './components/CryptoDetails';
import CryptoHistory from './components/CryptoHistory';
import ArticleList from './components/ArticleList';
import ArticleDetails from './components/ArticleDetails';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cryptos" element={<CryptoList />} />
        <Route path="/cryptos/:cmid" element={<CryptoDetails />} />
        <Route path="/cryptos/:cmid/history/:period" element={<CryptoHistory />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
