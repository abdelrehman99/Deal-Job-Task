import mongoose from 'mongoose';

import logger from './logger.js';

const connectionUrl =
  process.env.MONGO_URL || 'mongodb://localhost:27017/deal-app';

const mongooseConnectionOptions = {
  connectTimeoutMS: 360000,
  socketTimeoutMS: 360000,
};

mongoose.connect(connectionUrl, mongooseConnectionOptions);

mongoose.connection.on('error', (err) => {
  logger.error(`mongoose connection error: ${err}`);
});

async function initiateConnection() {
  logger.info('[mongoose.js] Connected successfully to MongoDB server');
  return mongoose.connect(connectionUrl, mongooseConnectionOptions);
}

export default initiateConnection;
