import db from "../models/index";
import { Op } from "sequelize";
require("dotenv").config();

//Pagination
let getAllBrandService = (limit, page, sort, name, pagination) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (pagination === "true") {
        let filter = {};
        if (!limit) limit = +process.env.LIMIT_MANAGE;
        if (!page) page = 1;
        if (!sort) sort = ["id", "DESC"];
        name === "undefined" ? (name = undefined) : name;
        if (name) filter.brandName = { [Op.substring]: name };
        let skip = (page - 1) * limit;
        const { count, rows } = await db.Brand.findAndCountAll({
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
        let brands = await db.Brand.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        resolve({
          errCode: 0,
          data: brands,
          message: "Get all brand succeed",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllBrandService,
};
