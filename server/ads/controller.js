import Ads from './model.js';
import logger from '../../config/logger.js';
import Users from '../users/model.js';
import { ADMIN, AGENT } from '../common/constants.js';
/**
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const createAd = async (req, res, next) => {
  try {
    const user = req.user;
    const { description, price, propertyType, area, city, district } = req.body;

    if (user.role != ADMIN && user.role != AGENT) {
      res.status(401).json({
        status: 'failed',
        message: 'This user is not allowed to perform this operation',
      });
    }

    const property = await Ads.create({
      description,
      price,
      propertyType,
      area,
      city,
      district,
      owner: {
        userId: user._id,
        userName: user.name,
      },
    });

    // update user ads
    await Users.findByIdAndUpdate(
      { _id: user._id },
      {
        $push: {
          ads: {
            adId: property._id,
            propertyType: property.type,
          },
        },
      }
    );

    res.status(200).json({
      status: 'success',
      data: property,
    });
  } catch (err) {
    console.log(err);
    logger.error(`[createProperty] error occurred ${err}`);

    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

export default { createAd };
