import mongoose, { Schema, Document } from 'mongoose';

// Define the UserAccount interface to represent the structure of an admin account
interface Task extends Document {
    user: String,
    title: string;
    description: string;
    taskStatus: string;
}

const TaskSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserAccount'
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        taskStatus: {
            type: String,
            required: true,
            enum: ['todo', 'progress', 'completed']
        },
        taskIndex: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

// Create and export the AdminAccount model based on the schema
const TaskModel = mongoose.model<Task>('TaskModel', TaskSchema);

export default TaskModel;