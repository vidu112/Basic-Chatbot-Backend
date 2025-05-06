import Message from "../models/Message.js";
import { generateReply } from "../services/openaiService.js";

export const getChatHistory = async (req, res) => {
  try {
    const { sessionId = "default" } = req.query;
    const userId = req.userId;

    const docs = await Message
      .find({ userId, sessionId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ messages: docs });
  } catch (err) {
    console.error("[chatController] getChatHistory Error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};


export const handleChat = async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    const userId = req.userId;

    // 1) Save user message
    await Message.create({ userId, sessionId, role: "user", content: message });

    // 2) Re-fetch entire history for context
    const docs = await Message
      .find({ userId, sessionId })
      .sort({ createdAt: 1 })
      .lean();
    const history = docs.map(d => ({ role: d.role, content: d.content }));

    // 3) Generate & save assistant reply
    const reply = await generateReply(history);
    await Message.create({ userId, sessionId, role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("[chatController] handleChat Error:", err);
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
