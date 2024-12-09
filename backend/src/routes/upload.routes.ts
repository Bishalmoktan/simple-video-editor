import { Router } from "express";
import { upload, uploadVideo } from "../controllers/upload.controller";

const router = Router();

router.post("/upload", upload.single("video"), uploadVideo);

export default router;