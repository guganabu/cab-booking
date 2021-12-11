import winston from 'winston';

module.exports = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        winston.format.printf(
            (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
    ),
});
