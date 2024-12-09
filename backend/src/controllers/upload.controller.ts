import { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import AppError from "../utils/appError";

const storage = multer.diskStorage({});

const upload = multer({
  storage,
});

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
    next(err)
  }
};

export { upload, uploadVideo };
