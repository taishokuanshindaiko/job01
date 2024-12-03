import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
  base: {
    env: process.env.NODE_ENV,
  },
});

export const log = {
  info: (message: string, data?: object) => {
    logger.info(data, message);
  },
  error: (message: string, error?: Error | unknown) => {
    logger.error(
      {
        err: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error
      },
      message
    );
  },
  warn: (message: string, data?: object) => {
    logger.warn(data, message);
  },
  debug: (message: string, data?: object) => {
    logger.debug(data, message);
  },
};