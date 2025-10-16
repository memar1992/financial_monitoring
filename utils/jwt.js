const jwt = require('jsonwebtoken');
const SECRET = 'my_super_secret'; // change to env var later

exports.generateToken = (user) => {
  return jwt.sign(user, SECRET, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
