import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [cryptoName, setCryptoName] = useState('');
  const [cryptoList, setCryptoList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCryptoList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cryptos');
      setCryptoList(response.data);
    } catch (error) {
      console.error('Failed to fetch crypto list:', error);
      setErrorMessage('Failed to load cryptocurrencies.');
    }
  };

  useState(() => {
    fetchCryptoList();
  }, []);

  const handleAddCrypto = async () => {
    try {
      await axios.post('http://localhost:3000/cryptos', { name: cryptoName });
      fetchCryptoList();
      setCryptoName('');
    } catch (error) {
      console.error('Error adding crypto:', error);
      setErrorMessage('Failed to add cryptocurrency.');
    }
  };

  const handleDeleteCrypto = async id => {
    try {
      await axios.delete(`http://localhost:3000/cryptos/${id}`);
      fetchCryptoList();
    } catch (error) {
      console.error('Error deleting crypto:', error);
      setErrorMessage('Failed to delete cryptocurrency.');
    }
  };

  return (
    <div className="admin-page-container">
      {' '}
      <Header />
      <div className="admin-content">
        {' '}
        <h1 className="admin-title">Admin Dashboard</h1>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="admin-form">
          {' '}
          <input
            type="text"
            placeholder="Enter crypto name"
            value={cryptoName}
            onChange={e => setCryptoName(e.target.value)}
          />
          <button onClick={handleAddCrypto}>Add Crypto</button>
        </div>
        <div>
          <h2>Crypto List</h2>
          <ul className="admin-list">
            {' '}
            {cryptoList.map(crypto => (
              <li key={crypto._id}>
                {crypto.name}
                <button onClick={() => handleDeleteCrypto(crypto._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
