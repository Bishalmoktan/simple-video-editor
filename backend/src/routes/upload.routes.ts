import { Router } from "express";
import {
  videoUpload,
  uploadVideo,
  imageUpload,
  uploadImage,
} from "../controllers/upload.controller";

const router = Router();

router.post("/upload", videoUpload.single("video"), uploadVideo);
router.post("/upload-image", imageUpload.single("image"), uploadImage);

export default router;
