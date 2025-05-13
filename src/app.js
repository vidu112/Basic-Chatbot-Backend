import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { ensureAuth } from "./utils/authMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Auth & profile
app.use("/api/auth", authRoutes);

// User list (for assignment dropdown)
app.use("/api/users",ensureAuth, userRoutes);

// Task endpoints
app.use("/api/tasks",ensureAuth, taskRoutes);

// Chat & other protected routes
app.use("/api/chat", ensureAuth, chatRoutes);

export default app;
