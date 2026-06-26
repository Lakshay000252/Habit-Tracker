module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '90d',
};
