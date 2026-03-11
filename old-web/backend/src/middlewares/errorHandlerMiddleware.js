const errorHandler = (err, req, res, next) => {
    const requestId = req.headers['x-request-id'] || 'unknown';
    
    console.error('Unhandled error occurred', {
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        errorCode: err.errorCode || 'INTERNAL_ERROR',
        url: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id || 'anonymous',
        requestId
    });
    
    let statusCode = err.statusCode || 500;
    
    if (err.name === 'ValidationError') {
        statusCode = 400;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
    } else if (err.name === 'ForbiddenError') {
        statusCode = 403;
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
    } else if (err.name === 'ConflictError') {
        statusCode = 409;
    } else if (err.name === 'RateLimitError') {
        statusCode = 429;
    }
    
    if (err.code && err.code.startsWith('ER_')) {
        console.error('Database error occurred', {
            errorCode: err.code,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage,
            sql: err.sql,
            requestId
        });
        
        if (process.env.NODE_ENV === 'production') {
            err.message = 'Database operation failed';
            err.stack = undefined;
        }
    }
    
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        console.error('JWT authentication error', {
            errorType: err.name,
            message: err.message,
            requestId
        });
    }
    
    if (statusCode === 429) {
        console.log('Rate limit exceeded', {
            ip: req.ip || req.connection.remoteAddress,
            url: req.originalUrl,
            method: req.method,
            requestId
        });
    }
    
    if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        console.log('File upload error', {
            errorCode: err.code,
            message: err.message,
            requestId
        });
    }
    
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
        console.error('Network connection error', {
            errorCode: err.code,
            message: err.message,
            requestId
        });
    }
    
    res.status(statusCode).json({
        success: false,
        code: statusCode,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        ...(process.env.NODE_ENV === 'development' && { 
            timestamp: new Date().toISOString(),
            requestId 
        })
    });
};

module.exports = { errorHandler };