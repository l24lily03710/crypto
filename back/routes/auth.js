var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var login_controller = require("../src/controllers/auth");
const authMiddleware = require('../middleware/authMiddleware');
const User = require("../src/models/user");
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'fallback_cle_secrete';


router.post("/login", login_controller.login);
router.post("/register", login_controller.register);

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