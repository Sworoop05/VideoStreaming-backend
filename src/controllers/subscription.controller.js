import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const isChannelSubscribed = await Subscription.findOne({
        $or:[{channel:channelId},{ suscriber:req.user?._id}]
    })
    if(isChannelSubscribed){
 await Subscription.findOneAndDelete({channel:channelId})
     return res.status(200)
                .ApiResponse("channel is unsubscibed successfully ",{},200)
    } else{
        const channelSubscribed =await Subscription.create({
            suscriber:req.user?._id,
            channel:channelId
        })
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid channel id")
    }
    const subscriber = await Subscription.aggregate([{
        $match:{
              channel: new mongoose.Types.ObjectId(channelId)
        }
    },{
        $lookup:{
            from:'User',
            localField:"suscriber",
            foreignField:"_id",
            as:"Subscribers"
        }
    },{
        $project:{
            subscribers:{
                username:1,
                avatar:1
            }
        }
    }])
    if(!subscriber){
        throw new ApiError(400,"Subscribers not found")
    }
    return res.status(200)
               .json(
                new ApiResponse("subscrbers are sucessfully fetched",subscriber,200)
               )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(411,"Invalid subscriber id")
}
const chanelSubscribed = await Subscription.aggregate([
    {
        $match:{
            subscriber: new mongoose.Types.ObjectId(subscriberId)
        }
    },,{
        $lookup:{
            from:'User',
            localField:"channel",
            foreignField:"_id",
            as:"channels"
        }
    },{
        $project:{
            channels:{
                username:1,
                avatar:1,
                coverImage:1
            }
        }
    }
])
if(!chanelSubscribed){
    throw new ApiError(400,"No channel found")
}
return res.status(200)
          .json(new ApiResponse("Subscribed channel successfully fetched",chanelSubscribed,200))
})
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}