import { Request, Response, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import multer from "multer";

// Set ffmpeg path
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

// Set up multer storage for temporary image upload
const storage = multer.diskStorage({});

const upload = multer({ storage }).single("image"); // Handle single image upload

// Middleware to handle file upload and video creation
export const createVideoFromImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: "Error uploading file", details: err });
      return;
    }

    try {
      const { duration = 5 } = req.body;
      const uploadedImagePath = req.file?.path; // Get the temporary file path

      if (!uploadedImagePath) {
        return res.status(400).json({ error: "Image is required" });
      }

      const date = Date.now();

      const outputPath = path.join(__dirname, "../output", `video-${date}.mp4`);

      // Create the video using FFmpeg
      ffmpeg()
        .input(uploadedImagePath)
        .inputOptions("-loop 1") // Loop the image
        .inputOptions("-t", duration.toString()) // Set duration
        .outputOptions("-c:v libx264") // Video codec
        .outputOptions("-pix_fmt yuv420p") // Pixel format
        .outputOptions("-vf", "scale=1280:720") // Scale to 1280x720 resolution
        .save(outputPath)
        .on("progress", (progress) => {
          console.log(progress);
        })
        .on("end", () => {
          // Optionally delete the temporary image file after video creation
          fs.unlinkSync(uploadedImagePath);
          const videoUrl = `/videos/video-${date}.mp4`;
          res.status(200).json({
            success: true,
            message: "Video created successfully",
            videoUrl,
          });
        })
        .on("error", (err, stdout, stderr) => {
          console.error(stdout);
          console.error(stderr);
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
};
