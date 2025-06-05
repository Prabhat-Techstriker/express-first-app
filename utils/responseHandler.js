class ResponseHandler {
    // Success response
    static success(res, { data = null, message = 'Success' }) {
        return res.status(200).json({
            status: 'success',
            message,
            data
        });
    }

    // Error response with better error handling
    static error(res, { message = 'Error occurred', statusCode = 500, errors = null }) {
        // Convert single error message to errors object format

        return res.status(statusCode).json({
            status: 'error',
            message,
            errors: errors
        });
    }
}

module.exports = ResponseHandler;