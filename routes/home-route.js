const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
router.get('/welcome', authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the home route of the application',
    });
});

module.exports = router;