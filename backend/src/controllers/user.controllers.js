import mongoose, { Types } from "mongoose";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary, destroyOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { avatarDefaultUrl } from "../constants.js";
import { extractPublicId } from "../utils/GetPublicId.js";

const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(401, "User doe not exist");
        }

        // console.log(user);

        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return refreshToken;

    } catch (error) {
        throw new ApiError(500, `err.message || Something went wrong while generating token`)
    }
}

function toObjectId(value) {
    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }

    if (value?._id) {
        return toObjectId(value._id);
    }

    if (typeof value === "string" && mongoose.Types.ObjectId.isValid(value)) {
        return new mongoose.Types.ObjectId(value);
    }

    throw new Error("Invalid ObjectId");
}





const registerUser = asyncHandler(async (req, res) => {
    // extract user detrails from request body;
    // if any field other than avatar is missing then send a error
    // check if user already exits, if exist throw an error
    // if avatar is present then upload it on cloudinary
    // create a new user
    // remove password and refresh token from response
    // check if user is created
    // return user

    const { email, name, password, bio } = req.body;

    if (
        [email, name, password, bio].some((field) => (!field || field?.trim() === ""))
    ) {
        throw new ApiError(400, "All fields except avatar is required")
    }

    //check if user exist

    const user = await User.findOne({
        email: email
    })

    if (user) {
        throw new ApiError(400, 'User already exist');
    }

    // const avatarLocalFilePath = req.file?.path;
    // let avatarUrl = '';

    // console.log(avatarLocalFilePath)

    // if(avatarLocalFilePath){
    //     const avatar = await uploadOnCloudinary(avatarLocalFilePath)
    //     if( !avatar ){
    //         throw new ApiError(500, "Error while uploading avatar")
    //     }
    //     avatarUrl = avatar.url
    // }

    const createdUser = await User.create({
        name,
        email,
        password,
        bio,
        // avatar: avatarUrl,
    })

    const refreshToken = await generateToken(createdUser._id)

    const newUser = await User.findById(createdUser._id).select("-password")

    if (!newUser) {
        throw new ApiError(500, "Error while creating user");
    }

    return res.status(200)
        .json(new ApiResponse(200, newUser, "User created successfully"))
})


// Controller for user login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User with given email does not exist")
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const refreshToken = await generateToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password")
    if (!loggedInUser) {
        throw new ApiError(500, "Internal Server error occured")
    }

    return res.status(200)
        .json(new ApiResponse(200, loggedInUser, "User logged in successfully"))
})


// controller to pass the details of authenticated user 
const getCurrentUser = asyncHandler((req, res) => {
    return res.status(200)
        .json(new ApiResponse(200, req.user, "Authorised user Details"))
})

//controller to update user profile deatails
const updateProfile = asyncHandler(async (req, res) => {
    const { name, bio } = req.body
    const user = req.user

    let updatedAvatarUrl = user.avatar

    if (req.file && req.file.path) {
        const oldAvatarUrl = user.avatar;
        const oldAvatarPublicId = extractPublicId(oldAvatarUrl)

        const updatedAvatar = await uploadOnCloudinary(req.file.path)
        if (!updatedAvatar) {
            throw new ApiError(500, "Something went wrong while updating avatar")
        }

        updatedAvatarUrl = updatedAvatar.url
        if (oldAvatarUrl !== "https://res.cloudinary.com/drtbzb83i/image/upload/v1757024787/avatar_u56lcz.png") {
            const destroyOldAvatar = destroyOnCloudinary(oldAvatarPublicId);
        }
    }
    const refreshToken = await generateToken(user._id)
    const updatedUser = await User.findByIdAndUpdate(user._id,
        {
            $set: {
                name,
                bio,
                avatar: updatedAvatarUrl
            }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"))

})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )
    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"))
})

const blockUser = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = toObjectId(user._id);
    const userToBeBlockedId = toObjectId(req.params.id);

    if (!(userId && userToBeBlockedId)) {
        throw new ApiError(401, "Logged in user or user to be blocked details is missing!")
    }

    const userToBeBlocked = await User.findById(userToBeBlockedId);

    if (!userToBeBlocked) {
        throw new ApiError(401, "No user with such user id exists.")
    }

    const blockedUsersId = user.blockedList;
    const whiteListId = user.whiteList;

    if (blockedUsersId.some(id => id.equals(userToBeBlockedId))) {
        throw new ApiError(401, "User is already blocked.")
    }

    if (!(blockedUsersId.some(id => id.equals(userToBeBlockedId)))) {
        blockedUsersId.push(userToBeBlockedId);
        user.blockedList = blockedUsersId;
    }

    if (whiteListId.some(id => id.equals(userToBeBlockedId))){
        const newWhiteListId = whiteListId.filter(id => !id.equals(userToBeBlockedId));
        user.whiteList = newWhiteListId;
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "User blocked successfully"));

})


const unBlockUser = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = toObjectId(user._id);
    const userToBeUnblockedId = toObjectId(req.params.id);

    if (!(userId && userToBeUnblockedId)) {
        throw new ApiError(401, "Logged in user or user to be unblocked details is missing!")
    }

    const userToBeUnblocked = await User.findById(userToBeUnblockedId);

    if (!userToBeUnblocked) {
        throw new ApiError(401, "No user with such user id exists.")
    }

    const blockedUsersId = user.blockedList;
    const whiteListId = user.whiteList;

    if (!(blockedUsersId.some(id => id.equals(userToBeUnblockedId)))) {
        throw new ApiError(401, "User is not blocked.")
    }

    if (blockedUsersId.some(id => id.equals(userToBeUnblockedId))) {
        const newBlockedUsersId = blockedUsersId.filter(id => !id.equals(userToBeUnblockedId));
        user.blockedList = newBlockedUsersId;
    }

    if (!whiteListId.some(id => id.equals(userToBeUnblockedId))) {
        whiteListId.push(userToBeUnblockedId);
        user.whiteList = whiteListId;
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "User unblocked successfully"));

})

const addToWhiteList = asyncHandler(async (req, res) => {
    const user = req.user;
    const userId = toObjectId(user._id);
    const idToAdd = toObjectId(req.params.id);
    console.log(idToAdd);

    if (!(userId && idToAdd)) {
        throw new ApiError(401, "Logged in user or user to be added details is missing!")
    }

    const userToAdd = await User.findById(idToAdd);

    if (!userToAdd) {
        throw new ApiError(401, "No user with such user id exists.")
    }

    const blockedUsersId = user.blockedList;
    const whiteListId = user.whiteList;

    if (blockedUsersId.some(id => id.equals(idToAdd))) {
        throw new ApiError(401, "User is blocked.")
    }

    if (whiteListId.some(id => id.equals(idToAdd))) {
        throw new ApiError(401, "User is already in sidebar.")
    }

    if (!whiteListId.some(id => id.equals(idToAdd))) {
        whiteListId.push(userToAdd);
        user.whiteList = whiteListId;
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "User added to sidebar successfully"));

})




export {
    registerUser,
    login,
    getCurrentUser,
    updateProfile,
    logout,
    blockUser,
    unBlockUser,
    addToWhiteList
}