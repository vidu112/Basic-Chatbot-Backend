// src/routes/chatRoutes.js
import { Router } from "express";
import { getChatHistory, handleChat, clearHistory } from "../controllers/chatController.js";
import { ensureAuth } from "../utils/authMiddleware.js";

const router = Router();

// Protect all chat routes
router.use(ensureAuth);

router.get("/",    getChatHistory);
router.post("/",   handleChat);
router.post("/clear", clearHistory);

export default router;
