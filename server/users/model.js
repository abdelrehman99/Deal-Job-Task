import { model, Schema } from 'mongoose';
import { ROLES, USER_STATUSES } from '../common/constants.js';
import bcrypt from 'bcrypt';
import nanoid from '../../config/nanoid.js';

const adsSchema = new Schema(
  {
    adId: String,
    propertyType: String,
  },
  { _id: false }
);

const propertiesSchema = new Schema(
  {
    propertyId: String,
    propertyType: String,
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      required: true,
      default: 'ACTIVE',
    },
    password: {
      type: String,
      select: false,
    },
    ads: [adsSchema],
    properties: [propertiesSchema],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const Users = model('users', userSchema);

export default Users;
