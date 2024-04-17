import db from "../models/index";
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";

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
  getProductService,
};
