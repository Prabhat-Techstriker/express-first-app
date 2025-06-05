const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        logger.info('MongoDB is already connected');
        return;
    }

    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);

        const conn = await mongoose.connect(process.env.MONGO_URI);

        isConnected = true;
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
    isConnected = false;
});

process.on('SIGINT', async () => {
    if (isConnected) {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
    }
});

module.exports = connectDB;
