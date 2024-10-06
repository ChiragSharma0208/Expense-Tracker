import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
})


const uploadToCloudinary = async(localFilePath:string)=>{    
    if (!localFilePath) {
        console.error('No file path provided to uploadToCloudinary');
        return null;
    }
    try {
        
        const res = await cloudinary.uploader.upload(localFilePath,{
            public_id: String(Math.floor(Math.random()*10+1)),
            resource_type: "image",
            folder: "expences"
        })
        console.log("file uploaded successfully ");
        fs.unlinkSync(localFilePath);
        return res;
    } catch (error) {
        console.log(error);
        
        fs.unlinkSync(localFilePath);
        console.log("error while uploading to cloudinary");
        return null;
    }
}

export default uploadToCloudinary;