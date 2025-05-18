// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true, lowercase:true, trim:true },
  email:        { type: String, required: true, unique: true, lowercase:true, trim:true },
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  password:     { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  verifyToken:  { type: String },
  verifyExpires:{ type: Date },
  refreshToken: { type: String, default: null }
});

export default mongoose.model("User", userSchema);
