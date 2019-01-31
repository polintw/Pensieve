const { createLogger, format, transports } = require('winston');
const path = require("path");
const {envLogPath} = require('./.env.json');

const options = {
  fileErr: {
    level: 'warn',
    filename: path.join(__dirname, envLogPath.errorFile)
  },
  fileCombined: {
    level: 'debug',
    filename: path.join(__dirname, envLogPath.combinedFile)
  },
  fileException: {
    filename: path.join(__dirname, envLogPath.exceptionFile)
  },
  console: {
    level: 'warn',
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  },
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'corner' },
  transports: [
    new transports.File(options.fileErr),
    new transports.File(options.fileCombined),
    new transports.Console(options.console)
  ],
  exceptionHandlers: [
    new transports.File(options.fileException)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

logger.log('warn', 'winston.js test message %s, %s', 'first', 'second', { number: 123 });

module.exports = logger;
