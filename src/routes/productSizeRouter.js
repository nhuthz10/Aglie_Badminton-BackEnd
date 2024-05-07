import express from "express";
import productSizeController from "../controllers/productSizeController";
let router = express.Router();

router.post(
  "/create-product-size",
  productSizeController.handleCreateNewProductSize
);
router.delete(
  "/delete-product-size",
  productSizeController.handleDeleteProductSize
);
router.put(
  "/update-product-size",
  productSizeController.handleUpdateProductSize
);
router.get(
  "/get-all-product-size",
  productSizeController.handleGetAllProductSize
);
export default router;
