import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const main = async () => {
  const url = process.env.DATABASE_URL;
  try {
    const app = express();
    mongoose.connect(url).then(() => {
      app.use((req, res, next) => {
        req.header("Access-Control-Access-Origin", "*");
        next();
      });
      console.log("conneceted to the database");
    });
    app.listen(2021, () => console.log("connected to port 2021"));
  } catch (error) {
    console.log(error);
  }
};

main();
