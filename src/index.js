import connectMongoDb from "./db/index.js";
import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();
connectMongoDb()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("app is running on port", process.env.PORT || 3001);
    });
  })
  .catch((error) => {
    console.log("🚀 ~ connectMongoDb ~ error:", error);
    throw error;
  });
