import dotenv from 'dotenv';
import express from 'express';
import logger from '../config/logger.js';
import initiateMongoConnection from '../config/mongo.js';
import app from './app.js'
console.log(process.env.NODE_ENV);
dotenv.config({ path: `./.${process.env.NODE_ENV}.env` });

await initiateMongoConnection();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
});
