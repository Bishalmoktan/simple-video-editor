import dotenv from "dotenv";

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  
export const env = {
    CLOUDINARY_API_KEY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_SECRET
    }
