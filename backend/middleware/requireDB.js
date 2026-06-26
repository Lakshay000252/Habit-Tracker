const { getConnectionStatus } = require('../config/db');

const requireDB = (req, res, next) => {
  if (!getConnectionStatus()) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Please set a valid MONGO_URI in .env and restart the server.',
    });
  }
  next();
};

module.exports = requireDB;
