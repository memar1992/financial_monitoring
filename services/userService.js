const pool = require('../db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async () => {
  const result = await pool.query('SELECT id, name, email FROM users');
  return result.rows;
};

exports.getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

exports.createUser = async (userData) => {
  const { name, email, password } = userData;
  const hashed = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hashed]
  );
  return result.rows[0];
};

exports.findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
