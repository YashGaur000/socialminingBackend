import mongoose, { Schema } from "mongoose";

const TaskCompletionSchema = new Schema({
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'User ID is required for task completion']
    },
    taskId: { 
      type: String, 
      required: [true, 'Task ID is required for task completion']
    },
    completedDate: { type: Date, default: Date.now }
  });

  export const TaskCompletion = mongoose.model<Document>('TaskCompletion', TaskCompletionSchema);