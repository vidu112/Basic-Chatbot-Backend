import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} = process.env;

// safe-guard
if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  console.error("🚨 Missing JWT secrets"); process.exit(1);
}

export function signAccessToken(payload) {
  const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  console.log("🔐 Issued Access Token:", token);
  return token;
}

export function signRefreshToken(payload) {
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
  // note: we do not log refresh tokens
  return token;
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
