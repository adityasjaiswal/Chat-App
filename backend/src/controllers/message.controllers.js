import mongoose from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/Cloudinary.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { io, userSocketMap } from '../app.js'

// get all users except logged in user

const getUserAndUnreadMessages = asyncHandler(async (req, res) => {

    try {
        const loggedInUserId = req.user._id
        const loggedInUser = await User.findById(loggedInUserId);

        if (!loggedInUserId) {
            throw new ApiError(401, "Unauthorised user access")
        }

        const users = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("-password -refreshToken")

        const usersForSidebar = await User.find({
            _id: {
                $in: loggedInUser.whiteList
            }
        }).select("-password -refreshToken")

        //count number of messsages that are not seen

        const unseenMessages = {}

        await Promise.all(
            users.map(async (user) => {
                const unseen = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    seen: false,
                });

                if (unseen > 0) {
                    unseenMessages[user._id.toString()] = unseen;
                }
            })
        );

        let usersForSidebarId = usersForSidebar.map(user => user._id);

        const leftOutUsers = await User.find({
            _id: {
                $nin: usersForSidebarId,
                $ne: loggedInUserId
            }
        }).select("-password -refreshToken")

        return res.status(200)
            .json(new ApiResponse(200, { usersForSidebar, leftOutUsers, unseenMessages }, "All users except logged in user and unseen messsages"))

    } catch (error) {
        throw new ApiError(error.status || 401, error.message || "Error in getUser controller")
    }
})

// Controller to get messages for selected user
const getMessages = asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id
    const { id: selectedUserId } = req.params

    if(!(loggedInUserId && selectedUserId)){
        throw new ApiError(401, "Logged in user or selected user details is missing")
    }

    const markRead = await Message.updateMany(
        {
            senderId: selectedUserId,
            receiverId: loggedInUserId
        },
        { seen: true }
    )
    const messages = await Message.find({
        $or: [{
            senderId: loggedInUserId,
            receiverId: selectedUserId
        },
        {
            senderId: selectedUserId,
            receiverId: loggedInUserId
        }]
    })
    return res.status(200)
           .json(new ApiResponse(200, messages, "Messages fetched successfully"))
})

const markMessageAsSeen = asyncHandler(async (req,res) => {
    const {id: messageId} = req.params
    const update = await Message.findByIdAndUpdate(messageId, {
        $set: {
            seen: true
        }
    })
    return res.status(200).json(new ApiResponse(200, {}, "Selected user message is marked as seen"))
})


// send message to selected user
const sendMessage = asyncHandler(async (req, res) => {
    const {text} = req.body
    const receiverId = req.params.id
    const senderId = req.user._id
    const imageLocalPath = req.file?.path
    let imageUrl;
    if(imageLocalPath){
        const response = await uploadOnCloudinary(imageLocalPath)
        if(!response){
            throw new ApiError(500, "Error while uploading image")
        }
        imageUrl = response.url
    }
    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl,
        seen: false
    })

    // Send the message to the receiver
    if(userSocketMap[receiverId]){
        io.to(userSocketMap[receiverId]).emit('newMessage', newMessage)
    }

    return res.status(200).json(new ApiResponse(200, newMessage, "Message successfully sent"))

})





export {
    getUserAndUnreadMessages,
    getMessages,
    markMessageAsSeen,
    sendMessage,
}