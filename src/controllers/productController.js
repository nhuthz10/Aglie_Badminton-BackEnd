import productService from "../services/productService";
const cloudinary = require("cloudinary").v2;

let handleCreateNewProduct = async (req, res) => {
  try {
    let data = req.body;
    let fileData = req.file;
    data.imageUrl = fileData?.path;
    data.imageId = fileData?.filename;
    let message = await productService.createNewProductService(data);
    if (message.errCode === 0) return res.status(201).json(message);
    else {
      if (fileData) {
        cloudinary.uploader.destroy(fileData.filename);
      }
      return res.status(400).json(message);
    }
  } catch (error) {
    let fileData = req.file;
    if (fileData) {
      cloudinary.uploader.destroy(fileData.filename);
    }
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error form the server!!!",
    });
  }
};

let deleteProductService = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!!!",
        });
      } else {
        let product = await db.Product.findOne({
          where: { id: id },
        });
        if (!product) {
          resolve({
            errCode: 2,
            message: "Product isn't exist",
          });
        } else {
          if (product.imageId && product.image) {
            cloudinary.uploader.destroy(product.imageId);
          }
          await db.Product.destroy({
            where: { id: id },
          });
          resolve({
            errCode: 0,
            message: "Product brand succeed",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleUpdateProduct = async (req, res) => {
  try {
    let data = req.body;
    let fileData = req.file;
    data.imageUrl = fileData?.path;
    data.imageId = fileData?.filename;
    let message = await productService.updateProductService(data);
    if (message.errCode === 0) return res.status(200).json(message);
    else {
      if (fileData) {
        cloudinary.uploader.destroy(fileData.filename);
      }
      return res.status(400).json(message);
    }
  } catch (error) {
    let fileData = req.file;
    if (fileData) {
      cloudinary.uploader.destroy(fileData.filename);
    }
    console.log(error);
    return res.status(500).json({
      errCode: -1,
      message: "Error form the server!!!",
    });
  }
};

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
  handleCreateNewProduct,
  handleUpdateProduct,
  deleteProductService,
  getProduct,
};
