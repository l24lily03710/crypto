import React, { useState, useEffect } from 'react';

const CryptoHistory = ({ match }) => {
  const [history, setHistory] = useState([]);
  const { cmid, period } = match.params; // React Router params

  useEffect(() => {
    fetch(`/cryptos/${cmid}/history/${period}`)
      .then(response => response.json())
      .then(data => setHistory(data))
      .catch(error => console.error('Error:', error));
  }, [cmid, period]);

  return (
    <div>
      {history.map((dataPoint, index) => (
        <div key={index}>
          <p>Opening: {dataPoint.openingRate}</p>
          {/* Display other historical data points */}
        </div>
      ))}
    </div>
  );
};

export default CryptoHistory;
