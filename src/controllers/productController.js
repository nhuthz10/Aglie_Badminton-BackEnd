import productService from "../services/productService";
const cloudinary = require("cloudinary").v2;



let handleGetAllProduct = async (req, res) => {
  try {
    let { limit, page, sort, name } = req.query;
    let message = await productService.getAllProductService(
      +limit,
      +page,
      sort,
      name
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

let handleGetAllProductOfTheProductType = async (req, res) => {
  try {
    let { limit, page, sort, productTypeId, filter } = req.query;

    sort !== "undefined" &&
    sort !== "" &&
    sort !== "null" &&
    sort !== undefined &&
    sort !== null
      ? (sort = JSON.parse(sort))
      : (sort = undefined);

    filter !== "undefined" &&
    filter !== "" &&
    filter !== null &&
    filter !== undefined &&
    filter !== null
      ? (filter = JSON.parse(filter))
      : (filter = undefined);

    let message = await productService.getAllProductOfTheProductTypeService(
      productTypeId,
      +limit,
      +page,
      sort,
      filter
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
