const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the admin route of the application',
    });
});

module.exports = router;