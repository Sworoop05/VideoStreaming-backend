import mongoose, { isValidObjectId, sanitizeFilter } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!videoId){
        throw new ApiError(403,"Invalid or require video ID")
    }
    
    // defining options for aggregate paginate
    const options = {
        page: parseInt(page, 10),//parseInt accept two arguments and second argument is to specify the base of number system 
                                // in this case it is 10=>decimal
        limit: parseInt(limit, 10)
    }
    // Pagination is useful when dealing with large datasets to limit the number of results returned in each query and
    // improve performance. aggregatePaginate typically returns paginated results, making it suitable for cases where you need to display data in smaller, manageable chunks.
const videoComment = await Comment.aggregatePaginate([{
    $match:{
        video: new mongoose.Types.ObjectId(videoId)
    }
},{
    $lookup:{
        from:"Like",
        localField:"_id",
        foreignField:"comment",
        as:"commentLike"
    }
},{
    $lookup:{
        from:"User",
        localField:"owner",
        foreignField:"_id",
        as:"commentOwner"
    }
},{
    $addFields:{
        commentLikeCount:{
            $size:"$commentLike"
        },
        commentOwner:{
            $first:"$commentOwner"
        },
        isLiked:{
            $cond:{
                if:{$in:[req.user._id,"$commentLike.likedBy"]},
                then:true,
                else:false
            }
        }
    }
},{
    $project:{
        content:1,
        commentLikeCount:1,
        commentOwner:{
            username:1,
            avatar:1
        },
        isLiked:1


    }
}],options)
if(!videoComment){
    throw new ApiError(400,"comment not found in the video")
}
return res.status(200)
          .json(new ApiResponse("vido comment successfully fetched",videoComment,200))
})

const addComment = asyncHandler(async (req, res) => {
    const {content}= req.body
    const {vidoId}=req.params
    // TODO: add a comment to a video
    if(!content){
        throw new ApiError(401,"content is required")
    }
    if(isValidObjectId(vidoId)){
    throw new ApiError("Invalid video id")}
    const comment = await Comment.create({
        content:content,
        video:vidoId,
        owner:req.user._id
    })
    if(!comment){
        throw new ApiError(500,"comment not found")
    }
    return res.status(200)
            .json(
                new ApiResponse("comment is successfully added",comment,200)
            )
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId}=req.params
    const {content}= req.body
    // TODO: update a comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")
    }
    if(!content){
throw new ApiError(400,"content is required")
    }
    const updatedComment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content:content
        }
    },{new:true})
    if(!updatedComment){
        throw new ApiError(400,"error while updating comment")
    }
    return res.status(200)
              .json(new ApiResponse("comment is sucessfully updated ",updatedComment,200))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid comment Id")
    }
    await Comment.findByIdAndDelete(commentId)
return res.status(200)
        .json(new ApiResponse("comment is deleted sucessfully",{},200))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
