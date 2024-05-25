import express from 'express';
import Controller from './controller.js';
import validator from '../common/validation.js';
import validationSchemas from './validationSchema.js';
import authController from './../auth/controller.js';
const propertiesRouter = express.Router();

propertiesRouter.get(
  '/:id',
  authController.authenticate,
  Controller.matchProperty
);

propertiesRouter.post(
  '/',
  authController.authenticate,
  validator(validationSchemas.createPropertySchema),
  Controller.createProperty
);

propertiesRouter.patch(
  '/',
  authController.authenticate,
  validator(validationSchemas.updatePropertySchema),
  Controller.updateProperty
);

export default propertiesRouter;
