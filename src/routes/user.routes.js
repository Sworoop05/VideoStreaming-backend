import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import jwtVerify from "../middlewares/auth.middleware.js";
const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser)
router.route("/logout").post(jwtVerify, logoutUser)
router.route("/change-password").post(jwtVerify, changePassword)
router.route("/refresh-token").post(refreshAccessToken)
export default router;
  