import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import OAuthLogin from '../components/OAuthLogin';
const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', username: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Implement actual login logic here
      navigate('/dashboard');
    } catch (error) {
      setError('An error occurred during login.');
    }
  };

  const handleRegister = async () => {
    try {
      // Implement actual registration logic here
      navigate('/dashboard');
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
        <OAuthLogin />
      </div>

      <button type="button" onClick={toggleAuthMode} className="toggle-auth-mode">
        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;