const mongoose =require('mongoose')

const taskSchema=new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Task title is required']
    },
    description:{
        type: String
    },
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Assigned User is required']
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending'
    },
    dueDate:{
        type: Date,
        required: [true, 'Task title is required']
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Task title is required']
    },
}, {timestamps: true});

module.exports=mongoose.model('Task', taskSchema);