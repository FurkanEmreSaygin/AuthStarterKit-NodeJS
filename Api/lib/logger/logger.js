const {format, createLogger, transports} = require('winston');
const {LOG_LEVELS} = require("../../config/Enum");

const formats = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.simple(),
  format.splat(),
  format.printf((info) => {
    const logData = info.message || info;
    return `${info.timestamp} ${info.level}: ${info.level.toUpperCase()}: [email: ${logData.email}] [location: ${logData.location}] [proc_type: ${logData.proc_type}] ${logData.log}`;
  })
);
const logger = createLogger({
  level: LOG_LEVELS.DEBUG,
  transports: [new transports.Console({ format: formats })],
});
module.exports = logger;