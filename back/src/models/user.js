/**
 * Modèle représentant un utilisateur.
 * Stocke les informations de base d'un utilisateur, y compris son nom d'utilisateur, son adresse e-mail,
 * son mot de passe (haché) et la liste de ses cryptos favorites.
 *
 * @module User
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * Schéma de données pour l'entité User.
 * @typedef {Object} User
 * @property {mongoose.Schema.Types.ObjectId} _id - Identifiant unique généré automatiquement.
 * @property {String} username - Nom d'utilisateur de l'utilisateur (champ requis).
 * @property {String} mail - Adresse e-mail de l'utilisateur (champ requis et unique).
 * @property {String} password - Mot de passe de l'utilisateur (champ requis).
 * @property {mongoose.Schema.Types.ObjectId[]} cryptos - Liste des identifiants des cryptos favorites de l'utilisateur,
 * faisant référence au modèle UserCrypto.
 */

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  username: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'user'},
  cryptos: [{
    type: String,
    ref: 'UserCrypto',
  }],
});

/**
 * Middleware exécuté avant l'enregistrement d'un utilisateur.
 * Hache le mot de passe de l'utilisateur avant de le stocker dans la base de données.
 * @name pre-save
 * @function
 * @memberof module:User~User
 * @inner
 */
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Méthode virtuelle pour obtenir l'identifiant de l'entité User.
 * @name id
 * @memberof module:User~User
 * @type {mongoose.Types.ObjectId}
 */
userSchema.virtual("id").get(function () {
  return this._id;
});

/**
 * Configuration pour convertir les objets User en format JSON.
 */
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema);