import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object I create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res
  const { email, username, fullname, password } = req.body;
  console.log(req.files);
  if (
    [email, username, fullname, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields must be filled");
  }
  //User from user model directly connect with the mongoDb or database
  // and provide different methods for running queries in databsae)

  //always use await keyword before doing database calls
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }
  const localAvatarPath = req.files?.avatar[0]?.path;
  console.log(localAvatarPath);
  // const localCoverImagePath = req.files?.coverImage[0]?.path;
  let localCoverImagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    localCoverImagePath = req.files.coverImage[0].path;
  }
  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCloudinary(localAvatarPath);
  const coverImage = await uploadOnCloudinary(localCoverImagePath);
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }
  const user = await User.create({
    email,
    fullname,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });
  const userCreated = user
    .findById(user._id)
    ?.select("-password -refreshToken");
  if (!userCreated) {
    throw new ApiError(500, "User creation failed");
  }
  return res
    .status(201)
    .json(new ApiResponse("User created successfully", userCreated, 200));
});
export default registerUser;
