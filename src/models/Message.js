import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: String, required: true },
  role:      { type: String, required: true },  // 'system' | 'user' | 'assistant'
  content:   { type: String, required: true },
  createdAt: { type: Date,   default: Date.now }
});

export default mongoose.model("Message", messageSchema);
