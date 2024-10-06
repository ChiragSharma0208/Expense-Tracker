var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
const uploadToCloudinary = (localFilePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (!localFilePath) {
        console.error('No file path provided to uploadToCloudinary');
        return null;
    }
    try {
        const res = yield cloudinary.uploader.upload(localFilePath, {
            public_id: String(Math.floor(Math.random() * 10 + 1)),
            resource_type: "image",
            folder: "expences"
        });
        console.log("file uploaded successfully ");
        fs.unlinkSync(localFilePath);
        return res;
    }
    catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath);
        console.log("error while uploading to cloudinary");
        return null;
    }
});
export default uploadToCloudinary;
