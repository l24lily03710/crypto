import React from 'react';
import { Link } from 'react-router-dom';

const FeatureOverview = () => {
  return (
    <section>
      <h2>Key Features</h2>

      {/* User Management */}
      <div>
        <h3>User Management</h3>
        <p>Manage your profile, register, log in, and access personalized features. Our user-friendly interface ensures a seamless experience.</p>
        <Link to="/user-management">Learn More About User Management</Link>
      </div>

      {/* Cryptocurrency Information */}
      <div>
        <h3>Cryptocurrency Information</h3>
        <p>Access real-time and historical data on cryptocurrencies. Features include current and opening prices, daily highs and lows, and comprehensive history charts. Users can view, add, or remove cryptocurrencies, with additional administrative functions available.</p>
        <Link to="/crypto-info">Explore Cryptocurrency Information</Link>
      </div>

      {/* Press Reviews */}
      <div>
        <h3>Press Reviews</h3>
        <p>Stay informed with the latest articles in finance and cryptocurrency. Users can access a wide range of articles with features tailored to their interests, including the ability to view detailed information about each article.</p>
        <Link to="/press-reviews">Discover Press Reviews</Link>
      </div>
    </section>
  );
};

export default FeatureOverview;
