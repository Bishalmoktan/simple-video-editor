import { Request, Response, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";

import path from "path";
import fs from "fs";
import multer from "multer";
import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import { imagesTemplate, videosTemplate } from "../data/data";
import AppError from "../utils/appError";
import { ensureDirectoryExists } from "../utils/utils";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfprobePath(ffprobePath);

// Set up multer storage for temporary file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");

const downloadFile = async (url: string, type: "video" | "image") => {
  const downloadPath = path.join(
    __dirname,
    "../downloads",
    `${type}-${Date.now()}.mp4`
  );

  ensureDirectoryExists(path.dirname(downloadPath));

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  const writer = fs.createWriteStream(downloadPath);
  response.data.pipe(writer);

  return new Promise<string>((resolve, reject) => {
    writer.on("finish", () => resolve(downloadPath));
    writer.on("error", reject);
  });
};

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

      const tempDir = path.join(__dirname, "../output");
      ensureDirectoryExists(tempDir);
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

export const addTextToVideo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title = "Default Title",
      subtitle = "Default Subtitle",
      fontColor = "white",
      titleFontSizePercentage = 3, // Font size as a percentage of video width
      subtitleFontSizePercentage = 2, // Font size as a percentage of video width
      titleXPercent = 50, // Centered horizontally by default
      titleYPercent = 25, // Vertically at 1/4th of the height by default
      subtitleXPercent = 50, // Centered horizontally by default
      subtitleYPercent = 33, // Vertically at 1/3rd of the height by default
      video,
      fontFamily = "Arial", // Default font family
    } = req.body;

    const uploadedVideoPath = await downloadFile(video, "video");

    if (!uploadedVideoPath) {
      res.status(400).json({ error: "Video is required" });
      return;
    }

    // Fixed video dimensions
    const videoWidth = 1280;
    const videoHeight = 720;

    // Calculate font sizes based on the video width
    const titleFontSize = (videoWidth * titleFontSizePercentage) / 100;
    const subtitleFontSize = (videoWidth * subtitleFontSizePercentage) / 100;

    // Calculate pixel positions based on fixed dimensions
    const titleX = (videoWidth * titleXPercent) / 100; // Horizontal position for title
    const titleY = (videoHeight * titleYPercent) / 100; // Vertical position for title
    const subtitleX = (videoWidth * subtitleXPercent) / 100; // Horizontal position for subtitle
    const subtitleY = (videoHeight * subtitleYPercent) / 100; // Vertical position for subtitle

    const date = Date.now();
    const tempDir = path.join(__dirname, "../output");
    ensureDirectoryExists(tempDir);
    const outputPath = path.join(tempDir, `video-with-text-${date}.mp4`);

    // Use FFmpeg to overlay text on the video
    ffmpeg()
      .input(uploadedVideoPath) // Input video
      .outputOptions("-c:v libx264") // Video codec
      .outputOptions("-pix_fmt yuv420p") // Pixel format
      .outputOptions(
        "-vf",
        `
          drawtext=text='${title}':fontfile=${fontFamily}:fontcolor=${fontColor}:fontsize=${Math.round(titleFontSize)}:x=${titleX}:y=${titleY},
          drawtext=text='${subtitle}':fontfile=${fontFamily}:fontcolor=${fontColor}:fontsize=${Math.round(subtitleFontSize)}:x=${subtitleX}:y=${subtitleY}
        `
      ) // Overlay text on the video
      .save(outputPath) // Save the output video
      .on("progress", (progress) => {
        console.log("Processing:", progress);
      })
      .on("end", () => {
        // Optionally delete the temporary video file after processing
        fs.unlinkSync(uploadedVideoPath);
        const videoUrl = `/videos/video-with-text-${date}.mp4`;
        res.status(200).json({
          success: true,
          message: "Video processed successfully",
          videoUrl,
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg Error:", err);
        console.error("Stdout:", stdout);
        console.error("Stderr:", stderr);
        next(err);
      });
  } catch (error) {
    next(error);
  }
};

function getMediaInfo(filePath: string) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const hasAudio = metadata.streams.some(
          (stream) => stream.codec_type === "audio"
        );
        const duration = metadata.format.duration;
        resolve({ hasAudio, duration });
      }
    });
  });
}

