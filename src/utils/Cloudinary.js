import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_NAME_API_KEY,
  api_secret: process.env.CLOUDINARY_NAME_API_SECRET,
});
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload  file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resourse_type: "auto",
    });
    //File has been successfully uploaded
    console.log("file has been successfully uploaded", response.url);
    return response;
  } catch (error) {
    //remove locally saved temporary file as the upload operation failed
    fs.unlinkSync(localFilePath);
  }
};
export { uploadOnCloudinary };
