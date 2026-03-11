const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const encyptionKey = process.env.ENCRYPTION_KEY || 'default_key!';
const ivLength = 16;
const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify a password against its hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {Promise<boolean>} True if password matches hash
 */
const verifyHash = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error('Failed to verify password');
  }
};

/**
 * Generate a random salt
 * @returns {Promise<string>} Random salt
 */
const generateSalt = async () => {
  try {
    return await bcrypt.genSalt(SALT_ROUNDS);
  } catch (error) {
    throw new Error('Failed to generate salt');
  }
};

/**
 * Encrypt a data using crypto
 * @param {string} data - Plain text data
 * @returns {string} Encrypt data
 */
const encrypt = (data) => {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(encyptionKey), iv);
  let encrypted = cipher.update(data.toString());
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt a encrypted data using crypto
 * @param {string} data - Encrypted data
 * @returns {string} Decrypt data
 */
const decrypt = (data) => {
  const [ivHex, encryptedText] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedBuffer = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(encyptionKey), iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const generateMD5Hash = (data) => {
    const md5Hash = crypto.createHash('md5');
    md5Hash.update(data);
    return md5Hash.digest('hex');
}

module.exports = {
  hashPassword,
  verifyHash,
  generateSalt,
  SALT_ROUNDS,
  encrypt,
  decrypt,
  generateMD5Hash,
};
