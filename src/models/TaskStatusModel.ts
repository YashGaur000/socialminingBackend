import { Schema, model } from 'mongoose';
import { ITask } from '../types/schema';




const taskSchema = new Schema<ITask>({
  taskName: { type: String, required: true },
  completed: { type: Boolean, default: false },
  completedDate: { type: Date }
});

const Task = model<ITask>('Task', taskSchema);
export default Task;


