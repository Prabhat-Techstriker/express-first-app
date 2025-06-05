const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
    try {
        console.log("req.userInfo----->", req.userInfoData);

        if (req.userInfoData.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied. Access by Admins only.' });
        }

        next();
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}


module.exports = adminMiddleware;