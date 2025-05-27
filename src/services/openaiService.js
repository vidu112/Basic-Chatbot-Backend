import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const systemPrompt =
  "You are a friendly and concise chatbot named Eve. Always keep responses very short and to the point. Introduce yourself at the start. Your main job is an assiantant for user to keep track of tasks";


  export const taskFunction = {
  name: "createTask",
  description: "Create a new task in the task manager",
  parameters: {
    type: "object",
    properties: {
      title:        { type: "string", description: "Title of the task" },
      description:  { type: "string", description: "Detailed description" },
      assignedTo:   { type: "string", description: "User ID to assign to" },
      status:       { 
        type: "string",
        enum: ["pending","in_progress","completed","cancelled"]
      },
      priority:     {
        type: "string",
        enum: ["low","medium","high","urgent"]
      },
      tags: {
        type: "array",
        items: { type: "string" }
      },
      deadline:     { type: "string", format: "date-time" }
    },
    required: ["title"]
  }
};
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
