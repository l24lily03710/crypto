import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import OAuthLogin from '../components/OAuthLogin';
import '../styles/LoginPage.css';
import { useAccessLevel } from '../contexts/AccessLevelContext';
import AdminPage from '../pages/AdminPage';

const LoginPage = () => {
  const [role, setRole] = useState('User');
  const [cryptoFavorites, setCryptoFavorites] = useState([]);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    username: '',
    
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setAccessLevel, accessLevel } = useAccessLevel();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Handle token found in URL parameter
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setAccessLevel('User');
      navigate('/profile');
    } else {
      // Check if already logged in with existing token
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        navigate('/'); // Redirect to the profile page if already logged in
      }
    }
  }, [navigate, setIsLoggedIn, setAccessLevel]);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://coin-market-api.vercel.app/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setAccessLevel('User'); // Adjust this based on your application's needs
        navigate('/');
      } else {
        setError(data.error || 'An error occurred during login.');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://coin-market-api.vercel.app/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          mail: credentials.email,
          password: credentials.password,
          role: role,
          cryptoFavorites: cryptoFavorites,
       
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setAccessLevel('User'); // Adjust this based on your application's needs
        navigate('/profile');
      } else {
        setError(data.error || 'An error occurred during registration.');
      }
    } catch (error) {
      setError('An error occurred during registration.');
    }
  };

  const handleGoogleAuthSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);

    // Parse the token to get the user ID (assuming the token is a JWT)
    const payload = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('user_id', payload.user_id);
    const isNewUser = payload.isNewUser;
    const userCryptoPreferences = payload.cryptos;

    setAccessLevel('User');
    navigate('/profile'); // Navigate to the user profile
  
};

  
  const handleSubmit = (e) => {
    e.preventDefault();
    isRegistering ? handleRegister() : handleLogin();
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    
    <div>
      <Header />
      <div>
        {accessLevel === 'admin' && <AdminPage />}
      </div>
      <div className="auth-form-container">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          {isRegistering && (
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          )}
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>  
        <div className="oauth-login-section">
          <OAuthLogin onGoogleAuthSuccess={handleGoogleAuthSuccess}/>
        </div>
        <button type="button" onClick={toggleAuthMode} className="toggle-auth-mode">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
