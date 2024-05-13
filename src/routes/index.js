import productRouter from "./productRouter";
import feedBackRouter from "./feedBackRouter";
import userRouter from "./userRouter";
import voucherRouter from "./voucherRouter";

let initWebRoutes = (app) => {
  app.use("/api/product", productRouter);
  app.use("/api/feedback", feedBackRouter);
  app.use("/api/user", userRouter);
  app.use("/api/voucher", voucherRouter);
};

export default initWebRoutes;
