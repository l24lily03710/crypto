import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Homepage.css';


export const Homepage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = () => {
        setIsLoggedIn(true);
        navigate('/login'); 
    };

    const handleSignOut = () => {
        setIsLoggedIn(false);
    };
    const navigateToCrypto = () => {
        navigate('/cryptos');
    };
    const navigateToPressReview = () => {
        navigate('/press-reviews');
    };

    return (

        <div className="Homepage">
          <Header 
           isLoggedIn={isLoggedIn}
           handleSignIn={handleSignIn}
           handleSignOut={handleSignOut}
          />
            <div className="Main-content">
                <div className="Content-left">
                    <h1>Your Gateway to the Crypto Universe - Stay Updated, Stay Ahead</h1>
                    <p>Unlock the World of Crypto with Count of Money. Your One-Stop Crypto Hub<br/>
                     Dive into the Crypto World Access Top Cryptocurrencies and Latest News.<br/>
                     Elevate Your Crypto Journey  Personalize Your Experience with Tailored Content.</p>
                </div>
                <div className="Content-right">
                   <img src="/site.jpeg" alt="Site" className="SiteImage" />
                </div>
            </div>
            <div className="Sections">
                <div className="Section" onClick={navigateToCrypto}>
                    <img src="/currency.png" alt="Crypto" />
                    <h2>Crypto-Currencies</h2>
                    <p>showing current trends in cryptocurrency.</p>
                </div>
                <div className="Section" onClick={navigateToPressReview}>
                    <img src="/newspaper.png" alt="Press" />
                    <h2>Press-Review</h2>
                    <p>Displaying the latest articles.</p>
                </div>
                <div className="Section" onClick={handleSignIn}>
                    <img src="/profile.png" alt="Sign Up" />
                    <h2>Sign Up</h2>
                    <p>Join the Crypto Revolution - Personalize, Explore, Grow.</p>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
