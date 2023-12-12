/**
 * Contrôleur gérant les opérations CRUD pour les utilisateurs.
 * Comprend la validation des données, la gestion des erreurs et les opérations sur la base de données.
 * @module UserController
 */

const User = require("../models/user");
const bcrypt = require("bcrypt");
const UserCrypto = require("../models/userCryptos");
const geckoApi = require("../../services/geckoApi");
const { body, validationResult } = require("express-validator");

/**
 * Règles de validation pour la création et la mise à jour des utilisateurs.
 * @function
 * @name userValidationRules
 * @memberof module:UserController
 * @inner
 * @returns {Array} - Tableau de règles de validation Express.
 */
const userValidationRules = () => {
  return [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Username must be specified."),

    body("mail")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Mail must be specified."),
  ];
};

/**
 * Middleware pour vérifier la validité des règles de validation.
 * @function
 * @name checkValidity
 * @memberof module:UserController
 * @inner
 * @param {Object} req - Objet représentant la requête HTTP.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {function} next - Fonction pour passer au middleware suivant.
 * @returns {Object} - Réponse JSON indiquant les erreurs de validation le cas échéant.
 */
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

/**
 * Récupère tous les utilisateurs de la base de données.
 * @function
 * @name getAll
 * @memberof module:UserController
 * @inner
 * @param {Object} req - Objet représentant la requête HTTP.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {function} next - Fonction pour passer au middleware suivant.
 * @returns {Object} - Réponse JSON contenant les utilisateurs.
 */
exports.getAll = (req, res, next) => {
  User.find().exec(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

/**
 * Récupère un utilisateur par son identifiant.
 * @function
 * @name getById
 * @memberof module:UserController
 * @inner
 * @param {Object} req - Objet représentant la requête HTTP avec le paramètre d'identifiant.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {function} next - Fonction pour passer au middleware suivant.
 * @returns {Object} - Réponse JSON contenant l'utilisateur.
 */
exports.getById = [
  checkValidity,
  (req, res, next) => {
    User.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

/**
 * Met à jour un utilisateur existant.
 * @function
 * @name update
 * @memberof module:UserController
 * @inner
 * @param {Object} req - Objet représentant la requête HTTP avec le corps de la requête.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {function} next - Fonction pour passer au middleware suivant.
 * @returns {Object} - Réponse JSON indiquant le résultat de la mise à jour.
 */
exports.update = async (req, res) => {
  const userId = req.params.id; // Supposons que l'ID de l'utilisateur soit passé dans les paramètres de l'URL
  const { username, mail, password, cryptoFavorites, role } = req.body;


  try {

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Supprimer les entrées existantes dans la table pivot UserCrypto
    await UserCrypto.deleteMany({ userId });

    // Mettre à jour les crypto-monnaies favorites
    if (cryptoFavorites && cryptoFavorites.length > 0) {
      try {
        const cryptoDetailsPromises = cryptoFavorites.map(
          geckoApi.getCoinDetails
        );
        const cryptoDetails = await Promise.all(cryptoDetailsPromises);

        const userCryptoEntries = cryptoDetails.map((crypto) => ({
          userId: userId,
          cryptoId: crypto.id,
        }));

        await UserCrypto.insertMany(userCryptoEntries);
      } catch (error) {
        console.error("Error fetching crypto details:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    // Mettre à jour les autres champs de l'utilisateur
    const updateFields = {};
    updateFields.cryptos = cryptoFavorites;
    if (role) updateFields.role = role;
    if (username) updateFields.username = username;
    if (mail) updateFields.mail = mail;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // Effectuer la mise à jour de l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true, // Pour obtenir le document mis à jour plutôt que l'ancien
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Supprime un utilisateur par son identifiant.
 * @function
 * @name delete
 * @memberof module:UserController
 * @inner
 * @param {Object} req - Objet représentant la requête HTTP avec le paramètre d'identifiant.
 * @param {Object} res - Objet représentant la réponse HTTP.
 * @param {function} next - Fonction pour passer au middleware suivant.
 * @returns {Object} - Réponse JSON indiquant le résultat de la suppression.
 */
exports.delete = [
  checkValidity,
  async (req, res, next) => {
    try {
      // Supprimer les entrées dans la table pivot UserCrypto
      await UserCrypto.deleteByUserId(req.params.id);

      // Supprimer l'utilisateur
      const result = await User.findByIdAndRemove(req.params.id).exec();

      if (!result) {
        return res.status(404).json("User with id " + req.params.id + " is not found !");
      }

      return res.status(200).json("User deleted successfully !");
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

exports.getAllFavoriteCryptos = async (req, res, next) => {
  try {
    const cryptoDetails = await UserCrypto.find();
    res.status(200).json(cryptoDetails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur interne" });
  }
};