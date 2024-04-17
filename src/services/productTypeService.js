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
  getAllProductTypeService,
};
