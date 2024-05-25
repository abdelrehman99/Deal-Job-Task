import { model, Schema } from 'mongoose';
import { PROPERTIES } from '../common/constants.js';
import nanoid from '../../config/nanoid.js';

const userSchema = new Schema(
  {
    userId: String,
    userName: String,
  },
  { _id: false }
);

const adsSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      enum: PROPERTIES,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    refreshedAt: {
      type: Date,
      default: new Date(),
    },
    owner: userSchema,
  },
  { timestamps: true }
);

const Ads = model('ads', adsSchema);

export default Ads;
