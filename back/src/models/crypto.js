const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Crypto", cryptoSchema);