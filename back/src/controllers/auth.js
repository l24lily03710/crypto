const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const geckoApi = require("../../services/geckoApi");
const UserCrypto = require("../models/userCryptos");

// secret key from .env
dotenv.config();
const secretKey = process.env.SECRET_KEY;

/**
 * Fonction de connexion des utilisateurs.
 * Elle vérifie si l'adresse e-mail et le mot de passe fournis correspondent à un utilisateur enregistré.
 * Si les informations sont valides, génère un jeton JWT pour l'utilisateur.
 *
 * @param {*} req - La requête HTTP entrante avec les informations de connexion.
 * @param {*} res - La réponse HTTP à renvoyer.
 * @returns {Object} - L'identifiant de l'utilisateur et le jeton JWT en cas de succès.
 */

exports.login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail });

    if (!user || !bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    jwt.sign({ user: user }, secretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const { _id: user_id } = user;

        res.json({
          user_id,
          token,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Fonction d'inscription des utilisateurs.
 * Elle vérifie si l'adresse e-mail en paramètre existe déjà. Sinon, elle crée un utilisateur
 * et lui ajoute, s'ils existent, les cryptos préférées de l'utilisateur.
 *
 * @param {*} req - La requête HTTP entrante.
 * @param {*} res - La réponse HTTP à renvoyer.
 * @returns {Object} - L'utilisateur créé avec ses informations.
 */
exports.register = async (req, res) => {
  const { username, mail, password, cryptoFavorites, role } = req.body;

  try {
    const existingUser = await User.findOne({ mail });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser = new User({ username, mail, password, role });

    if (cryptoFavorites && cryptoFavorites.length > 0) {
      try {
        const cryptoDetailsPromises = cryptoFavorites.map(
          geckoApi.getCoinDetails
        );
        const cryptoDetails = await Promise.all(cryptoDetailsPromises);
        
        newUser.cryptos = cryptoDetails.map((crypto) => crypto.id);

        const userCryptoEntries = cryptoDetails.map((crypto) => ({
          userId: newUser._id,
          cryptoId: crypto.id,
        }));

        await UserCrypto.insertMany(userCryptoEntries);
      } catch (error) {
        console.error("Error fetching crypto details:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    const savedUser = await newUser.save();

    jwt.sign(
      { user: savedUser },
      secretKey,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          const { _id: user_id } = savedUser;

          res.json({
            user_id,
            token,
          });
        }
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
