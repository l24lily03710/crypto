/**
 * Service pour obtenir les détails d'une crypto-monnaie à partir de l'API CoinGecko.
 * @module CryptoService
 */

const axios = require('axios');

/**
 * Récupère les détails d'une crypto-monnaie spécifiée par son identifiant depuis l'API CoinGecko.
 * @function
 * @name getCoinDetails
 * @memberof module:CryptoService
 * @inner
 * @param {string} cryptoId - Identifiant de la crypto-monnaie.
 * @returns {Promise<Object>} - Promesse résolue avec les détails de la crypto-monnaie au format JSON.
 * @throws {Error} - Lance une erreur en cas d'échec de la requête vers l'API.
 */
const getCoinDetails = async (cryptoId) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${cryptoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching crypto details for ${cryptoId}:`, error.message);
    throw error;
  }
};

/**
 * Récupère la liste des crypto-monnaies depuis l'API CoinGecko.
 * @function
 * @name getCoinList
 * @memberof module:CryptoService
 * @inner
 * @returns {Promise<Array>} - Promesse résolue avec la liste des crypto-monnaies au format JSON.
 * @throws {Error} - Lance une erreur en cas d'échec de la requête vers l'API.
 */
const getCoinList = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching coin list:', error.message);
    throw error;
  }
};

const getCryptoHistory = async (coinId, days = 'max') => {
  console.log(days)
  console.log(coinId)
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=${days}&interval=daily`, {
      headers: {
        'x-cg-demo-api-key': process.env.GECKO_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    throw error;
  }
};

module.exports = {
  getCryptoHistory,
  getCoinDetails,
  getCoinList
};