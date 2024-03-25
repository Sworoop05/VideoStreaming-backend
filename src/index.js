import connectMongoDb from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();
connectMongoDb()
  .then(() => {
    app.listen(process.env.PORT || 3001, () => {
      console.log("app is running on port", process.env.PORT || 3001);
    });
  })
  .catch((error) => {
    console.log("🚀 ~ connectMongoDb ~ error:", error);
    return {};

    throw error;
  });
