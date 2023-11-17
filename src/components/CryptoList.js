import React, { useEffect, useState } from 'react';

const CryptoList = () => {
  const [cryptos, setCryptos] = useState([]);

  useEffect(() => {
    // Fetch cryptocurrency data from the API
    fetch('/cryptos')
      .then(response => response.json())
      .then(data => setCryptos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {cryptos.map(crypto => (
        <div key={crypto.id}>
          <img src={crypto.imageUrl} alt={crypto.name} />
          <h3>{crypto.name}</h3>
          <p>Current Price: {crypto.currentPrice} EUR</p>
          {/* Other details */}
        </div>
      ))}
    </div>
  );
};

export default CryptoList;
