import { NextFunction, Request, Response } from "express";
import multer from "multer";
import AppError from "../utils/appError";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.config";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

// Video storage configuration
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "demo-reels",
    resource_type: "video",
  }),
});

const videoUpload = multer({ storage: videoStorage });
const imageUpload = multer({ dest: "temp/" });

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

    const inputPath = req.file.path;
    const outputPath = path.join("temp", `scaled-${Date.now()}.jpg`);

    ffmpeg(inputPath)
      .size("1280x720")
      .on("end", async () => {
        if (req.file) {
          req.file.path = outputPath;
          const cloudinaryUpload = await cloudinary.uploader.upload(
            outputPath,
            {
              folder: "demo-reels-images",
              resource_type: "image",
            }
          );

          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);

          res
            .status(200)
            .json({ success: true, imageUrl: cloudinaryUpload.secure_url });
        }
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        next(new AppError("Error processing video", 500));
      })
      .save(outputPath);
  } catch (err) {
    next(err);
  }
};

export { videoUpload, imageUpload, uploadVideo, uploadImage };
