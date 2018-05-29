const winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      // new (winston.transports.Console)(),
      // new (winston.transports.File)({ filename: 'somefile.log' })
    ]
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    // logger.add(new winston.transports.Console());
    logger.add(winston.transports.Console, {'timestamp': true});
}

module.exports.logger = logger;