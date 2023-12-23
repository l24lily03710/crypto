const { getCoinDetails, getCryptoHistory } = require("../../services/geckoApi");
const Crypto = require("../models/crypto");

exports.getGeckoCryptoById = async (req, res, next) => {
  try {
    const cryptoIds = req.params.id;

    if (!cryptoIds) {
      return res.status(400).json({ error: "Missing cryptoIds parameter" });
    }

    const cryptoIdArray = cryptoIds.split(",");

    const cryptoDetailsPromises = cryptoIdArray.map(getCoinDetails);

    const cryptoDetails = await Promise.all(cryptoDetailsPromises);

    const response = cryptoDetails.map((crypto) => ({
      name: crypto.name,
      currentPrice: crypto.market_data.current_price.usd,
      openingPrice: crypto.market_data.current_price.usd,
      lowestPrice: crypto.market_data.low_24h.usd,
      highestPrice: crypto.market_data.high_24h.usd,
      imageUrl: crypto.image.large,
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching crypto details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCryptoHistory = async (req, res, next) => {
  try {
    const cryptoIds = req.params.id;
    const days = req.params.days;

    const historyData = await getCryptoHistory(cryptoIds, days);
    res.json(historyData);
  } catch (error) {
    console.error("Error fetching crypto details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Créer une nouvelle crypto
exports.createCrypto = async (req, res) => {
  try {
    const { name } = req.body;
    const newCrypto = new Crypto({ name });
    const savedCrypto = await newCrypto.save();
    res.status(201).json(savedCrypto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer toutes les cryptos
exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.status(200).json(cryptos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une crypto par son ID
exports.updateCryptoById = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCrypto = await Crypto.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedCrypto) {
      return res.status(404).json({ error: "Crypto not found" });
    }
    res.status(200).json(updatedCrypto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCryptoById = async (req, res) => {
  try {
    const deletedCrypto = await Crypto.findByIdAndDelete(req.params.id);
    if (!deletedCrypto) {
      return res.status(404).json({ message: "Crypto not found" });
    }
    return res.status(200).json({ message: "Crypto deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
