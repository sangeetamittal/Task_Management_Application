const Task = require('../../models/Task')

// Employee can update only status of task while Manager can update anything
const updateTask = async (req, res) => {

    //Checking for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const taskId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;
    const updates = req.body;

    try {
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' })
        }

        if (userRole === 'Employee') {
            if (task.assignedTo.toString() != userId) {
                return res.status(403).json({ message: 'You cannot update this task' })
            }
            if (!updates.status) {
                return res.status(400).json({ message: 'Employees can only update task status' })
            }
            task.status = updates.status;
        }

        if (userRole === 'Manager') {
            Object.assign(task, updates);
        }

        const updatedTask = await task.save();

        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');
        const notifyId = userRole === 'Manager' ? task.assignedTo : task.createdBy;
        const notifySocket = userSocketMap[notifyId.toString()];

        if (notifySocket) {
            io.to(notifySocket).emit('task-updated', updatedTask)
        }

        res.status(200).json({ message: 'Task updated', task: updatedTask })
    }
    catch (err) {
        console.error('Error in updateTask:', err)
        res.status(500).json({ message: 'Server error' })
    }

};

module.exports=updateTask;