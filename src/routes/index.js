import productRouter from "./productRouter";
import feedBackRouter from "./feedBackRouter";
import userRouter from "./userRouter";

let initWebRoutes = (app) => {
  app.use("/api/product", productRouter);
  app.use("/api/feedback", feedBackRouter);
  app.use("/api/user", userRouter);
};

export default initWebRoutes;
