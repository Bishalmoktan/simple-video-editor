import { NextFunction, Request, Response } from "express";
import multer from "multer";
import AppError from "../utils/appError";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.config";

// Video storage configuration
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "demo-reels",
    resource_type: "video",
  }),
});

// Image storage configuration
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "demo-reels-images",
    resource_type: "image",
  }),
});

const videoUpload = multer({ storage: videoStorage });
const imageUpload = multer({ storage: imageStorage });

const uploadVideo = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError("Please provide a video", 400);
    }
    const videoUrl = req.file?.path;
    res.status(200).json({ success: true, videoUrl });
  } catch (err) {
    next(err);
  }
};

const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new AppError("Please provide an image", 400);
    }
    const imageUrl = req.file?.path;
    res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    next(err);
  }
};

export { videoUpload, imageUpload, uploadVideo, uploadImage };
