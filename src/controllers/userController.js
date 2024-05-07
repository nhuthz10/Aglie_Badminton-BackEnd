import userService from "../services/userService";
require("dotenv").config();

let handleGetAllUser = async (req, res) => {
  try {
    let { limit, page, sort, name } = req.query;
    let message = await userService.getAllUser(+limit, +page, sort, name);
    if (message.errCode === 0) return res.status(200).json(message);
    else return res.status(400).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from the server!!!",
    });
  }
};

let handleGetAllRole = async (req, res) => {
  try {
    let message = await userService.getAllRoleService();
    if (message.errCode === 0) return res.status(200).json(message);
    else return res.status(400).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error from the server!!!",
    });
  }
};

module.exports = {
  handleGetAllUser,
  handleGetAllRole,
};
