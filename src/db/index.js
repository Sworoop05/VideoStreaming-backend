import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();
const connectMongoDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DATABASE_NAME}`
    );
    console.log(
      `MongoDb connected!! DB host on :${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error is from :", error);
    process.exit(1);
  }
};
export default connectMongoDb;
