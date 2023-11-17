import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn }) => {
    return (
        <header className="header">
            <div className="logo">
                {/* You can replace this with your actual logo */}
                <Link to="/">CountMoney</Link>
            </div>
            <nav className="navigation">
                <Link to="/" className="nav-link">Home</Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        {/* Add additional links as necessary */}
                        {/* Logout functionality can be added here */}
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login/Signup</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
