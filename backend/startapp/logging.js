const winston = require('winston');

module.exports = () => {
  // Handel uncaughtException with winston
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
  );

  // handle unhandled rejection using winston
  process.on('unhandledRejection', (ex) => {
    // this will throw an unhandled rejection and
    // above winston.handleExceptions code will catch it
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
};
