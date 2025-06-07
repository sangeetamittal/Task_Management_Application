const express=require('express');
const router=express.Router();
const verifyToken=require('../middleware/verifyToken')
const verifyRole = require('../middleware/verifyRole');

const createTask=require('../handlers/tasks/createTask')
const getTasks=require('../handlers/tasks/getTasks')
const updateTask=require('../handlers/tasks/updateTask')
const deleteTask=require('../handlers/tasks/deleteTask');

const {check, param} =require('express-validator')

router.post('/', [
    check('title').notEmpty().withMessage('Title is required'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('status').optional().isIn(['Pending', 'Progress', 'Completed']).withMessage('Invalid status'),
    check('assignedTo').isMongoId().withMessage('AssignedTo must be a valid Mongo ID'),
    check('dueDate').isISO8601().withMessage('Due date must be a valid date'),
], verifyToken, verifyRole('Manager'), createTask)

router.get('/', verifyToken, verifyRole('Manager', 'Employee'), getTasks)

router.put('/:id', [
    param('id').isMongoId().withMessage('Invalid task ID'),
    check('status').optional().isIn(['Pending', 'Progress', 'Completed']).withMessage('Invalid status'),
    check('title').optional().isString(),
    check('description').optional().isString(),
    check('dueDate').optional().isISO8601(),
    check('assignedTo').optional().isMongoId(),
], verifyToken, verifyRole('Manager', 'Employee'), updateTask)

router.delete('/:id', [
    param('id').isMongoId().withMessage('Invalid task ID')
], verifyToken, verifyRole('Manager'), deleteTask)

module.exports=router;