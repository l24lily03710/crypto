import React from 'react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import FeatureOverview from '../components/FeatureOverview';
import AccessLevelinfo from '../components/AccessLevelinfo';
import './Homepage.css'; // Assuming you have a CSS file for styling

const Homepage = ({ isLoggedIn }) => {
  return (
    <div className="homepage">
      <Header isLoggedIn={isLoggedIn} />
      <MainSection />
      <FeatureOverview />
      <AccessLevelinfo />
      <Footer />
    </div>
  );
};

export default Homepage;
