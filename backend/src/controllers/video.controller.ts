import { Request, Response, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";

import path from "path";
import fs from "fs";
import multer from "multer";
import axios from "axios";
import ffmpegPath from "ffmpeg-static";
import { imagesTemplate, videosTemplate } from "../data/data";

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfprobePath(ffprobePath);

// Set up multer storage for temporary file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([{ name: "logo", maxCount: 1 }]);

// Function to convert hex color to FFmpeg format
const hexToFFmpegColor = (hex: string) => {
  // Remove # if present
  const color = hex.replace("#", "");
  // Convert to FFmpeg format (remove alpha if present)
  return color.length > 6 ? color.substring(0, 6) : color;
};

const downloadFile = async (url: string, type: "video" | "image") => {
  const downloadPath = path.join(
    __dirname,
    "../downloads",
    `${type}-${Date.now()}.mp4`
  );

  // Ensure downloads directory exists
  const downloadDir = path.dirname(downloadPath);
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

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

const createTextFilter = (
  text: string,
  position: { x: number; y: number; width: number; height: number },
  color: string,
  startTime: number = 0,
  duration: number = 5,
  fontSize: number = 48,
  fontFamily: string = "Arial"
) => {
  const fontColor = hexToFFmpegColor(color);
  const fadeInDuration = 0.5;
  const fadeOutDuration = 0.5;

  const x = Math.round((position.x / 100) * 1280);
  const y = Math.round((position.y / 100) * 720);

  // Scale font size proportionally based on video resolution (1280x720)
  const scaledFontSize = Math.round((fontSize / 100) * 250);

  return `drawtext=text='${text}':
    fontfile='${fontFamily}':
    fontsize=${scaledFontSize}:
    fontcolor=${fontColor}:
    x=${x}:
    y=${y}:
    alpha='if(lt(t,${startTime}),0,if(lt(t,${startTime + fadeInDuration}),(t-${startTime})/${fadeInDuration},if(lt(t,${
      startTime + duration - fadeOutDuration
    }),1,if(lt(t,${startTime + duration}),(${duration}-(t-${startTime}))/${fadeOutDuration},0))))'
    `
    .replace(/\s+/g, " ")
    .trim();
};

export const createVideoFromImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: "Error uploading files", details: err });
      return;
    }

    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const {
        duration = "5",
        title,
        titlePosition,
        titleColor = "#000000",
        titleFontSize = "48",
        titleFontFamily = "Arial",
        subtitle,
        subtitlePosition,
        subtitleColor = "#000000",
        subtitleFontSize = "32",
        subtitleFontFamily = "Arial",
        logoPosition,
        image,
      } = req.body;

      const logoPath = files.logo?.[0]?.path;

      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      if (!title || !titlePosition) {
        return res
          .status(400)
          .json({ error: "Title and title position are required" });
      }

      const date = Date.now();
      const outputPath = path.join(__dirname, "../output", `video-${date}.mp4`);

      // Ensure downloads directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Parse positions
      const parsedTitlePos = JSON.parse(titlePosition);
      const parsedSubtitlePos = subtitlePosition
        ? JSON.parse(subtitlePosition)
        : null;
      const parsedLogoPos = logoPosition ? JSON.parse(logoPosition) : null;

      // Create complex filter
      let filterComplex: string[] = [];

      // Start with scaling the main input
      filterComplex.push("[0:v]scale=1280:720[scaled]");

      // Add title text with custom font settings
      filterComplex.push(
        `[scaled]${createTextFilter(
          title,
          parsedTitlePos,
          titleColor,
          0.5,
          Number(duration) - 1,
          parseInt(titleFontSize),
          titleFontFamily
        )}[withTitle]`
      );

      let lastLabel = "withTitle";

      // Add subtitle if provided
      if (subtitle && parsedSubtitlePos) {
        filterComplex.push(
          `[${lastLabel}]${createTextFilter(
            subtitle,
            parsedSubtitlePos,
            subtitleColor,
            1,
            Number(duration) - 1.5,
            parseInt(subtitleFontSize),
            subtitleFontFamily
          )}[withSubtitle]`
        );
        lastLabel = "withSubtitle";
      }

      // Add logo with size and position adjustments if provided
      if (logoPath && parsedLogoPos) {
        const x = Math.round((parsedLogoPos.x / 100) * 1280);
        const y = Math.round((parsedLogoPos.y / 100) * 720);
        const logoWidth = parsedLogoPos.width
          ? Math.round((parsedLogoPos.width / 100) * 1280) + 100
          : -1; // Width as percentage
        const logoHeight = parsedLogoPos.height
          ? Math.round((parsedLogoPos.height / 100) * 720) + 50
          : -1; // Height as percentage

        // Add logo input with loop
        filterComplex.push(`movie=${logoPath}:loop=1[logoInput]`);

        // Scale the logo to the specified width and height, if provided
        if (logoWidth > 0 && logoHeight > 0) {
          filterComplex.push(
            `[logoInput]scale=${logoWidth}:${logoHeight}[scaledLogo]`
          );
          // Overlay the logo at the specified position with scaling
          filterComplex.push(
            `[${lastLabel}][scaledLogo]overlay=${x}:${y}:enable='between(t,0,${duration})'[final]`
          );
        } else {
          // If no width or height specified, just overlay without scaling
          filterComplex.push(
            `[${lastLabel}][logoInput]overlay=${x}:${y}:enable='between(t,0,${duration})'[final]`
          );
        }
        lastLabel = "final";
      }

      // Ensure the last filter has the output label
      if (!filterComplex[filterComplex.length - 1].includes("[final]")) {
        filterComplex[filterComplex.length - 1] = filterComplex[
          filterComplex.length - 1
        ].replace(`[${lastLabel}]`, "[final]");
      }

      // Create the video using FFmpeg
      const imagePath = image.startsWith("http")
        ? await downloadFile(image, "image")
        : image;
      const ffmpegCommand = ffmpeg()
        .input(imagePath)
        .inputOptions("-loop 1")
        .inputOptions("-t", duration.toString())
        .complexFilter(filterComplex)
        .outputOptions("-map", "[final]")
        .outputOptions("-c:v", "libx264")
        .outputOptions("-pix_fmt", "yuv420p")
        .save(outputPath)
        .on("end", () => {
          if (image.startsWith("http")) {
            fs.unlinkSync(imagePath);
          }
          // Clean up temporary files
          if (logoPath) fs.unlinkSync(logoPath);

          const videoUrl = `/videos/video-${date}.mp4`;
          res.status(200).json({
            success: true,
            message: "Video created successfully",
            videoUrl,
          });

          const downloadPath = path.join(__dirname, "../downloads");

          res.on("finish", () => {
            console.log(
              "Response finished. Cleaning up downloaded temp files."
            );
            try {
              fs.rmSync(downloadPath, { recursive: true, force: true });
            } catch (err) {
              console.error("Error cleaning up downloaded temp files:", err);
            }
          });
        })
        .on("error", (err, stdout, stderr) => {
          console.error("FFmpeg error:", err);
          console.error("FFmpeg stdout:", stdout);
          console.error("FFmpeg stderr:", stderr);
          next(err);
        });
    } catch (error) {
      next(error);
    }
  });
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
    res.status(400).json({ message: "Provide at least two videos" });
    return;
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
      res.status(400).json({ message: "No media files to process" });
      return;
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
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const outputVideoPath = path.join(tempDir, "output.mp4");

    // Validate transitions array
    const expectedTransitions = mediaFiles.length - 1;
    let transitionsArray = [];

    if (transitions && Array.isArray(transitions)) {
      if (transitions.length !== expectedTransitions) {
        res.status(400).json({
          message: `Number of transitions (${transitions.length}) does not match the required number (${expectedTransitions})`,
        });
        return;
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
      res
        .status(400)
        .json({ message: "One or more unsupported transitions provided." });
      return;
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
