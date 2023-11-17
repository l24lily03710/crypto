import React, { useEffect, useState } from 'react';

const CryptoDetails = ({ match }) => {
  const [crypto, setCrypto] = useState(null);
  const cmid = match.params.cmid; // Assuming you're using React Router

  useEffect(() => {
    fetch(`/cryptos/${cmid}`)
      .then(response => response.json())
      .then(data => setCrypto(data))
      .catch(error => console.error('Error:', error));
  }, [cmid]);

  return (
    <div>
      {crypto && (
        <>
          <img src={crypto.imageUrl} alt={crypto.name} />
          <h2>{crypto.name}</h2>
          {/* Display other details */}
        </>
      )}
    </div>
  );
};

export default CryptoDetails;
