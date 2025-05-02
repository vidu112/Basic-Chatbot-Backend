import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const systemPrompt =
  "You are a friendly and concise chatbot named Eve. Always keep responses very short and to the point. Introduce yourself at the start.";

/**
 * Generates a reply from OpenAI using the full message history.
 * @param {{ role: string, content: string }[]} history
 * @returns {Promise<string>} reply text
 */
export async function generateReply(history) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages
  });

  return completion.choices[0].message.content.trim();
}
