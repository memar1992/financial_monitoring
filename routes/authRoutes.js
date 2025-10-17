const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', code: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials', code: 401 });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, code: 500 });
  }
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await userService.createUser({ name, email, password });
    const token = generateToken({ id: user.id, name: user.name, email: user.email });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, code: 500 });
  }
});

module.exports = router;
