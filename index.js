import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let chatHistory = []

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    chatHistory.push({ role: "user", content: userMessage });

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a friendly and concise chatbot named Eve. Always keep responses very short and to the point. introduce yourself at the start",
        },
        ...chatHistory,
      ],
    });
    

    const reply = chatCompletion.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });
    res.json({ reply });
  } catch (err) {
    console.error("Error from OpenAI:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
