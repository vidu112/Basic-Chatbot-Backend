// src/controllers/taskController.js
import Task from "../models/Task.js";

/** POST /api/tasks  → create a new task */
export async function createTask(req, res) {
  try {
    const {
      title,
      description,
      assignedTo,
      deadline,
      priority,
      status,
      tags
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      createdBy: req.userId,
      assignedTo: assignedTo || null,
      deadline: deadline ? new Date(deadline) : null,
      priority,
      status,
      tags
    });

    return res.status(201).json({ task });
  } catch (err) {
    console.error("[taskController] createTask:", err);
    return res.status(500).json({ error: "Failed to create task" });
  }
}

/** GET /api/tasks  → list tasks for current user */
export async function listTasks(req, res) {
    try {
      const tasks = await Task.find({
        $or: [{ createdBy: req.userId }, { assignedTo: req.userId }]
      })
        .populate("assignedTo", "firstName lastName username")
        .sort({ deadline: 1, priority: -1 })
        .lean();
      res.json({ tasks });
    } catch (err) {
      console.error("❌ listTasks:", err);
      res.status(500).json({ error: "Failed to list tasks" });
    }
  }

  export async function getTask(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      const task = await Task.findById(id)
        .populate("subtasks")
        .populate("comments.author", "firstName lastName username")
        .lean();
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ task });
    } catch (err) {
      console.error("❌ getTask:", err);
      res.status(500).json({ error: "Failed to get task" });
    }
  }

  export async function updateTask(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      const updates = req.body;
      const task = await Task.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ task });
    } catch (err) {
      console.error("❌ updateTask:", err);
      res.status(500).json({ error: "Failed to update task" });
    }
  }

  export async function deleteTask(req, res) {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ error: "Invalid task ID" });
      }
      const result = await Task.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("❌ deleteTask:", err);
      res.status(500).json({ error: "Failed to delete task" });
    }
  }

  export async function listTags(req, res) {
    try {
      const tags = await Task.distinct("tags");
      res.json({ tags });
    } catch (err) {
      console.error("❌ listTags:", err);
      res.status(500).json({ error: "Failed to list tags" });
    }
  }