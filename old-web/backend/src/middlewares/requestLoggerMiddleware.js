const { v4: uuidv4 } = require('uuid');
const fileLogger = require('../utils/fileLogger');

const ENABLE_REQUEST_LOGGING = process.env.ENABLE_REQUEST_LOGGING !== 'false';
const ENABLE_RESPONSE_LOGGING = process.env.ENABLE_RESPONSE_LOGGING !== 'false';
const LOG_INFO_TO_FILE = process.env.LOG_INFO_TO_FILE === 'true';

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    if (!req.headers['x-request-id']) {
        req.headers['x-request-id'] = uuidv4();
    }
    
    if (ENABLE_REQUEST_LOGGING) {
        const requestLog = {
            timestamp: new Date().toISOString(),
            requestId: req.headers['x-request-id'],
            method: req.method,
            url: req.originalUrl,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            userId: req.user?.id || 'anonymous',
            headers: {
                ...req.headers,
                authorization: req.headers.authorization ? '[REDACTED]' : undefined,
                cookie: req.headers.cookie ? '[REDACTED]' : undefined
            }
        };
        
        if (req.body && Object.keys(req.body).length > 0) {
            const sanitizedBody = { ...req.body };
            const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
            
            sensitiveFields.forEach(field => {
                if (sanitizedBody[field]) {
                    sanitizedBody[field] = '[REDACTED]';
                }
            });
            
            requestLog.body = sanitizedBody;
        }
        
        console.log('Incoming request', requestLog, req.headers['x-request-id']);
        if (LOG_INFO_TO_FILE) {
            fileLogger.request('Incoming request', requestLog);
        }
    }
    
    if (ENABLE_RESPONSE_LOGGING) {
        const originalJson = res.json;
        res.json = function(data) {
            const responseTime = Date.now() - start;
            const responseLog = {
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'],
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                responseTime,
                responseSize: JSON.stringify(data).length,
                response: {
                    ...data,
                    token: data.token ? '[REDACTED]' : undefined,
                    password: data.password ? '[REDACTED]' : undefined
                }
            };
            
            if (res.statusCode >= 400) {
                console.log('API response', responseLog, req.headers['x-request-id']);
                if (LOG_INFO_TO_FILE) {
                    fileLogger.response('API response (error)', responseLog);
                }
            } else {
                console.log('API response', responseLog, req.headers['x-request-id']);
                if (LOG_INFO_TO_FILE) {
                    fileLogger.response('API response', responseLog);
                }
            }
            
            if (responseTime > 1000) { // > 1 second
                console.warn('Slow API response detected', {
                    url: req.originalUrl,
                    method: req.method,
                    responseTime,
                    threshold: 1000
                }, req.headers['x-request-id']);
                if (LOG_INFO_TO_FILE) {
                    fileLogger.warn('Slow API response detected', {
                        url: req.originalUrl,
                        method: req.method,
                        responseTime,
                        threshold: 1000,
                        requestId: req.headers['x-request-id']
                    }, 'response');
                }
            }
            
            return originalJson.call(this, data);
        };
    }
    
    next();
};

module.exports = { requestLogger };
