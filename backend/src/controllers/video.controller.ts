import { Request, Response, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import multer from "multer";
import axios from "axios";

// Set ffmpeg path
if (ffmpegPath) ffmpeg.setFfmpegPath(ffmpegPath);

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

const downloadImage = async (url: string) => {
  const downloadPath = path.join(
    __dirname,
    "../downloads",
    `image-${Date.now()}.jpg`
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
  const scaledFontSize = Math.round((fontSize / 100) * 300);

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
        const x = Math.round((parsedLogoPos.x / 100) * 1280); // Position X in pixels based on 1280 width
        const y = Math.round((parsedLogoPos.y / 100) * 720); // Position Y in pixels based on 720 height
        const logoWidth = parsedLogoPos.width
          ? Math.round((parsedLogoPos.width / 100) * 1280)
          : -1; // Width as percentage
        const logoHeight = parsedLogoPos.height
          ? Math.round((parsedLogoPos.height / 100) * 720)
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
        ? await downloadImage(image)
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
