import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import { useAccessLevel } from '../contexts/AccessLevelContext';

const Header = () => {
  const { isLoggedIn, logout } = useAccessLevel();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const redirectToHome = () => {
    navigate('/'); // Function to navigate to the homepage
  };

  const handleSignIn = () => {
    navigate('/login'); // Function to navigate to the login page
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-left" onClick={redirectToHome}>
        <span>Count of Money</span>
      </div>
      <div className="Navbar-right">
        <span onClick={() => navigate('/cryptos')}>Crypto Currencies</span>
        <span onClick={() => navigate('/press-reviews')}>Press Review</span>
        {isLoggedIn ? (
          <>
            <span onClick={() => navigate('/profile')}>Profile</span>
            <span onClick={handleSignOut}>Sign Out</span>
          </>
        ) : (
          <span className="SignInButton" onClick={handleSignIn}>Sign In</span>
        )}
      </div>
    </nav>
  );
};

export default Header;