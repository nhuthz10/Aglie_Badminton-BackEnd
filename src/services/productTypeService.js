import db from "../models/index";
require("dotenv").config();
import { Op } from "sequelize";

let checkProductTypeId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productType = await db.Product_Type.findOne({
        where: { productTypeId: id },
      });
      if (productType) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let checkProductTypeName = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let productType = await db.Product_Type.findOne({
        where: { productTypeName: name },
      });
      if (productType) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let createNewProductTypeService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.productTypeId || !data.productTypeName) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let checkExistId = await checkProductTypeId(data.productTypeId);
        let checkExistName = await checkProductTypeName(data.productTypeName);
        if (checkExistId) {
          resolve({
            errCode: 2,
            message: "ProductTypeId is already exist",
          });
        } else if (checkExistName) {
          resolve({
            errCode: 3,
            message: "ProductTypeName is already exist",
          });
        } else {
          await db.Product_Type.create({
            productTypeId: data.productTypeId,
            productTypeName: data.productTypeName,
          });
          resolve({
            errCode: 0,
            message: "Create a productType succeed",
          });
        }
      }
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
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

//Pagination
let getAllProductTypeService = (limit, page, sort, name, pagination) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (pagination === "true") {
        let filter = {};
        if (!limit) limit = +process.env.LIMIT_MANAGE;
        if (!page) page = 1;
        if (!sort) sort = ["id", "DESC"];
        name === "undefined" ? (name = undefined) : name;
        if (name) filter.productTypeName = { [Op.substring]: name };
        let skip = (page - 1) * limit;
        const { count, rows } = await db.Product_Type.findAndCountAll({
          limit: limit,
          offset: skip,
          order: [sort],
          where: filter,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        resolve({
          errCode: 0,
          total: count,
          currentPage: page,
          totalPage: Math.ceil(count / limit),
          data: rows,
        });
      } else {
        let productTypes = await db.Product_Type.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        resolve({
          errCode: 0,
          data: productTypes,
          message: "Get all brand succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

// let getAllProductTypeService = (limit, page) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let productTypes = await db.Product_Type.findAll({
//         attributes: {
//           exclude: ["createdAt", "updatedAt"],
//         },
//       });
//       resolve({
//         errCode: 0,
//         data: productTypes,
//         message: "Get all productType succeed",
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

module.exports = {
  createNewProductTypeService,
  getAllProductTypeService,
};
