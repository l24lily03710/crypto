/**
 * Modèle représentant la relation entre un utilisateur et ses cryptos favorites.
 * Chaque entrée indique l'association entre l'identifiant d'un utilisateur et l'identifiant d'une crypto.
 * Utilisé pour gérer les cryptos favorites des utilisateurs.
 *
 * @module UserCrypto
 */

const mongoose = require("mongoose");

/**
 * Schéma de données pour l'entité UserCrypto.
 * @typedef {Object} UserCrypto
 * @property {mongoose.Schema.Types.ObjectId} _id - Identifiant unique généré automatiquement.
 * @property {mongoose.Schema.Types.ObjectId} userId - Identifiant de l'utilisateur associé, faisant référence au modèle User.
 * @property {String} cryptoId - Identifiant de la crypto associée, faisant référence au modèle Crypto.
 */

const userCryptoSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cryptoId: { type: String, ref: "Crypto" },
});

userCryptoSchema.statics.deleteByUserId = async function (userId) {
  return this.deleteMany({ userId });
};

/**
 * Méthode virtuelle pour obtenir l'identifiant de l'entité UserCrypto.
 * @name id
 * @memberof module:UserCrypto~UserCrypto
 * @type {mongoose.Types.ObjectId}
 */
userCryptoSchema.virtual("id").get(function () {
  return this._id;
});

/**
 * Configuration pour convertir les objets UserCrypto en format JSON.
 */
userCryptoSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("UserCrypto", userCryptoSchema);