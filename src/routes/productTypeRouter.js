import express from "express";
import productTypeController from "../controllers/productTypeController";
let router = express.Router();

router.post(
  "/create-product-type",
  productTypeController.handleCreateNewProductType
);
router.get(
  "/get-all-product-type",
  productTypeController.handleGetAllProductType
);
export default router;
