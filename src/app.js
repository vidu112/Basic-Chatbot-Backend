import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { ensureAuth } from "./utils/authMiddleware.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", ensureAuth, chatRoutes);

export default app;
