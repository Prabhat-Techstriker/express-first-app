const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AppError = require('../utils/AppError');
const { response } = require('express');
const { success } = require('../utils/responseHandler');
const bcrypt = require("bcryptjs");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new AppError('User no longer exists', 401);
        }

        // Add user info to request
        req.userInfoData = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        // next(error);
        //  Handle the error and send a response
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ success: false, message: 'Invalid token!!!' });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ success: false, message: 'Token has expired!!!' });
        } else if (error instanceof AppError) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};

module.exports = authMiddleware;