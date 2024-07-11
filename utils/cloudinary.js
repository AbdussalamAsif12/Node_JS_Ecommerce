import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv" // this line
dotenv.config({
    path: './.env'
})
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        if (!localFilePath.match(/\.(jpg|jpeg|png|gif)$/)) {
            fs.unlinkSync(localFilePath); 
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath);
        return response.secure_url; 
    } catch (err) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export default uploadCloudinary;
