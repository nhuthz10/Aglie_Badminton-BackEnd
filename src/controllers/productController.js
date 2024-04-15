import productService from "../services/productService";
const cloudinary = require("cloudinary").v2;

let getProduct = async (req, res) => {
  try {
    let { productId } = req.query;
    let message = await productService.getProductService(productId);
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
  getProduct,
};
