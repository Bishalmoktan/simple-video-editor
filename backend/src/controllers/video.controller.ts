import { Request, Response, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";

if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

export const createVideoFromImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageUrl, duration = 5 } = req.body;

    if (!imageUrl) {
      res.status(400).json({ error: "Image URL is required" });
      return;
    }

    const outputPath = path.join(
      __dirname,
      "../output",
      `video-${Date.now()}.mp4`
    );

    // Create the video using FFmpeg
    ffmpeg()
      .input(imageUrl)
      .inputOptions("-loop 1") // Loop the image
      .inputOptions("-t", duration.toString()) // Set duration
      .outputOptions("-c:v libx264") // Video codec
      .outputOptions("-pix_fmt yuv420p") // Pixel format
      .outputOptions("-vf", "scale=1280:720") // Scale to 1280x720 resolution
      .save(outputPath)
      .on("end", () => {
        res.status(200).json({
          success: true,
          message: "Video created successfully",
          videoPath: outputPath,
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        console.log(err);
        next(err);
      });
  } catch (error) {
    next(error);
  }
};
