import express from "express";
import brandController from "../controllers/brandController";
let router = express.Router();

router.post("/create-brand", brandController.handleCreateNewBrand);
router.delete("/delete-brand", brandController.handleDeleteBrand);
router.put("/update-brand", brandController.handleUpdateBrand);
router.get("/get-all-brand", brandController.handleGetAllBrand);
export default router;
