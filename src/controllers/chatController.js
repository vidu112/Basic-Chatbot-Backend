import Message from "../models/Message.js";
import Task  from "../models/Task.js";
import { generateReply,openai, taskFunction } from "../services/openaiService.js";


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
  const { message, sessionId = "default" } = req.body;
  const userId = req.userId;

  try {
    // 1) Save user message
    await Message.create({ userId, sessionId, role: "user", content: message });

    // 2) Grab history for context
    const docs = await Message.find({ userId, sessionId }).sort({ createdAt: 1 }).lean();
    const history = docs.map(d => ({ role: d.role, content: d.content }));

    // 3) Ask GPT, supplying our createTask function schema
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages: [{ role: "system", content: "You are a helpful assistant. You can create tasks by calling createTask." }, ...history, { role: "user", content: message }],
      functions: [taskFunction],
      function_call: "auto"
    });

    const responseMsg = completion.choices[0].message;

    // 4) If GPT wants to call createTask, handle it
    if (responseMsg.function_call) {
      const args = JSON.parse(responseMsg.function_call.arguments);

     // parse & validate deadline
      let deadlineValue = args.deadline
        ? new Date(args.deadline)
        : null;
      if (deadlineValue && isNaN(deadlineValue.valueOf())) {
        console.warn(
          `[chatController] Invalid deadline from function_call: “${args.deadline}”`
        );
        deadlineValue = null;
      }

      // create the task in Mongo
      const newTask = await Task.create({
        title:       args.title,
        description: args.description || "",
        assignedTo:  args.assignedTo || null,
        status:      args.status || "pending",
        priority:    args.priority || "medium",
        tags:        args.tags || [],
        deadline:    deadlineValue,
        createdBy:   userId,
        sessionId
      });

      // first record the function call result in chat history
      const functionResult = `Created task with ID ${newTask._id}`;
      await Message.create({ userId, sessionId, role: "assistant", content: functionResult });

      // 5) Let GPT generate a natural‐language confirmation
      const confirm = await openai.chat.completions.create({
        model: "gpt-4-0613",
        messages: [
          ...history,
          responseMsg,                                    // GPT’s function_call
          { role: "function", name: "createTask", content: JSON.stringify(newTask) }
        ]
      });

      const confirmationText = confirm.choices[0].message.content;
      await Message.create({ userId, sessionId, role: "assistant", content: confirmationText });
      return res.json({ reply: confirmationText });
    }

    // 6) Otherwise, normal LLM reply
    const reply = responseMsg.content;
    await Message.create({ userId, sessionId, role: "assistant", content: reply });
    return res.json({ reply });

  } catch (err) {
    console.error("[chatController] handleChat Error:", err);
    return res.status(500).json({ error: "Failed to handle chat" });
  }
};

// export const handleChat = async (req, res) => {
//   try {
//     const { message, sessionId = "default" } = req.body;
//     const userId = req.userId;

//     // 1) Save user message
//     await Message.create({ userId, sessionId, role: "user", content: message });

//     // 2) Re-fetch entire history for context
//     const docs = await Message
//       .find({ userId, sessionId })
//       .sort({ createdAt: 1 })
//       .lean();
//     const history = docs.map(d => ({ role: d.role, content: d.content }));

//     // 3) Generate & save assistant reply
//     const reply = await generateReply(history);
//     await Message.create({ userId, sessionId, role: "assistant", content: reply });

//     res.json({ reply });
//   } catch (err) {
//     console.error("[chatController] handleChat Error:", err);
//     res.status(500).json({ error: "Failed to handle chat" });
//   }
// };
// /**

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
