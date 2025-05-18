// src/controllers/verifyController.js
import User from "../models/User.js";

export async function verifyEmail(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  const user = await User.findOne({
    verifyToken: token,
    verifyExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).send("Invalid or expired token");
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyExpires = undefined;
  await user.save();

  // Redirect to a “verified” page, or just send JSON
  return res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
}
