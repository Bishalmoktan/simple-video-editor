import express, { Application } from "express";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.routes";
import videoRoutes from "./routes/video.routes";
import errorHandler from "./middlewares/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/videos", express.static(path.join(__dirname, "output")));
// Routes
app.use("/api/videos", uploadRoutes);
app.use("/api/videos", videoRoutes);

app.use(errorHandler);

export default app;
