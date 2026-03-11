const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @returns {string} JWT token
 */
const generateJwtToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'api',
      audience: 'user'
    });
  } catch (error) {
    throw new Error('Failed to generate JWT token');
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'api',
      audience: 'user'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
const decodeJwtToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode JWT token');
  }
};

module.exports = {
  generateJwtToken,
  verifyJwtToken,
  decodeJwtToken,
  JWT_SECRET,
  JWT_EXPIRES_IN
};
