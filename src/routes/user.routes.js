import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,changePassword,
  getCurrentUser,updateUserDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
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
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-current-user").get(verifyJWT, getCurrentUser)
router.route("/update-user-detail").patch(verifyJWT, updateUserDetails)
router.route("/update-user-avatar").patch(verifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/update-user-cover-Image").patch(verifyJWT,upload.single("coverImage"), updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/user-watch-history").get(verifyJWT, getWatchHistory)

export default router;
  