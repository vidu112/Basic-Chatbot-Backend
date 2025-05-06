import { Router } from "express";
import cookieParser from "cookie-parser";
import { signup, login, refreshToken, logout ,me} from "../controllers/authController.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { ensureAuth } from "../utils/authMiddleware.js";

const router = Router();
router.use(cookieParser());
router.post("/signup", signup);
router.post("/login",  login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.get("/me", ensureAuth, me);
export default router;
