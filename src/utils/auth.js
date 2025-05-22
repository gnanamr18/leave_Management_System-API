const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Hash a password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with a hash
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password
 * @returns {Promise<boolean>} - True if the password matches the hash
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token
 * @param {Object} payload - The payload to include in the token
 * @returns {string} - The JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken
}; 