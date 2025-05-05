import { verifyAccessToken } from "../services/tokenService.js";

export function ensureAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No auth header" });

  const token = header.split(" ")[1];
  try {
    const { sub } = verifyAccessToken(token);
    req.userId = sub;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid access token" });
  }
}
