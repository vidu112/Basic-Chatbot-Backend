import { Router } from "express";
import { handleChat, clearHistory } from "../controllers/chatController.js";

const router = Router();

router.post("/", handleChat);
router.post("/clear", clearHistory);

export default router;
