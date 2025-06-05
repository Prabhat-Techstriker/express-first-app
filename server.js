const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./database/db');
connectDB();
// Import routes
const userRoutes = require('./routes/user-route');
const homeRoutes = require('./routes/home-route');
const adminRoutes = require('./routes/admin-route');
const imageRoutes = require('./routes/image-route');

const app = express();
const port = process.env.PORT || 3000;
/* const cors = require('cors');
app.use(cors()); */
app.use(express.json());

app.use('/api/user', userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/image', imageRoutes);

const config = require('./config/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.connect(config.mongoUri)
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('MongoDB connection error:', err));

const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Process terminated!');
        mongoose.connection.close();
    });
});