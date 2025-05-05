import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:     { type: String, required: true, unique: true },
  password:     { type: String, required: true },      // hashed
  refreshToken: { type: String, default: null }        // stored server-side
});

export default mongoose.model("User", userSchema);
