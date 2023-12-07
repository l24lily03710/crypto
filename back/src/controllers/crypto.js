const UserFavoriteCrypto = require("../models/user_favorite_crypto");

const { validationResult } = require("express-validator");

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

exports.getById = [
  checkValidity,
  (req, res, next) => {
    UserFavoriteCrypto.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

exports.create = [
  (req, res, next) => {
    const { user_id, crypto_name } = req.body;

    const newUserFavoriteCrypto = new UserFavoriteCrypto({
      user_id,
      crypto_name
    });

    newUserFavoriteCrypto.save((err, savedEntry) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur lors de la création de l\'entrée dans la table UserFavoriteCrypto' });
      }

      res.status(201).json(savedEntry);
    });
  }
];

exports.delete = [
  checkValidity,
  (req, res, next) => {
    UserFavoriteCrypto.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Crypto with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Crypto deleted successfully !");
    });
  },
];

exports.getAll = (req, res, next) => {
  UserFavoriteCrypto.find().exec(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};
