var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const login_controller = require("../src/controllers/auth");
const authMiddleware = require('../middleware/authMiddleware');
const User = require("../src/models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'fallback_cle_secrete';

// Ensure these values are securely configured, especially the CLIENT_SECRET
const CLIENT_ID = "33402681899-mc2qmmb3hr4lpifl3jr1rasl9ascr5mq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/users/google-callback";

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

router.post("/login", login_controller.login);
router.post("/register", login_controller.register);

// Google OAuth2 callback endpoint
router.get('/google-callback', async (req, res) => {
    console.log('Google callback route hit. Query params:', req.query);
    try {
      const code = req.query.code;
      if (!code) {
        return res.status(400).send('Authorization code is missing');
      }
  
      // Exchange code for tokens
      const { tokens } = await client.getToken({ code });
  
      // Verify the id_token and get user info
      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: CLIENT_ID,
      });
      const googleUser = ticket.getPayload();
  
      let isNewUser = false;
      let defaultCryptoPreferences = ['bitcoin', 'ethereum']; // Example default cryptos

      // Find or create user in your database
      let user = await User.findOne({ email: googleUser.email });
      if (!user) {
        user = new User({
          username: googleUser.name, 
          email: googleUser.email, 
          password: bcrypt.hashSync('someRandomPassword', 10),
          cryptos: defaultCryptoPreferences,
          role: 'user', // Default role
       
        });
        await user.save();
        isNewUser = true;
      }
      
  
      // Sign JWT token for user
      const jwtToken = jwt.sign({ user_id: user._id, isNewUser }, secretKey, { expiresIn: "1h" });
      // Redirect back to the frontend with the token
      // Redirect back to the frontend with the token
      res.redirect(`http://localhost:3001/login?token=${jwtToken}`);
    } catch (error) {
      console.error("Error in Google Callback:", error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.post('/google-login', async (req, res) => {
  
      try {
        const { token }  = req.body;
        if (!token) {
          return res.status(400).json({ error: 'No token provided' });
        }
        const googleUser = await authMiddleware.verifyGoogleToken(token);
        let user = await User.findOne({ mail: googleUser.email });
    
        if (!user) {
          const randomPassword = bcrypt.hashSync('random', 10); 
          
          user = new User({ username: googleUser.name, mail: googleUser.email, password: randomPassword });
          await user.save();
        }
    
        const jwtToken = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
    
        res.json({ token: jwtToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"+ error.message  });
      }
    });
  
  module.exports = router;