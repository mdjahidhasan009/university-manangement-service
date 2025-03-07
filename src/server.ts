import mongoose from 'mongoose';
import app from './app';
import config from './config';
// import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';
import { RedisClient } from './shared/redis';
import subscribeToEvents from './app/events';

process.on('uncaughtException', error => {
  // errorLogger.error(error);
  console.info(error);
  process.exit(1);
});

let server: Server;

const boostrap = async () => {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });
    await mongoose.connect(config.database_url as string);
    // logger.info('Database is connected successfully');

    server = app.listen(config.port, () =>
      // logger.info(`Server is running on port = `, config.port)
      console.info(`Server is running on port = `, config.port)
    );
  } catch (e) {
    // errorLogger.error('Failed to connect database', e);
    // eslint-disable-next-line no-console
    console.error('Failed to connect database', e);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        // errorLogger.error(error);
        console.info(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
};

// process.on('SIGTERM', () => {
//   logger.info('SIGTERM is received');
//   // if (server) {
//   //   server.close()
//   // }
// });

boostrap();
