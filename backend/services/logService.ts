import winston from 'winston';
import { MongoDB } from 'winston-mongodb';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new MongoDB({
      db: process.env.MONGODB_URI as string,
      collection: 'logs',
      level: 'info',
    }),
  ],
});

export default logger;

