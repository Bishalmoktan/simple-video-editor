import { Router } from "express";
import {
  createVideoFromImage,
  mergeVideos,
} from "../controllers/video.controller";

const router = Router();

router.post("/create-image-video", createVideoFromImage);
router.post("/merge-videos", mergeVideos);

export default router;
