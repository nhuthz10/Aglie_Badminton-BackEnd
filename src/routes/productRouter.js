import express from "express";
import productController from "../controllers/productController";
let router = express.Router();

router.post(
  "/create-product",
  uploadCloud.single("image"),
  productController.handleCreateNewProduct
);
router.put(
  "/update-product",
  uploadCloud.single("image"),
  productController.handleUpdateProduct
);
router.get("/get-product", productController.getProduct);

export default router;
