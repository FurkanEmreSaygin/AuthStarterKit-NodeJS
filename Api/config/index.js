module.exports = {
  PORT: process.env.PORT || 3000,
  CONNECTION_STRING:
    process.env.CONNECTION_STRING || "mongodb://localhost:27017/AuthStarterKit",
  logLevel: process.env.LOG_LEVEL || "info",
  JWT: {
    SECRET: process.env.JWT_SECRET || "your_default_jwt_secret",
    EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24 * 60 * 60, 
  },
  DEFAULT_LANG: process.env.DEFAULT_LANG || "en",
};
