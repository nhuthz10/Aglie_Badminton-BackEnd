import express from "express";
import productController from "../controllers/productController";
let router = express.Router();

router.get("/get-product", productController.getProduct);

export default router;
