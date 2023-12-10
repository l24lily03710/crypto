const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'fallback_cle_secrete';
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = "33402681899-mc2qmmb3hr4lpifl3jr1rasl9ascr5mq.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

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
async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      
    });
    const payload = ticket.getPayload();
    return payload;
};
module.exports = { verifyToken, verifyGoogleToken };
