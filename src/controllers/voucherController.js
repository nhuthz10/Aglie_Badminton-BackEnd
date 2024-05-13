import voucherService from "../services/voucherService";
const cloudinary = require("cloudinary").v2;

let handleDeleteVoucher = async (req, res) => {
  try {
    let id = req.query.id;
    let message = await voucherService.deleteVoucherService(id);
    if (message.errCode === 0) return res.status(200).json(message);
    else return res.status(400).json(message);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error form the server!!!",
    });
  }
};

let handleGetAllVoucher = async (req, res) => {
  try {
    let { limit, page, sort, name, pagination } = req.query;
    let message = await voucherService.getAllVoucherService(
      +limit,
      +page,
      sort,
      name,
      pagination
    );
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
  handleDeleteVoucher,
  handleGetAllVoucher,
};
