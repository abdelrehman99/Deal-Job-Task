import express from 'express';
import Controller from './controller.js';
import authController from './../auth/controller.js';
import validator from '../common/validation.js';
import validationSchemas from './validationSchema.js';
const userRouter = express.Router();

userRouter.post(
  '/',
  authController.authenticate,
  validator(validationSchemas.createAdSchema),
  Controller.createAd
);

export default userRouter;