export const mergeVideos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { videoUrls, transitions, userType = "free" } = req.body; // Add userType to request body
  console.log(videoUrls);
  if (!videoUrls || videoUrls.length === 1) {
    throw new AppError("Please provide at least two videos", 400);
  }

  try {
    const mediaFiles = [];
    const mediaInfos = [];

    // Download video files
    if (videoUrls && videoUrls.length > 0) {
      const videoFiles = await Promise.all(
        videoUrls.map((url: string) => downloadFile(url, "video"))
      );
      mediaFiles.push(...videoFiles);
    }

    if (mediaFiles.length === 0) {
      throw new AppError("No media files to process", 400);
    }

    // Get media info for each file
    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaInfo = await getMediaInfo(mediaFiles[i]);
      mediaInfos.push({
        file: mediaFiles[i],
        //@ts-expect-error
        hasAudio: mediaInfo.hasAudio,
        //@ts-expect-error
        duration: mediaInfo.duration,
      });
    }

    const tempDir = path.join(__dirname, "../output");
    ensureDirectoryExists(tempDir);

    const outputVideoPath = path.join(tempDir, "output.mp4");

    // Validate transitions array
    const expectedTransitions = mediaFiles.length - 1;
    let transitionsArray = [];

    if (transitions && Array.isArray(transitions)) {
      if (transitions.length !== expectedTransitions) {
        throw new AppError(
          `Number of transitions (${transitions.length}) does not match the required number (${expectedTransitions})`,
          400
        );
      }
      transitionsArray = transitions;
    } else {
      transitionsArray = Array(expectedTransitions).fill("none");
    }

    // Validate transitions
    const supportedTransitions = [
      "fade",
      "wipeleft",
      "wiperight",
      "slideup",
      "slidedown",
      "circleopen",
      "circleclose",
    ];

    if (!transitionsArray.every((t) => supportedTransitions.includes(t))) {
      throw new AppError("One or more unsupported transitions provided.", 400);
    }

    // Build the FFmpeg command
    let ffmpegCommand = ffmpeg();

    // Add all input media files
    mediaFiles.forEach((file) => {
      ffmpegCommand = ffmpegCommand.addInput(file);
    });

    // Prepare the filter_complex string with transitions
    let filterComplex = "";
    const transitionDuration = 1;

    // Prepare video scaling, setting framerate, and labeling
    for (let i = 0; i < mediaFiles.length; i++) {
      filterComplex += `[${i}:v]scale=1280:720,setsar=1,fps=25,format=yuv420p,settb=AVTB[v${i}];`;
    }

    // Prepare audio streams (generate silent audio if needed)
    for (let i = 0; i < mediaFiles.length; i++) {
      if (!mediaInfos[i].hasAudio) {
        filterComplex += `aevalsrc=0:d=${mediaInfos[i].duration}[a${i}];`;
      }
    }

    // Initialize the video merging process
    let lastVideo = `[v0]`;
    let totalDuration = 0;

    for (let i = 1; i < mediaFiles.length; i++) {
      const currentVideo = `[v${i}]`;
      const transition = transitionsArray[i - 1] || "none";
      const outputVideo = `[v_temp${i}]`;

      totalDuration +=
        parseFloat(mediaInfos[i - 1].duration) - transitionDuration;

      if (transition === "none") {
        filterComplex += `${lastVideo}${currentVideo}concat=n=2:v=1:a=0[${outputVideo.slice(1, -1)}];`;
      } else {
        filterComplex += `${lastVideo}${currentVideo}xfade=transition=${transition}:duration=${transitionDuration}:offset=${totalDuration}[${outputVideo.slice(1, -1)}];`;
      }

      lastVideo = outputVideo;
    }

    // Handle audio concatenation
    let audioInputs = [];
    for (let i = 0; i < mediaFiles.length; i++) {
      const audioLabel = mediaInfos[i].hasAudio ? `[${i}:a]` : `[a${i}]`;
      audioInputs.push(audioLabel);
    }

    // Concatenate audio streams
    const audioConcatInputs = audioInputs.join("");
    filterComplex += `${audioConcatInputs}concat=n=${mediaFiles.length}:v=0:a=1[aout];`;

    // Get the final video label before watermark
    const finalVideoLabel =
      mediaFiles.length > 1 ? `[v_temp${mediaFiles.length - 1}]` : `[v0]`;

    // Add watermark for free users
    const finalOutputLabel =
      userType === "free" ? "[watermarked]" : finalVideoLabel;

    if (userType === "free") {
      filterComplex += `${finalVideoLabel}drawtext=text='Band Breeze':fontsize=144:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2:alpha=0.5${finalOutputLabel};`;
    }

    ffmpegCommand
      .complexFilter(filterComplex)
      .outputOptions([
        "-map",
        finalOutputLabel,
        "-map",
        "[aout]",
        "-preset",
        "fast",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-pix_fmt",
        "yuv420p",
        "-r",
        "25",
      ])
      .on("start", (commandLine) => {
        console.log(`FFmpeg command: ${commandLine}`);
      })
      .on("end", () => {
        console.log("Merging complete. Sending file...");
        res.sendFile(outputVideoPath, (err) => {
          if (err) {
            console.error("Error sending file:", err);
            res.status(500).json({
              message: "Error sending merged video",
              error: err.message,
            });
          }
        });
      })
      .on("error", (err, stdout, stderr) => {
        console.error("FFmpeg Error:", err.message);
        console.error("FFmpeg Stdout:", stdout);
        console.error("FFmpeg Stderr:", stderr);
        res.status(500).json({
          message: "Error merging videos",
          error: stderr || err.message,
        });
      })
      .save(outputVideoPath);
  } catch (err) {
    next(err);
  }
};

export const getSampleVideos = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    videos: videosTemplate,
  });
};

export const getSampleImages = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    images: imagesTemplate,
  });
};
