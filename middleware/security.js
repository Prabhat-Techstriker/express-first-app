const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

const securityMiddleware = (app) => {
    // Security headers
    app.use(helmet());

    // CORS
    app.use(cors());

    // Rate limiting
    app.use('/api', limiter);

    // Data sanitization against XSS
    app.use(xss());

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Body parser with size limit
    app.use(express.json({ limit: '10kb' }));
};

module.exports = securityMiddleware;