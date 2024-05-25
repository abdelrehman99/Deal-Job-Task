import Joi from 'joi';
import { PROPERTIES } from '../common/constants.js';

const createAdSchema = {
  body: Joi.object({
    description: Joi.string().required(),
    price: Joi.number().required(),
    propertyType: Joi.string().valid(...PROPERTIES),
    area: Joi.string().required(),
    city: Joi.string().required(),
    district: Joi.string().required(),
  }).required(),
};

export default { createAdSchema };
