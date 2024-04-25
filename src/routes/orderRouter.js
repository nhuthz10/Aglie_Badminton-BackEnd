import express from "express";
import orderController from "../controllers/orderController";
let router = express.Router();

router.post("/create-order", orderController.handleCreateOrder);
router.get("/get-all-order", orderController.handleGetAllOrder);
router.get("/get-order-detail", orderController.handleGetOrderDetail);
router.put("/cancle-order", orderController.handleCancleOrderDetail);
router.get("/get-all-order-admin", orderController.handleGetAllOrderAdmin);
router.put("/delivering-order", orderController.handleDeliveringOrderDetail);
router.put("/succeed-order", orderController.handleSucceedOrderDetail);
router.delete("/delete-order", orderController.handleDeleteOrder);
router.get("/order-statistics", orderController.handleGetStatistics);
router.get("/order-report", orderController.handleGetAllProductReport);
router.post("/create_payment_url", orderController.handleCreatePaymentUrl);
router.post("/create_payment_url", orderController.handleCreatePaymentUrl);
router.get("/vnpay_return", orderController.handelVnPayReturn);

export default router;
