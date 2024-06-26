import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();

const app = express();

// app.use(
//   cors({
//     origin: process.env.URL_REACT,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Backend nodejs is runing on the port :" + port);
});
