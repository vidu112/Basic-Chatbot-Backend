// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, trim: true, unique: true },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true }, // hashed
  refreshToken: { type: String, default: null },
});

export default mongoose.model("User", userSchema);
