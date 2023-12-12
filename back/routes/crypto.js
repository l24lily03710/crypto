var express = require('express');
var router = express.Router();
var crypto_controller = require("../src/controllers/crypto");

// Gecko routes
router.get("/:id", crypto_controller.getGeckoCryptoById);
router.get("/:id/history/:days", crypto_controller.getCryptoHistory)

// Crypto routes
router.post("/", crypto_controller.createCrypto); // Créer une nouvelle crypto
router.get("/", crypto_controller.getAllCryptos); // Récupérer toutes les cryptos
router.put("/:id", crypto_controller.updateCryptoById); // Mettre à jour une crypto par son ID
router.delete("/:id", crypto_controller.deleteCryptoById); // Supprimer une crypto par son ID

module.exports = router;