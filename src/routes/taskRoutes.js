// src/routes/taskRoutes.js
import { Router } from "express";
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  listTags
} from "../controllers/taskController.js";
import { ensureAuth } from "../utils/authMiddleware.js";

const router = Router();
router.use(ensureAuth);

router.post("/",    createTask);
router.get("/",     listTasks);
router.get("/tags", listTags);
router.get("/:id",  getTask);
router.put("/:id",  updateTask);
router.delete("/:id", deleteTask);

export default router;
