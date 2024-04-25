import db from "../models/index";
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";

  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let product = await db.Product.findOne({
          where: { productId: productId },
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "brandId",
              "productTypeId",
              "imageId",
              "descriptionContent",
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
        let sizeProducts = await db.Product_Size.findAll({
          where: { productId: productId },
          attributes: ["quantity", "sold"],
          order: [["id", "ASC"]],
          include: [
            {
              model: db.Size,
              as: "SizeData",
              attributes: ["sizeId", "sizeName"],
            },
          ],
          raw: true,
          nest: true,
        });
        sizeProducts = sizeProducts.map((size) => {
          return { quantity: size.quantity, sold: size.sold, ...size.SizeData };
        });
        product.SizeData = sizeProducts;

        product.rating = await db.Feedback.findAll({
          where: { productId: product.productId },
          attributes: ["rating"],
        });

        if (product.rating.length > 0) {
          let sumRating = product.rating.reduce(
            (acc, current) => current.rating + acc,
            0
          );
          let avg = sumRating / product.rating.length;
          product.rating = +avg.toFixed(1);
        } else {
          product.rating = 0;
        }

        resolve({
          errCode: 0,
          data: product,
          message: "Get product succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllProductOfTheProductTypeService = (
  productTypeId,
  limit,
  page,
  sort,
  filter
) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productTypeId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let queryFilter = {};
        if (!limit) limit = +process.env.LIMIT_MANAGE;
        if (!page) page = 1;
        if (!sort) sort = ["id", "DESC"];
        if (filter) {
          if (Object.keys(filter).length !== 0) {
            queryFilter = {
              brandId: {
                [Op.or]: filter?.brandId ? filter?.brandId : [],
              },
              price: {
                [Op.between]: [filter?.price[0], filter?.price[1]],
              },
            };
          }
        }

        let skip = (page - 1) * limit;
        const { count, rows } = await db.Product.findAndCountAll({
          limit: limit,
          offset: skip,
          order: [sort],
          where: {
            productTypeId: productTypeId,
            ...queryFilter,
          },
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "imageId",
              "brandId",
              "productTypeId",
              "rating",
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
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getProductService = (productId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!productId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let product = await db.Product.findOne({
          where: { productId: productId },
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "id",
              "brandId",
              "productTypeId",
              "imageId",
              "descriptionContent",
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
        let sizeProducts = await db.Product_Size.findAll({
          where: { productId: productId },
          attributes: ["quantity", "sold"],
          order: [["id", "ASC"]],
          include: [
            {
              model: db.Size,
              as: "SizeData",
              attributes: ["sizeId", "sizeName"],
            },
          ],
          raw: true,
          nest: true,
        });
        sizeProducts = sizeProducts.map((size) => {
          return { quantity: size.quantity, sold: size.sold, ...size.SizeData };
        });
        product.SizeData = sizeProducts;

        product.rating = await db.Feedback.findAll({
          where: { productId: product.productId },
          attributes: ["rating"],
        });

        if (product.rating.length > 0) {
          let sumRating = product.rating.reduce(
            (acc, current) => current.rating + acc,
            0
          );
          let avg = sumRating / product.rating.length;
          product.rating = +avg.toFixed(1);
        } else {
          product.rating = 0;
        }

        resolve({
          errCode: 0,
          data: product,
          message: "Get product succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
};
