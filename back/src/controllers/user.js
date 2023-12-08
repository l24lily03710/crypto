const User = require("../models/user");

const { param, body, validationResult } = require("express-validator");

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

exports.create = [
  userValidationRules(),
  checkValidity,
  async (req, res, next) => {
    try {
      // Vérifiez si l'utilisateur existe déjà avec la même adresse e-mail
      const existingUser = await User.findOne({ mail: req.body.mail });

      if (existingUser) {
        // L'utilisateur existe déjà, renvoyez une réponse indiquant qu'il existe
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      // Si l'utilisateur n'existe pas encore, créez-le
      const user = new User({
        username: req.body.username,
        mail: req.body.mail,
        password: req.body.password,
      });

      await user.save();
      return res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

exports.getAll = (req, res, next) => {
  User.find().exec(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

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

exports.update = [
  userValidationRules(),
  checkValidity,
  async (req, res, next) => {
    try {
      const existingUser = await User.findById(req.params.id);

      if (!existingUser) {
        return res
          .status(404)
          .json({ error: `User with id ${req.params.id} is not found!` });
      }

      if (req.body.mail && req.body.mail !== existingUser.mail) {
        const emailExists = await User.findOne({ mail: req.body.mail });

        if (emailExists) {
          return res
            .status(409)
            .json({ error: "Email already exists for another user." });
        }
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        existingUser.password = hashedPassword;
      }

      existingUser.username = req.body.username || existingUser.username;
      existingUser.mail = req.body.mail || existingUser.mail;
      existingUser.save();

      return res.status(200).json({ message: "User updated successfully!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

exports.delete = [
  checkValidity,
  (req, res, next) => {
    User.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("User with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("User deleted successfully !");
    });
  },
];
