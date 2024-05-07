import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import emailService from "./emailService";
require("dotenv").config();
import { v4 as uuidv4 } from "uuid";
const salt = bcrypt.genSaltSync(10);

// Pagination
let getAllUser = (limit, page, sort, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {};
      if (!limit) limit = +process.env.LIMIT_MANAGE;
      if (!page) page = 1;
      if (!sort) sort = ["id", "DESC"];
      name === "undefined" ? (name = undefined) : name;
      if (name) filter.userName = { [Op.substring]: name };

      let skip = (page - 1) * limit;
      const { count, rows } = await db.User.findAndCountAll({
        limit: limit,
        offset: skip,
        order: [sort],
        where: filter,
        attributes: {
          exclude: [
            "password",
            "avatarId",
            "createdAt",
            "updatedAt",
            "tokenResgister",
            "otpCode",
            "timeOtp",
            "roleId",
          ],
        },
        include: [
          {
            model: db.Role,
            as: "roleData",
            attributes: ["roleId", "roleName"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        total: count,
        currentPage: page,
        totalPage: Math.ceil(count / limit),
        data: rows,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllRoleService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let roles = await db.Role.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt", "id"],
        },
      });
      resolve({
        errCode: 0,
        data: roles,
        message: "Get all role succeed",
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllUser,
  getAllRoleService,
};
