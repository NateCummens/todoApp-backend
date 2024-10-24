import { Schema, model, Types } from "mongoose";

interface ITask{
    content:String,
    dateCreated:Date,
    completed:Boolean
}

const taskSchema = new Schema<ITask>({
    content:String,
    dateCreated:{ type: Date, default: Date.now },
    completed:{
        type:Boolean,
        default:false
    }
})

const TaskModel = model<ITask>("Task", taskSchema);

export default TaskModel