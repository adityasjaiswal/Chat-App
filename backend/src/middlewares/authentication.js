import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"

export const protectRoute = asyncHandler(async (req, _, next) => {
    try {
        const token = req.header("token")
        if (!token) {
            throw new ApiError(401, "Unauthorised request")
        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?.id).select("-password")
        if(!user){
            throw new ApiError(401, "Invalid token")
        }
        if (user.refreshToken !== token) {
            throw new ApiError(401, "Invalid token or token expired")
        }
        const verifiedUser = await User.findById(decodedToken?.id).select("-password")
        req.user = verifiedUser
        next()

    }catch (error){
        throw new ApiError(401, error.message || 'Unauthorised user token')
    }
})