import { Router } from "express";
import { createVideoFromImage } from "../controllers/video.controller";

const router = Router();

router.post("/create-image-video", createVideoFromImage);

export default router;
