import express from "express";
import productTypeController from "../controllers/productTypeController";
let router = express.Router();

router.post(
  "/create-product-type",
  productTypeController.handleCreateNewProductType
);

router.put(
  "/update-product-type",
  productTypeController.handleUpdateProductType
);

router.get(
  "/get-all-product-type",
  productTypeController.handleGetAllProductType
);
export default router;
