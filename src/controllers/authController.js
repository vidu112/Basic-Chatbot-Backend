import bcrypt from "bcrypt";
import User from "../models/User.js";
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
  const { username, email, firstName, lastName, password } = req.body;
  if (!username || !email || !firstName || !lastName || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Check for existing username OR email
  if (await User.exists({ $or: [{ username }, { email }] })) {
    return res.status(409).json({ error: "Username or email already taken" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    firstName,
    lastName,
    password: hashed
  });

  // Respond with user info (no tokens yet)
  return res.status(201).json({
    id:        user._id,
    username:  user.username,
    email:     user.email,
    firstName: user.firstName,
    lastName:  user.lastName
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
    } catch {}
  }
  return res.clearCookie("jid", COOKIE_OPTS).json({ success: true });
}
