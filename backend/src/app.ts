import express, { Application } from "express";
import cors from "cors";

import uploadRoutes from "./routes/upload.routes";
import errorHandler from "./middlewares/error.middleware";


const app : Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", uploadRoutes);

app.use(errorHandler);

export default app;