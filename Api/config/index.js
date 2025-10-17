module.exports = {
    PORT : process.env.PORT || 3000,
    CONNECTION_STRING: process.env.CONNECTION_STRING || 'mongodb://localhost:27017/AuthStarterKit',
    logLevel: process.env.LOG_LEVEL || 'info'
};
