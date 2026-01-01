import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, //It will contain cloudinary URL
            default: "https://res.cloudinary.com/drtbzb83i/image/upload/v1757440860/avatar_icon_gtgh1n.png"
        },
        bio: {
            type: String,
            trim: [true, 'Bio is required'],
            required: true,
            maxlength: [160, 'Bio cannot exceed 160 characters'],
        },
        blockedList: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
            }
        ],
        whiteList: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: []
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
            maxlength: [30, 'Password cannot exceed 30 characters'],
        },
        refreshToken: {
            type: String,
        }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign(
        {
            id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            name: this.name,
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)