import db from "../models/index";
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";


//Pagination
let getAllProductService = (limit, page, sort, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      if (!limit) limit = +process.env.LIMIT_MANAGE;
      if (!page) page = 1;
      if (!sort) sort = ["id", "DESC"];
      name === "undefined" || name === "null" || name === ""
        ? (name = undefined)
        : name;
      if (name) filter.name = { [Op.substring]: name };
      let skip = (page - 1) * limit;
      const { count, rows } = await db.Product.findAndCountAll({
        limit: limit,
        offset: skip,
        order: [sort],
        where: filter,
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "imageId",
            "brandId",
            "productTypeId",
          ],
        },
        include: [
          {
            model: db.Product_Type,
            as: "productTypeData",
            attributes: ["productTypeId", "productTypeName"],
          },
          {
            model: db.Brand,
            as: "brandData",
            attributes: ["brandId", "brandName"],
          },
        ],
        raw: true,
        nest: true,
      });

      let result = await Promise.all(
        rows.map(async (item) => {
          item.rating = await db.Feedback.findAll({
            where: { productId: item.productId },
            attributes: ["rating"],
          });
          return item;
        })
      );

      result = result.map((item) => {
        if (item.rating.length > 0) {
          let sumRating = item.rating.reduce(
            (acc, current) => current.rating + acc,
            0
          );
          let avg = sumRating / item.rating.length;
          item.rating = +avg.toFixed(1);
        } else {
          item.rating = 0;
        }
        return item;
      });

      resolve({
        errCode: 0,
        total: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        data: result,
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllProductService
};
