var express = require('express');
var router = express.Router();
var login_controller = require("../src/controllers/auth");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { verifyToken } = require('../middleware/authMiddleware');


// Configure Passport with your Google credentials
passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:3000/auth/google/callback" 
  },
  function(accessToken, refreshToken, profile, done) {
   User.findOrCreate({ googleId: profile.id }, function (err, user) {
     if (err) { 
       console.error(err);
       return done(err); 
      }
      if (!user) {
        user = new User({
          username: profile.displayName,
          mail: profile.emails[0].value,
          googleId: profile.id
        });
        user.save(function(err, savedUser) {
          if (err) {
            console.error(err);
            return done(err);
          }
          const token = jwt.sign({ user: savedUser }, secretKey, { expiresIn: "1h" });
          return done(null, { user: savedUser, token });
        });
      } else {
         const token = jwt.sign({ user: user }, secretKey, { expiresIn: "1h" });
         return done(null, { user: user, token });
        }
    });
  }
));

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
   // req.user will contain the user data from the GoogleStrategy callback
   const token = jwt.sign({ user: req.user }, secretKey, { expiresIn: "1h" });

   // Send the token to the client, or redirect as needed
   res.redirect(`http://localhost:3001?token=${token}`);
  }
);


// Existing routes
router.post("/login", login_controller.login);
router.post("/register", login_controller.register);
// Apply verifyToken middleware for other routes
router.use(verifyToken);  

module.exports = router;
