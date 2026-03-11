const User = require('../models/User');
const { hashPassword, verifyHash } = require('../utils/encryption');
const { generateJwtToken } = require('../utils/jwtHelper');

class UserService {
  async createUser(userData) {
    const { username, password, email } = userData;
    
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      const error = new Error('Username already exists');
      error.statusCode = 409;
      throw error;
    }
    
    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        const error = new Error('Email already exists');
        error.statusCode = 409;
        throw error;
      }
    }
    
    const hashedPassword = await hashPassword(password);
    
    const user = await User.create({
      username,
      password: hashedPassword,
      email
    });
    
    return user;
  }

  async authenticateUser(username, password) {
    const user = await User.findByUsername(username);
    
    if (!user) {
      const error = new Error('Invalid username or password');
      error.statusCode = 401;
      throw error;
    }
    
    const isPasswordValid = await verifyHash(password, user.password);
    
    if (!isPasswordValid) {
      const error = new Error('Invalid username or password');
      error.statusCode = 401;
      throw error;
    }
    
    await User.updateLastLogin(user.id);
    
    const token = generateJwtToken({
      userId: user.id,
      username: user.username,
      role: user.role || null
    });
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || null
      },
      token
    };
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  async updateUser(userId, updateData) {
    const user = await User.update(userId, updateData);
    return user;
  }

  async deleteUser(userId) {
    const result = await User.delete(userId);
    return result;
  }

  async initializeTables() {
    await User.createTable();
  }
}

module.exports = new UserService();
