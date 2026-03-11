const rateLimit = require('express-rate-limit');

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: RATE_LIMIT_MAX_REQUESTS,
    message: {
        success: false,
        code: 429,
        message: 'Too many requests from this IP, please try again later.',
        error: 'Rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: Math.max(1, Math.floor(RATE_LIMIT_MAX_REQUESTS * 0.05)),
    message: {
        success: false,
        code: 429,
        message: 'Too many authentication attempts, please try again later.',
        error: 'Authentication rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: Math.max(1, Math.floor(RATE_LIMIT_MAX_REQUESTS * 0.1)),
    message: {
        success: false,
        code: 429,
        message: 'Too many file uploads, please try again later.',
        error: 'Upload rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const searchLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: Math.max(1, Math.floor(RATE_LIMIT_MAX_REQUESTS * 0.3)),
    message: {
        success: false,
        code: 429,
        message: 'Too many search requests, please try again later.',
        error: 'Search rate limit exceeded'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    searchLimiter
};
