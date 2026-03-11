const UserService = require('../services/UserService');
const { msg } = require('../utils/helper');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const result = await UserService.authenticateUser(username, password);

      return res.status(200).json(msg({
        data: result,
        message: "Login successful"
      }));
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;

      const user = await UserService.createUser({ username, password, email });

      return res.status(201).json(msg({
        data: user,
        message: "User registered successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const user = await UserService.getUserById(userId);

      return res.status(200).json(msg({
        data: user,
        message: "Profile retrieved successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      delete updateData.password;
      delete updateData.username;

      const user = await UserService.updateUser(userId, updateData);

      return res.status(200).json(msg({
        data: user,
        message: "Profile updated successfully"
      }));
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req, res, next) {
    try {
      return res.status(200).json(msg({
        data: { valid: true, user: req.user },
        message: "Token is valid"
      }));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
