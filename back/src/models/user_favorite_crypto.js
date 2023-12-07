const mongoose = require('mongoose');

const userFavoriteCryptoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  crypto_name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("users_favorite_crypto", userFavoriteCryptoSchema);