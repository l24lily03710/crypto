import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CryptoPage.css';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAccessLevel } from '../contexts/AccessLevelContext';

const CryptoPage = () => {
  const { userRole } = useAccessLevel();
  const [cryptos, setCryptos] = useState([]);
  const [favoriteCryptos, setFavoriteCryptos] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCryptos();
    fetchUserFavorites();
  }, []);

  const fetchUserFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const decoded = jwtDecode(token);
      const response = await axios.get(
        `http://localhost:3000/users/profile/${
          decoded.user_id || decoded.user?.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userFavorites = response.data.cryptos;
      const favoriteCryptoDetails = await Promise.all(
        userFavorites.map(async cryptoName => {
          const detailResponse = await axios.get(
            `http://localhost:3000/cryptos/${cryptoName}`
          );
          return detailResponse.data[0];
        })
      );
      setFavoriteCryptos(favoriteCryptoDetails);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const fetchCryptos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/cryptos');
      const cryptoData = response.data;
      await Promise.all(
        cryptoData.map(async crypto => {
          const cryptoNameLower = crypto.name.toLowerCase();
          const detailResponse = await axios.get(
            `http://localhost:3000/cryptos/${cryptoNameLower}`
          );
          return detailResponse.data[0];
        })
      ).then(setCryptos);
    } catch (error) {
      console.error('Error fetching cryptos:', error);
    }
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const onCryptoClick = async (cryptoName, imageUrl) => {
    try {
      const days = '60';
      const response = await axios.get(
        `http://localhost:3000/cryptos/${cryptoName.toLowerCase()}/history/${days}`
      );
      navigate('/crypto-history', {
        state: {
          cryptoName,
          cryptoHistory: response.data,
          imageUrl,
          days,
        },
      });
    } catch (error) {
      console.error('Error fetching crypto history:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="crypto-page-container">
        <h1>Cryptocurrencies</h1>

        {userRole !== 'anonymous' && (
          <button onClick={toggleFavorites}>
            {showFavorites ? 'Show All' : 'Show Favorites'}
          </button>
        )}
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Current Price</th>
              <th>Opening Price</th>
              <th>Lowest Price</th>
              <th>Highest Price</th>
            </tr>
          </thead>
          <tbody>
            {(showFavorites ? favoriteCryptos : cryptos).map(
              (crypto, index) =>
                crypto && (
                  <tr
                    key={index}
                    onClick={() => onCryptoClick(crypto.name, crypto.imageUrl)}
                  >
                    <td>
                      <img src={crypto.imageUrl} alt={crypto.name} />
                    </td>
                    <td>{crypto.name}</td>
                    <td>{crypto.currentPrice}</td>
                    <td>{crypto.openingPrice}</td>
                    <td>{crypto.lowestPrice}</td>
                    <td>{crypto.highestPrice}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default CryptoPage;
