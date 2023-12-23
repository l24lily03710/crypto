import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from '../components/Header';
import '../styles/CryptoHistoryPage.css';

const CryptoHistoryPage = () => {
  const location = useLocation();
  const { cryptoName, cryptoHistory, description, days } = location.state || {};

  if (!cryptoName || !cryptoHistory) {
    return <div>No history data available.</div>;
  }

  const formatChartData = (data, label, borderColor, backgroundColor) => {
    return {
      labels: data.map(item => new Date(item[0]).toLocaleDateString()),
      datasets: [
        {
          label,
          data: data.map(item => item[1]),
          borderColor,
          backgroundColor,
        },
      ],
    };
  };

  return (
    <>
      <Header />
      <div className="crypto-history-page-container">
        <h1> History of {cryptoName} </h1>

        <div className="chart-container">
          <h2>Price History (Last {days} Days)</h2>
          <Line
            data={formatChartData(
              cryptoHistory.prices,
              'Price',
              'rgb(75, 192, 192)',
              'rgba(75, 192, 192, 0.5)'
            )}
          />
        </div>
        <div className="chart-row">
          <div className="chart-container half-width">
            <h2>Market Cap History (Last {days} Days)</h2>
            <Line
              data={formatChartData(
                cryptoHistory.market_caps,
                'Market Cap',
                'rgb(192, 75, 75)',
                'rgba(192, 75, 75, 0.5)'
              )}
            />
          </div>

          <div className="chart-container half-width">
            <h2>Total Volume History (Last {days} Days)</h2>
            <Line
              data={formatChartData(
                cryptoHistory.total_volumes,
                'Total Volume',
                'rgb(75, 75, 192)',
                'rgba(75, 75, 192, 0.5)'
              )}
            />
          </div>
          <div className="crypto-description">
            <h2>About {cryptoName}</h2>
            <p>{description || 'No description available.'}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoHistoryPage;
