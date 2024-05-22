import db from "../models/index";
const cloudinary = require("cloudinary").v2;
import { Op } from "sequelize";
require("dotenv").config();

let deleteVoucherService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let voucher = await db.Voucher.findOne({
          where: { id: id },
        });
        if (!voucher) {
          resolve({
            errCode: 2,
            message: "Voucher isn't exist",
          });
        } else {
          await db.Voucher.destroy({
            where: { id: id },
          });
          cloudinary.uploader.destroy(voucher.imageId);
          resolve({
            errCode: 0,
            message: "Delete Voucher succeed",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllVoucherService = (limit, page, sort, name, pagination) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (pagination === "true") {
        let filter = {};
        if (!limit) limit = +process.env.LIMIT_MANAGE;
        if (!page) page = 1;
        if (!sort) sort = ["id", "DESC"];
        if (name) filter.voucherId = { [Op.substring]: name };
        let skip = (page - 1) * limit;
        const { count, rows } = await db.Voucher.findAndCountAll({
          limit: limit,
          offset: skip,
          order: [sort],
          where: filter,
          attributes: {
            exclude: ["createdAt", "updatedAt", "imageId"],
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
        let vouchers = await db.Voucher.findAll({
          attributes: {
            exclude: ["createdAt", "updatedAt", "imageId"],
          },
        });
        resolve({
          errCode: 0,
          data: vouchers,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  deleteVoucherService,
  getAllVoucherService,
};
