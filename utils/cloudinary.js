import {V2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
})

const uploadImage = async (filePath) => {
    try {
        if(!filePath)
            throw new Error("File path is required");

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(filePath); // Delete the local file after upload
        return response;
    } catch (error) {
        fs.unlinkSync(filePath); // Ensure local file is deleted even if upload fails
        return null;
    }
};
