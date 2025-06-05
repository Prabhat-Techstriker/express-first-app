const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const validateRequest = require('../middleware/validationRequest');
const { registerValidation, loginValidation } = require('../validations/userValidation');
const errorHandler = require('../middleware/errorHandler');
const authMiddleware = require('../middleware/auth-middleware')
// all route to relearted to user and authentication

router.post('/register', validateRequest(registerValidation), userController.register);
router.post('/login', validateRequest(loginValidation), userController.login);
router.post('/change-password', authMiddleware, userController.changePassword);

// Error handling middleware
router.use(errorHandler);

module.exports = router;