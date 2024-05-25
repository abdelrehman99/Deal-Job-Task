import Properties from './model.js';
import Users from '../users/model.js';
import Ads from '../ads/model.js';
import logger from '../../config/logger.js';
import { ADMIN, AGENT, CLIENT } from '../common/constants.js';

/**
 * @param {import('express').Request<{}, {}, showRequestBody, showRequestQuery>} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

const createProperty = async (req, res, next) => {
  try {
    const user = req.user;
    const { description, price, propertyType, area, city, district } = req.body;

    if (user.role != ADMIN && user.role != CLIENT)
      res.status(401).json({
        status: 'failed',
        message: 'This user is not allowed to perform this operation',
      });

    const property = await Properties.create({
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

    // update user properties
    await Users.findByIdAndUpdate(
      { _id: user._id },
      {
        $push: {
          Properties: {
            propertyId: property._id,
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

const updateProperty = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user._id);
    if (user.role != ADMIN && user.role != CLIENT)
      res.status(401).json({
        status: 'failed',
        message: 'This user is not allowed to perform this operation',
      });

    const { description, price, area, propertyId } = req.body;

    const property = await Properties.findOneAndUpdate(
      { _id: propertyId, 'owner.userId': user._id },
      {
        description,
        price,
        area,
        refreshedAt: new Date(),
      },
      { new: true }
    );

    if (!property) {
      res.status(401).json({
        status: 'failed',
        message: 'This property request does not exist.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: property,
    });
  } catch (err) {
    logger.error(`[updateProperty] error occurred ${err}`);

    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

export const matchProperty = async (req, res, next) => {
  try {
    const adId = req.params.id;
    let { page = 0, limit = 0 } = req.query;
    const user = req.user;
    page = Number(page);
    limit = Number(limit);

    if (user.role != ADMIN && user.role != CLIENT)
      res.status(401).json({
        status: 'failed',
        message: 'This user is not allowed to perform this operation',
      });

    const ad = await Ads.findById(adId).lean();

    if (user.role != AGENT && user.role != ADMIN)
      if (!ad) {
        res.status(403).json({
          status: 'failed',
          message: 'This ad does not exist!',
        });
      }

    const { district, price, area } = ad;

    const lowerPrice = Math.ceil(price * 0.9);
    const upperPrice = Math.floor(price * 1.1);

    const filters = {
      district,
      area,
      $and: [{ price: { $gte: lowerPrice } }, { price: { $lte: upperPrice } }],
    };

    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: filters,
      },
      {
        $facet: {
          data: [{ $sort: { refreshedAt: -1 } }],
          count: [
            {
              $count: 'totalDocuments',
            },
          ],
        },
      },
    ];

    if (limit > 0) {
      if (skip > 0) {
        pipeline[1].$facet.data.push({
          $skip: skip,
        });
      }
      pipeline[1].$facet.data.push({
        $limit: limit,
      });
    }

    const properties = await Properties.aggregate(pipeline);
    const count = properties[0].count[0].totalDocuments;
    const data = properties[0].data;

    res.status(200).json({
      status: 'success',
      total: count,
      page,
      limit,
      hasNextPage: page * limit < count,
      hasPreviousPage: page > 1,
      data,
    });
  } catch (err)
  {
    console.error(err)
    logger.error(`[matchProperty] error occurred ${err}`);

    res.status(500).json({
      status: 'failed',
      message: err.message,
    });
  }
};

export default { createProperty, updateProperty, matchProperty };
