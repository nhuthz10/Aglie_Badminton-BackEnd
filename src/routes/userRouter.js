import express from "express";
import userController from "../controllers/userController";
import uploadCloud from "../middlewares/uploadImg";
let router = express.Router();

router.post("/login", userController.handleLogin);
router.post("/register", userController.handleRegister);
router.get("/auth-email", userController.handleAuthenRegister);
router.post("/create-user", userController.handleCreateNewUser);
router.delete("/delete-user", userController.handleDeleteUser);
router.put(
  "/update-user",
  uploadCloud.single("avatar"),
  userController.handleUpdateUser
);
router.post("/send-otp-code", userController.handleSendOtpCode);
router.put("/change-password", userController.handleChangePassword);
router.put(
  "/change-password-profile",
  userController.handleChangeProfilePassword
);
router.get("/get-user", userController.handleGetUser);
router.get("/get-all-user", userController.handleGetAllUser);
router.get("/get-all-role", userController.handleGetAllRole);

export default router;
