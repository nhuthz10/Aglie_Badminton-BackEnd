import express from "express";
import sizeController from "../controllers/sizeController";
let router = express.Router();

router.post("/create-size", sizeController.handleCreateNewSize);
router.delete("/delete-size", sizeController.handleDeleteSize);
router.put("/update-size", sizeController.handleUpdateSize);
router.get("/get-all-size", sizeController.handleGetAllSize);
router.get(
  "/get-all-size-product-type",
  sizeController.handleGetAllSizeProductType
);
export default router;
