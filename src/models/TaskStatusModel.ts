import { Schema, model } from 'mongoose';
import { ITask } from '../types/schema';




const TaskSchema = new Schema({
  taskId: { 
    type: String, 
    required: [true, 'Task ID is required'],
    unique: true
  },
  taskName: { 
    type: String, 
    required: [true, 'Task name is required']
  },
  platform: { 
    type: String, 
    enum: {
      values: ['twitter', 'reddit', 'telegram', 'discord'],
      message: '{VALUE} is not a supported platform for tasks'
    },
    required: [true, 'Platform for the task is required']
  }
});

const Task = model<ITask>('Task', TaskSchema);
export default Task;


