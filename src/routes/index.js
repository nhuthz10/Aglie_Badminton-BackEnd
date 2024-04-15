import productRouter from "./productRouter";
import feedBackRouter from "./feedBackRouter";

let initWebRoutes = (app) => {
  app.use("/api/product", productRouter);
  app.use("/api/feedback", feedBackRouter);
};

export default initWebRoutes;
