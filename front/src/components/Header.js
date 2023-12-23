import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import { useAccessLevel } from '../contexts/AccessLevelContext';

const Header = () => {
  const { isLoggedIn, logout, userRole } = useAccessLevel();
  const navigate = useNavigate();
  console.log('User Role in Header: ', userRole);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const redirectToHome = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-left" onClick={redirectToHome}>
        <span>Count of Money</span>
      </div>
      <div className="Navbar-right">
        <span onClick={() => navigate('/cryptos')}>Crypto Currencies</span>
        <span onClick={() => navigate('/press-reviews')}>Press Review</span>
        {userRole === 'admin' && (
          <span onClick={() => navigate('/admin')}>AdminPage</span>
        )}
        {isLoggedIn ? (
          <>
            {userRole !== 'anonymous' && (
              <span onClick={() => navigate('/profile')}>Profile</span>
            )}
            <span onClick={handleSignOut}>Sign Out</span>
          </>
        ) : (
          <span className="SignInButton" onClick={handleSignIn}>
            Sign In
          </span>
        )}
      </div>
    </nav>
  );
};

export default Header;
