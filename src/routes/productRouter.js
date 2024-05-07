import express from "express";
import productController from "../controllers/productController";
import uploadCloud from "../middlewares/uploadImg";
let router = express.Router();

router.post(
  "/create-product",
  uploadCloud.single("image"),
  productController.handleCreateNewProduct
);
router.delete("/delete-product", productController.handleDeleteProduct);
router.put(
  "/update-product",
  uploadCloud.single("image"),
  productController.handleUpdateProduct
);
router.get("/get-all-product", productController.handleGetAllProduct);
router.get(
  "/get-all-product-of-the-product-type",
  productController.handleGetAllProductOfTheProductType
);
router.get("/get-product", productController.getProduct);
router.get("/get-paypal-id", productController.getPaypalClientId);
router.get(
  "/get-product-feedback",
  productController.handleGetAllProuctFeedback
);
router.get(
  "/get-product-sale-off",
  productController.handleGetAllProuctSaleOff
);
router.get(
  "/get-product-favourite",
  productController.handleGetAllProuctFavourite
);

router.get("/get-product-name", productController.handleGetNameProduct);

export default router;
