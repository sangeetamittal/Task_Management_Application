const Task = require('../../models/Task')
const { validationResult } = require('express-validator');

// Only Manager can delete task
const deleteTask = async (req, res) => {

    //Checking for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const taskId = req.params.id;

    try {
        const deleted = await Task.findByIdAndDelete(taskId)
        if (!deleted) {
            return res.status(404).json({ message: 'Task not found' })
        }

        res.status(200).json({ message: 'Task deleted successfully' })
    }
    catch (err) {
        console.error('Error in deleteTask:', err)
        res.status(500).json({ message: 'Server error' })
    }

};

module.exports=deleteTask;