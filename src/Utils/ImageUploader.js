import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
const ImageUploader = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path);
        fs.unlinkSync(file.path);//deletes the file from the server
        consale.log("Image uploaded successfully");
        return result;
    } catch (error) {
        console.log("Error while uploading image", error);
    }
}

export default ImageUploader;