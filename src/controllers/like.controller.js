import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {Video} from "../models/video.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!videoId){
        throw new ApiError(500,"Invalid video Id")
    }
    const Video = await Video.findById(videoId)
    if(!Video){
        throw new ApiError(404,"Video not found")
    }
const isVideoLiked = await Like.findOne({
    $and:[{video:videoId},{likedBy:req.user?._id}]
})
if(isVideoLiked){
   await Like.findByIdAndDelete(isVideoLiked?._id)
   return res.status(200)
              .json(new ApiResponse("like removed from video successfuly",{},200))
} else{
    const likedVideo = await Like.create({
        video:videoId,
        likedBy:req.user?._id
    })
    return res.status(200)
              .json(new ApiResponse(" video is liked successfuly",likedVideo,200))
}
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")
    }
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"Comment not found")
    }
    const isCommentLiked = await Like.findOne({
        $and:[{comment:commentId},{likedBy:req.user?._id}]
    })
   if(isCommentLiked){
    await Like.findByIdAndDelete(isCommentLiked._id)
    return res.status(200)
              .json(new ApiResponse(" like from Comment is removed successfuly",{},200))
   } else{
    const likedComment =  await Like.create({
        comment:commentId,
        likedBy:req.user?._id
    })
    return res.status(200)
    .json(new ApiResponse(" comment is liked successfuly",likedComment,200))
   }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError("Invalid tweetId")
    }
    const isTweetLiked = await Like.findOne({
       $and:[{ tweet:tweetId},{
        likedBy:req.user?._id
       }]
    })
    if(isTweetLiked){
        await Like.findByIdAndDelete(isTweetLiked._id)
        return res.status(200)
        .json(new ApiResponse(" like from tweet is removed successfuly",{},200))
    } else{
const tweetLiked = await Like.create({
    tweet:tweetId,
    likeBy:req.user?._id
})
return res.status(200)
.json(new ApiResponse(" tweet is liked successfuly",tweetLiked,200))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id
    if(!userId){
        throw new ApiError("unauthorized access denied")
    }
   const likedVideos =  await Like.aggregate(
    [
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(userId),
                video:{$exist:true}
            }
        },{
            $lookup:{
                from:"Video",
                localField:"video",
                foreignField:"_id",
                as:"likedVideo"
            }
        },{
            $project:{
                _id:1,
                video:1,


            }
        }
    ]
   )
   res.status(200)
      .json(new ApiResponse("liked videos successfully fetched",likedVideos,200))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}