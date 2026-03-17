import winston from 'winston';

const uniqueFormat = winston.format.printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const createLogger = (serviceName) => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({ label: serviceName }),
      uniqueFormat
    ),
    defaultMeta: { service: serviceName },
    transports: [
      new winston.transports.File({ filename: 'all.log' }),
      new winston.transports.Console(),
    ],
  });
};