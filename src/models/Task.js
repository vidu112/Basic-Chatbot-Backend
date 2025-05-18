// src/models/Task.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  at:        { type: Date,    required: true },            // when to notify
  method:    { type: String,  enum: ["email","sms","call","app"], default: "app" },
  sent:      { type: Boolean, default: false },            // has it been delivered?
  createdAt: { type: Date,    default: Date.now }
}, { _id: false });

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "cancelled"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low","medium","high","urgent"],
    default: "medium"
  },
  tags: {
    type: [String],
    default: []
  },
  deadline: {
    type: Date
  },
  // e.g. one-off, daily, weekly, monthly
  recurrence: {
    rule:   { type: String },   // iCal-style RRULE or simple enum
    until:  { type: Date }      // optional end date
  },
  notifications: {
    type: [NotificationSchema],
    default: []
  },
  source: {
    type: String,
    enum: ["chatbot","voice","web","mobile"],
    default: "web"
  },
  subtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }
  ],
  attachments: {
    type: [
      {
        url:       String,
        filename:  String,
        uploadedAt:{ type: Date, default: Date.now }
      }
    ],
    default: []
  },
  comments: {
    type: [
      {
        author:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text:      String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  history: {
    type: [
      {
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        field:     String,
        oldValue:  mongoose.Schema.Types.Mixed,
        newValue:  mongoose.Schema.Types.Mixed,
        at:        { type: Date, default: Date.now }
      }
    ],
    default: []
  }
}, {
  timestamps: true   // adds createdAt & updatedAt
});

export default mongoose.model("Task", TaskSchema);
