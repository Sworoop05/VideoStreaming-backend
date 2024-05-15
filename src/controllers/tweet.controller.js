import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}= req.body
    const userId = req.user?._id
    if(!userId){
      new ApiError(400,"unauthorized user")
    }
    if(!content){
      new ApiError(400,"content is required")
    }
  const user = await User.aggregate([{
    $match:{
        _id: new mongoose.Types.ObjectId(userId)
    }
  },{
    $project:{
        _id:1,
        fullname:1
    }
  }])
    const userTweet = await Tweet.create({
        content,
        owner:user[0]._id
    })
    console.log(userTweet)
    return res.status(200)
              .json(new ApiResponse(200,userTweet,"Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
     // taking the userId from req.params
     const { userId } = req.params;
     console.log(req.params)
if(!userId.trim()){
    throw new ApiError(401,"Invalid userId")
}
    
 
     // checking for the user in DB
     const user = await User.findById(userId.replace(":","").trim());
 
     if (!user) {
         throw new ApiError(404, "User not found.");
     }
     console.log(user._id)
     console.log( new mongoose.Types.ObjectId(userId.replace(":","").trim()))
 
     // searching for tweets in the DB where userId is same as owner of tweet
     const tweets = await Tweet.aggregate([
         {
             $match: {   // returning only those tweets where owner & user._id are same
                 owner: new mongoose.Types.ObjectId(user._id)
             }
         }
     ]);
 
     // if there are no tweets return response
     if (tweets.length === 0) {  // the type of tweets is object so we can check its length
         return res
         .status(404)
         .json(new ApiResponse(404, tweets, "User has no tweets"));
     }
 
     // returning response
     return res
     .status(200)
     .json(new ApiResponse(200, tweets, "Tweets fetched successfully."))
 
})
const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {updatedContent}=req.body
    const {tweetId}= req.params
    
    const Id = tweetId.replace(":","").trim()
    if(!Id){
        throw new ApiError(401,"Invalid tweet Id")
    }
    if(!updatedContent){
        throw new ApiError(401,"updated content is needed")
    }
    const tweet = await Tweet.findByIdAndUpdate(Id,{
        $set:{
            content:updatedContent
        }
    },{
        new:true
    })
    if(!tweet){
        throw new ApiError(401,"Tweet not found")
    }
    return res.status(200)
              .json(new ApiResponse("tweet updated successfully",tweet,200))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}= req.params
    
    const Id = tweetId.replace(":","").trim()
    if(!Id){
        throw new ApiError(401,"Invalid tweet Id")
    }
    await Tweet.findByIdAndDelete(Id)
    return res.status(200)
                .json(new ApiResponse("Tweet deleted successfully",{},200))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
