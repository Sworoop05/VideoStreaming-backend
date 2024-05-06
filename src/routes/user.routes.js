import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,
  getCurrentUser,updateUserDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js";
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
router.route("/get-current-user").get(jwtVerify, getCurrentUser)
router.route("/update-user-detail").patch(jwtVerify, updateUserDetails)
router.route("/update-user-avatar").patch(jwtVerify,upload.single("avatar"), updateUserAvatar)
router.route("/update-user-cover-Image").patch(jwtVerify,upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(jwtVerify, getUserChannelProfile)
router.route("/user-watch-history").get(jwtVerify, getWatchHistory)

export default router;
  