import { Router } from "express";
import cookieParser from "cookie-parser";
import { signup, login, refreshToken, logout } from "../controllers/authController.js";

const router = Router();
router.use(cookieParser());
router.post("/signup", signup);
router.post("/login",  login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
export default router;
