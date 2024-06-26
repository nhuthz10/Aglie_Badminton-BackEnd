import express from "express";
import voucherController from "../controllers/voucherController";
import uploadCloud from "../middlewares/uploadImg";
let router = express.Router();

router.post(
  "/create-voucher",
  uploadCloud.single("image"),
  voucherController.handleCreateNewVoucher
);
router.delete("/delete-voucher", voucherController.handleDeleteVoucher);
router.put(
  "/update-voucher",
  uploadCloud.single("image"),
  voucherController.handleUpdateVoucher
);
router.get("/get-all-voucher", voucherController.handleGetAllVoucher);
router.get("/get-all-voucher-user", voucherController.handleGetAllVoucherUser);

export default router;
