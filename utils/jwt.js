const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET; // change to env var later

exports.generateToken = (user) => {
  return jwt.sign(user, SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
