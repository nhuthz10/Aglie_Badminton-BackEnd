import express from "express";
import userController from "../controllers/userController";
import uploadCloud from "../middlewares/uploadImg";
let router = express.Router();

router.get("/get-all-user", userController.handleGetAllUser);
router.get("/get-all-role", userController.handleGetAllRole);

export default router;
