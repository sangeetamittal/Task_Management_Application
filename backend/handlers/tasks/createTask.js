const Task = require('../../models/Task')
const { validationResult } = require('express-validator');

// Task can be created by Managers only
const createTask = async (req, res) => {

    //Checking for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, assignedTo, dueDate, status } = req.body;
    const userId = req.user.id;

    try {
        const newTask = new Task({
            title,
            description,
            assignedTo,
            dueDate,
            status,
            createdBy: userId
        });

        const savedTask = await newTask.save();

        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');
        const targetSocketId = userSocketMap[assignedTo];

        if (targetSocketId) {
            io.to(targetSocketId).emit('task-assigned', savedTask)
        }
        res.status(201).json({ message: 'Task created', Task: savedTask })
    }
    catch (err) {
        console.error('Error in createTask:', err);
        res.status(500).json({ message: 'Server error' })
    }
};

module.exports=createTask;