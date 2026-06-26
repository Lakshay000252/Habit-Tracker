const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

let isConnected = false;
let mongoServer = null;

const testConnection = async (uri) => {
  try {
    const conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    }).asPromise();
    await conn.close();
    return true;
  } catch {
    return false;
  }
};

const startInMemoryMongo = async () => {
  logger.info('No external MongoDB configured. Starting in-memory MongoDB...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'habitai' } });
    const uri = mongoServer.getUri();
    logger.info('In-memory MongoDB started');
    return uri;
  } catch (err) {
    logger.error('Failed to start in-memory MongoDB:', err.message);
    logger.warn('Server will continue without database. Auth endpoints will return 503.');
    return null;
  }
};

const getMongoURI = async () => {
  if (process.env.MONGO_URI && !process.env.MONGO_URI.includes('<username>')) {
    const valid = await testConnection(process.env.MONGO_URI);
    if (valid) return process.env.MONGO_URI;
    logger.warn('MONGO_URI from .env is not reachable, falling back to in-memory MongoDB');
  }

  const uriFilePath = path.join(__dirname, '..', '.mongodb_uri');
  if (fs.existsSync(uriFilePath)) {
    const savedUri = fs.readFileSync(uriFilePath, 'utf8').trim();
    if (savedUri) {
      const valid = await testConnection(savedUri);
      if (valid) return savedUri;
      logger.warn('Saved MongoDB URI is stale, starting new in-memory MongoDB');
      fs.unlinkSync(uriFilePath);
    }
  }

  return startInMemoryMongo();
};

const connectDB = async () => {
  if (isConnected) return;
  try {
    mongoose.set('bufferCommands', false);
    const uri = await getMongoURI();
    if (!uri) {
      logger.warn('No MongoDB URI available. Server will run without database.');
      return;
    }
    console.log('MONGO_URI exists:', !!uri);
    console.log('Attempting MongoDB connection...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB Connected Successfully');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<username>')) {
      const uriFilePath = path.join(__dirname, '..', '.mongodb_uri');
      try {
        const currentUri = fs.readFileSync(uriFilePath, 'utf8').trim();
        if (currentUri !== uri) {
          fs.writeFileSync(uriFilePath, uri);
        }
      } catch {
        fs.writeFileSync(uriFilePath, uri);
      }
    }
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    logger.warn('Server will continue running without database connection.');
  }
};

const getConnectionStatus = () => mongoose.connection.readyState === 1;

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = connectDB;
module.exports.getConnectionStatus = getConnectionStatus;
module.exports.closeDB = closeDB;
