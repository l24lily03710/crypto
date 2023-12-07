const express = require("express");
const expressListEndpoints = require('express-list-endpoints');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cryptoRouter = require("./routes/crypto");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/auth");
const authMiddleware = require('./middleware/authMiddleware');
const User = require('./src/models/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { verifyToken } = require('./middleware/authMiddleware');

// DB connection
var app = express();
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://admin:dGMpI8Dz614zQ9Xx@crypto.g1gwxfl.mongodb.net/", {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.error.bind(console, "MongoDB connection error:"));

// Passport Configuration for Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback" // Make sure this is an absolute URL
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Create a new user if one doesn't exist
        user = await User.create({
          username: profile.displayName,
          mail: profile.emails[0].value,
          googleId: profile.id
        });
      }
      return done(null, user); // Pass the user to the next middleware
    } catch (err) {
      return done(err, null);
    }
  }
));
// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// OAuth Route (Before applying verifyToken middleware)
app.use('/users', loginRouter);

// Apply verifyToken Middleware to Protected Routes
app.use(authMiddleware.verifyToken);

// Protected Routes
app.use("/users", verifyToken, userRouter);
app.use("/cryptos", verifyToken, cryptoRouter);

// List All Routes
console.log(expressListEndpoints(app));

module.exports = app;
