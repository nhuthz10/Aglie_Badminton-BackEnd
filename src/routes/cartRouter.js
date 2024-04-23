import express from "express";
import cartController from "../controllers/cartController";
let router = express.Router();

router.post("/create-cart", cartController.handleCreateNewCart);
router.post("/add-product-to-cart", cartController.handleAddProductToCart);
router.get("/get-all-product-cart", cartController.handleGetAllProductCart);
router.put("/update-product-cart", cartController.handleUpdateProductCart);
router.delete("/delete-product-cart", cartController.handleDeleteProductCart);

export default router;
