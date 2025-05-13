// src/routes/userRoutes.js
import { Router } from "express";
import { listUsers } from "../controllers/userController.js";
import { ensureAuth } from "../utils/authMiddleware.js";

const router = Router();
router.use(ensureAuth);
router.get("/", listUsers);
export default router;
