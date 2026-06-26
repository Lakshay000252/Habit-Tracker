const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire, jwtRefreshSecret, jwtRefreshExpire } = require('../config/jwt');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpire });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, jwtRefreshSecret, { expiresIn: jwtRefreshExpire });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, jwtRefreshSecret);
};

module.exports = { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken };
