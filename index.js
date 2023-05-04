import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import userRouter from "./src/routers/userRouter.js";
import Cors from "cors";

config();

const main = async () => {
  const url = process.env.DATABASE_URL;
  try {
    const app = express();
    const cors = Cors();
    mongoose.connect(url).then(() => {
      app.use(cors);
      app.use((req, res, next) => {
        req.header("Access-Control-Allow-Origin", "*");
        next();
      });

      app.use(
        express.json(),
        express.urlencoded({ extended: false }),
        userRouter
      );

      console.log("conneceted to the database");
    });
    app.listen(2021, () => console.log("connected to port 2021"));
  } catch (error) {
    console.log(error);
  }
};

main();
