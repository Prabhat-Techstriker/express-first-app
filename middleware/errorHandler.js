const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    // Log error
    logger.error({
        message: err.message,
        // stack: err.stack,
        path: req.path,
        // method: req.method
    });

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return ResponseHandler.error(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return ResponseHandler.error(res, 'Token expired', 401);
    }

    // MongoDB Errors
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return ResponseHandler.error(res, 'Validation Error', 400, errors);
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return ResponseHandler.error(res, `Duplicate ${field}`, 400);
    }

    // Production vs Development
    if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            return ResponseHandler.error(res, err.message, err.statusCode);
        }
        return ResponseHandler.error(res, 'Something went wrong', 500);
    }

    // Development error - send full error
    return ResponseHandler.error(
        res,
        err.message,
        err.statusCode,
        { stack: err.stack }
    );
};

module.exports = errorHandler;