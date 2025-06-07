const Task = require('../../models/Task')

// Manager can read all tasks but Employee can read only assigned tasks
const getTasks = async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    try {
        let tasks;
        if (userRole === 'Manager') {
            tasks = await Task.find({ createdBy: userId }).populate('assignedTo', 'username email role')
        }
        else {
            tasks = await Task.find({ assignedTo: userId }).populate('createdBy', 'username email')
        }

        res.status(200).json(tasks);
    }
    catch (err) {
        console.error('Error in getTasks:', err);
        res.status(500).json({ message: 'Server error' })
    }
};

module.exports=getTasks;