const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// secret key from .env
dotenv.config();
const secretKey = process.env.SECRET_KEY;

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
        res.json({
          token,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.register = async (req, res) => {
  const { username, mail, password } = req.body;

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const newUser = new User({ username, mail, password });
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
          res.json({
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
