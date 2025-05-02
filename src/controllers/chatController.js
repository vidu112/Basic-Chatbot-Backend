import Message from "../models/Message.js";
import { generateReply } from "../services/openaiService.js";

/**
 * Handle incoming chat:
 *  - save user message
 *  - fetch history
 *  - generate reply
 *  - save reply
 */
export const handleChat = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    if (!message) return res.status(400).json({ error: "Missing message" });

    // Save user message
    await Message.create({ sessionId, role: "user", content: message });

    // Fetch full history for this session
    const docs = await Message.find({ sessionId }).sort({ createdAt: 1 }).lean();
    const history = docs.map(d => ({ role: d.role, content: d.content }));

    // Generate assistant reply
    const reply = await generateReply(history);

    // Save assistant message
    await Message.create({ sessionId, role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("[chatController] Error:", err);
    res.status(500).json({ error: "Failed to handle chat" });
  }
};

/**
 * Clear chat history for a session
 */
export const clearHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.body;
    await Message.deleteMany({ sessionId });
    res.json({ success: true });
  } catch (err) {
    console.error("[chatController] clearHistory Error:", err);
    res.status(500).json({ error: "Failed to clear history" });
  }
};
