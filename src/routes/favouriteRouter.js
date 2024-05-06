import express from "express";
import favouriteController from "../controllers/favouriteController";
let router = express.Router();

router.post("/create-favourite", favouriteController.handleCreateNewFavourite);
router.delete("/delete-favourite", favouriteController.handleDeleteFavourite);
router.put("/update-favourite", favouriteController.handleUpdateFavourite);
router.get("/get-all-favourite", favouriteController.handleGetAllFavourite);
export default router;
