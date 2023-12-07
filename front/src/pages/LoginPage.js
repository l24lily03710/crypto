import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/LoginPage.css';
import { useAccessLevel } from '../contexts/AccessLevelContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', username: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setAccessLevel } = useAccessLevel();

  useEffect(() => {
    // Check for OAuth token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    if (token) {
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setAccessLevel('User'); // Adjust as needed
      navigate('/profile'); // Redirect to profile or desired page
    }
  }, [navigate, setIsLoggedIn, setAccessLevel]);


  const handleOAuthLogin = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = 'http://localhost:3000/users/auth/google';
  };
  
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
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

        localStorage.setItem('userID', data.user_id);
        setIsLoggedIn(true);
        setAccessLevel('User'); // Adjust this based on your application's needs
        navigate('/profile');
      } else {
        setError(data.error || 'An error occurred during login.');
      }
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          mail: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userID', data.user_id);
        
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
        <button onClick={handleOAuthLogin} className="google-login-btn">
          Login with Google
        </button>
        <button type="button" onClick={toggleAuthMode} className="toggle-auth-mode">
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
