import { Router } from "express";
import {
  createVideoFromImage,
  getSampleImages,
  getSampleVideos,
  mergeVideos,
} from "../controllers/video.controller";

const router = Router();

router.post("/create-image-video", createVideoFromImage);
router.post("/merge-videos", mergeVideos);
router.get("/sample-videos", getSampleVideos);
router.get("/sample-images", getSampleImages);

export default router;
