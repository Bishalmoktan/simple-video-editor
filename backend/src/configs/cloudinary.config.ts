import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import { env } from "./env.config";

dotenv.config();

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

