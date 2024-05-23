import express from "express";
import voucherController from "../controllers/voucherController";
import uploadCloud from "../middlewares/uploadImg";
let router = express.Router();

router.delete("/delete-voucher", voucherController.handleDeleteVoucher);
router.get("/get-all-voucher", voucherController.handleGetAllVoucher);

export default router;
