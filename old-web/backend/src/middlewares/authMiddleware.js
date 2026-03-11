const { verifyJwtToken } = require('../utils/jwtHelper');
const { errMsg } = require('../utils/helper');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errMsg({
        code: 401,
        message: "Access token required",
        error: "No token provided"
      }));
    }

    try {
      const decoded = verifyJwtToken(token);
      req.user = decoded;
      next();
    } catch (tokenError) {
      return res.status(401).json(errMsg({
        code: 401,
        message: "Invalid or expired token",
        error: tokenError.message
      }));
    }

  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json(errMsg({
      code: 500,
      message: "Authentication failed",
      error: "Internal server error"
    }));
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyJwtToken(token);
        req.user = decoded;
      } catch (tokenError) {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(errMsg({
        code: 401,
        message: "Authentication required",
        error: "No user found"
      }));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(errMsg({
        code: 403,
        message: "Insufficient permissions",
        error: "Role not authorized"
      }));
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole
};
