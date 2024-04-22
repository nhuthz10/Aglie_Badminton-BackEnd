import express from "express";
import brandController from "../controllers/brandController";
let router = express.Router();

router.get("/get-all-brand", brandController.handleGetAllBrand);
export default router;
