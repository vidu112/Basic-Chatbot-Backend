import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/mailService.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../services/tokenService.js";

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict",
  path:     "/api/auth/refresh-token"
};

export async function signup(req, res) {
  let { username, email, firstName, lastName, password } = req.body;
  username = username.trim().toLowerCase();
  email    = email.trim().toLowerCase();

  if (!username||!email||!firstName||!lastName||!password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (await User.exists({ $or: [{ username }, { email }] })) {
    return res.status(409).json({ error: "Username or email taken" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyExpires = Date.now() + 24*60*60*1000; // 24h

  const user = await User.create({
    username, email, firstName, lastName,
    password: hashed,
    verifyToken,
    verifyExpires
  });

  // send email *after* creating user
  await sendVerificationEmail(email, verifyToken);

  res.status(201).json({
    id: user._id, username: user.username, email: user.email,
    firstName: user.firstName, lastName: user.lastName,
    message: "Verification email sent."
  });
}

export async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  

  // Issue tokens...
  const at = signAccessToken({ sub: user._id });
  const rt = signRefreshToken({ sub: user._id });
  user.refreshToken = rt;
  await user.save();

  res.cookie("jid", rt, COOKIE_OPTS).json({ accessToken: at });
}

export async function refreshToken(req, res) {
  const token = req.cookies.jid;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  let payload;
  try { payload = verifyRefreshToken(token); }
  catch { return res.status(401).json({ error: "Invalid refresh token" }); }

  const user = await User.findById(payload.sub);
  if (!user || user.refreshToken !== token) {
    return res.status(401).json({ error: "Invalid session" });
  }

  // Issue new Access Token (console-logged)
  const at = signAccessToken({ sub: user._id });
  return res.json({ accessToken: at });
}

export async function logout(req, res) {
  const token = req.cookies.jid;
  if (token) {
    try {
      const { sub } = verifyRefreshToken(token);
      await User.findByIdAndUpdate(sub, { refreshToken: null });
    } catch (err) {
      console.error("logout Servr error ", err);
      return res.status(500).json({ error: "Log Out Server error" });
    }
  }
  return res.clearCookie("jid", COOKIE_OPTS).json({ success: true });
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.userId).select("username email isVerified");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    console.error("[authController.me]", err);
    return res.status(500).json({ error: "Server error" });
  }
}