import express from "express";
import cors from "cors";
import "dotenv/config";
import "./config/db.js";              // Initialize MongoDB connection
import chatRoutes from "./routes/chatRoutes.js";
import { requestLogger } from "./utils/logger.js";

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

// Mount chat routes
app.use("/api/chat", chatRoutes);

export default app;
