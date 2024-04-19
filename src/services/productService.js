import db from "../models/index";
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";

let checkPeoductId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findOne({
        where: { productId: id },
      });
      if (product) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let checkProductName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let product = await db.Product.findOne({
        where: { name: name },
      });
      if (product) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewProductService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.productId ||
        !data.brandId ||
        !data.productTypeId ||
        !data.name ||
        !data.price ||
        !data.imageUrl
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let checkExistId = await checkPeoductId(data.productId);
        let checkExistName = await checkProductName(data.name);
        if (checkExistId) {
          resolve({
            errCode: 2,
            message: "ProductId is already exist",
          });
        } else if (checkExistName) {
          resolve({
            errCode: 3,
            message: "ProductName is already exist",
          });
        } else {
          await db.Product.create({
            productId: data.productId,
            brandId: data.brandId,
            productTypeId: data.productTypeId,
            name: data.name,
            price: data.price,
            image: data.imageUrl,
            imageId: data.imageId,
            descriptionContent: data.descriptionContent,
            descriptionHTML: data.descriptionHTML,
          });
          resolve({
            errCode: 0,
            message: "Create a product succeed",
          });
        }
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        console.log(error);
        resolve({
          errCode: -2,
          message: "Error foreign key",
        });
      } else {
        reject(error);
      }
    }
  });
};

let checkProductIdUpdate = (productId, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findAll();
      products = products.filter((item) => item.id !== +id);
      let result;
      for (let i = 0; i < products.length; i++) {
        if (products[i].productId === productId) {
          result = true;
          break;
        } else {
          result = false;
        }
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

let checkProductNameUpdate = (productName, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products = await db.Product.findAll();
      products = products.filter((item) => item.id !== +id);
      let result;
      for (let i = 0; i < products.length; i++) {
        if (products[i].name === productName) {
          result = true;
          break;
        } else {
          result = false;
        }
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};

let updateProductService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.productId ||
        !data.brandId ||
        !data.productTypeId ||
        !data.name ||
        !data.price ||
        !data.id
      ) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let checkExistId = await checkProductIdUpdate(data.productId, data.id);
        let checkExistName = await checkProductNameUpdate(data.name, data.id);
        if (checkExistId) {
          resolve({
            errCode: 2,
            message: "ProductId is already exist",
          });
        } else if (checkExistName) {
          resolve({
            errCode: 3,
            message: "ProductName is already exist",
          });
        } else {
          let product = await db.Product.findOne({
            where: { id: data.id },
            raw: false,
          });
          if (product) {
            product.productId = data.productId;
            product.brandId = data.brandId;
            product.productTypeId = data.productTypeId;
            product.name = data.name;
            product.price = data.price;
            product.discount = data.discount;
            product.descriptionContent = data.descriptionContent;
            product.descriptionHTML = data.descriptionHTML;
            if (data.imageUrl && data.imageId) {
              cloudinary.uploader.destroy(product.imageId);
              product.image = data.imageUrl;
              product.imageId = data.imageId;
            }
            await product.save();
            resolve({
              errCode: 0,
              message: "Update product succeed",
            });
          } else {
            resolve({
              errCode: 4,
              message: "Product isn't exist",
            });
          }
        }
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
  createNewProductService,
  updateProductService,
  getProductService,
};
