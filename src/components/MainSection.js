import React from 'react';
import './MainSection.css'; 
import AccessLevelinfo from '../components/AccessLevelinfo'; 
import FeatureOverview from '../components/AccessLevelinfo'; 

const MainSection = () => {
    return (
        <main className="main-section">
            <h1>Welcome to Our Cryptocurrency Platform</h1>
            <p>
                Discover the latest trends in cryptocurrency. Track real-time updates, 
                explore in-depth analyses, and stay ahead with our comprehensive 
                crypto-currency data and news platform.
            </p>
            <FeatureOverview />
            <AccessLevelInfo />
        </main>
    );
};

export default MainSection;
