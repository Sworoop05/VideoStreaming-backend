import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import mongoose from "mongoose"


const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}



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
  console.log(localAvatarPath,"line 48");
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
    throw new ApiError(400, "Local Avatar is required");
  }
  const avatar = await uploadOnCloudinary(localAvatarPath);
  console.log(avatar)
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
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
)
});
const loginUser = asyncHandler(async (req,res)=>{
  // req details from user
  // check email and username
  // find the user
  // check password
  // generate access token and refresh token
  // send cookie
const {email,username,password}=req.body
console.log(email)
if (!username && !email) {
  throw new ApiError(400, "username or email is required")
}
const user = await User.findOne({
  $or: [{username}, {email}]
})

if (!user) {
  throw new ApiError(404, "User does not exist")
}

const isPasswordValid = await user.isPasswordCorrect(password)

if (!isPasswordValid) {
throw new ApiError(401, "Invalid user credentials")
}
console.log(user._id)
const {accessToken,refreshToken}=await generateAccessAndRefereshTokens(user._id)
const loggedinUser = await  User.findById(user._id).select("-password -refreshToken")
//option is defined so cookies can only be modified via server not from website
const option={
  httpOnly:true,
  secure:true
}
return res.status(200)
.cookie("accessToken",accessToken,option)
.cookie("refreshToken",refreshToken,option)
.json(
  new ApiResponse("User logged in successfully",{
    user:loggedinUser,accessToken,refreshToken
  },200)
)
})
const logoutUser = asyncHandler(async (req,res)=>{

 const userId = req.user._id
 await User.findByIdAndUpdate(userId,{
  $set:{
    refreshToken:undefined
  }
 },{
  new:true
})
const option = {
  httpOnly:true,
  secure:true
}
return res.status(200)
.clearCookie("accessToken",option)
.clearCookie("refreshToken",option)
})
const refreshAccessToken = asyncHandler(async()=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  if(!incomingRefreshToken){
    throw new ApiError(401, "unauthorized refresh token")
  }
 const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 const user = await User.findById(decodedRefreshToken._id)
 if(!user){
    throw new ApiError(402,"Invalid refresh token")
 }
 if(incomingRefreshToken !== user?.refreshToken){
  throw new ApiError(401,"Refresh token expired or used ")
 }
 const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user?._id)
 const option = {
  httpOnly:true,
  secure:true
 }
 return res
         .status(200)
         .cookie("accessToken",accessToken,option)
         .cookie("refreshToken",refreshToken,option)
         .json(
          new ApiResponse("refresh token",{accessToken,refreshToken},200)
         )
 
})
export  {registerUser,loginUser,logoutUser,refreshAccessToken};
