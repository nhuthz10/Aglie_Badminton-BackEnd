import userRouter from "./userRouter";
import productRouter from "./productRouter";
import productTypeRouter from "./productTypeRouter";
import brandRouter from "./brandRouter";
import sizeRouter from "./sizeRouter";
import voucherRouter from "./voucherRouter";
import productSizeRouter from "./productSizeRouter";
import cartRouter from "./cartRouter";

let initWebRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product-type", productTypeRouter);
  app.use("/api/product", productRouter);
  app.use("/api/product", productRouter);
  app.use("/api/brand", brandRouter);
  app.use("/api/size", sizeRouter);
  app.use("/api/voucher", voucherRouter);
  app.use("/api/product-size", productSizeRouter);
  app.use("/api/cart", cartRouter);
};

export default initWebRoutes;
