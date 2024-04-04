import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
//middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.get("/", (req, res) => res.send("hello world"));
//import userrouter from router
import router from "./routes/user.routes.js";
//routes declaration and this line of code is written only one time
app.use("/api/v1/users", router);
export { app };
