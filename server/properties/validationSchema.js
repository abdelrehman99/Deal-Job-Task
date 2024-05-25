import Joi from 'joi';
import { PROPERTIES } from '../common/constants.js';

const createPropertySchema = {
  body: Joi.object({
    description: Joi.string().required(),
    price: Joi.number().required(),
    propertyType: Joi.string().valid(...PROPERTIES),
    area: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
  }).required(),
};

const updatePropertySchema = {
  body: Joi.object({
    propertyId: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    area: Joi.string().required(),
  }).required(),
};

export default { createPropertySchema, updatePropertySchema };
