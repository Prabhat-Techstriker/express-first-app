const { validationResult } = require('express-validator');
const ResponseHandler = require('../utils/responseHandler');

const validateRequest = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        for (let validation of validations) {
            const result = await validation.run(req);
            // console.log('Validation result:', result);
            if (!result.isEmpty()) break;
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            const errorMessages = errors.array()
            const fieldErrors = {};
            errorMessages.forEach(error => {
                if (!fieldErrors[error.path]) {
                    fieldErrors[error.path] = [];
                }
                fieldErrors[error.path].push(error.msg);
            });

            return ResponseHandler.error(
                res,
                {
                    message: 'Validation error',
                    statusCode: 400,
                    errors: fieldErrors
                }
            );
        }
        next();
    };
};

module.exports = validateRequest;