import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";

connectDB();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/jobs", jobRoutes);

app.use("/api/v1/applications", applicationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});