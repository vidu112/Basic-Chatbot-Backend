// src/controllers/userController.js
import User from "../models/User.js";

/** GET /api/users → [ { _id, username, firstName, lastName } ] */
export async function listUsers(req, res) {
  try {
    const users = await User.find()
      .select("_id username firstName lastName")
      .sort({ firstName: 1, lastName: 1 });
    res.json({ users });
  } catch (err) {
    console.error("[userController] listUsers:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
}
