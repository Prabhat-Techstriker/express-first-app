require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 2805,
    mongoUri: process.env.MONGO_URI,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
};