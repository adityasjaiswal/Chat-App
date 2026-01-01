import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import { config as dotenvConfig } from 'dotenv';

dotenvConfig()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CLOUDINARY_URL= process.env.CLOUDINARY_URL


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath);
        // console.log(response)
        // fs.unlink(localFilePath);
        return response;
    }
    catch(e){
        // fs.unlink(localFilePath);
        console.log(e.message)
        return null;
    }
}

const destroyOnCloudinary = async (public_id) => {
    try{
        if(!public_id) return "Need to provide public id";

        const response = await cloudinary.uploader.destroy(public_id);
        return response;
    }
    catch(e){
        return e.message;
    }
}

export {
    uploadOnCloudinary,
    destroyOnCloudinary
}