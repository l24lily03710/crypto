const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'fallback_cle_secrete';

const verifyToken = (req, res, next) => {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  token = token.replace('Bearer ', '');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = { verifyToken };
