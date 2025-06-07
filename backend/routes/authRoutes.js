const express=require('express')
const {check}=require('express-validator')
const registerUser = require('../handlers/auth/registerUser')
const loginUser = require('../handlers/auth/loginUser')
const router=express.Router()

router.post('/register', [
    check('username').notEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({min:6}).withMessage('Password must be at least 6 characters'),
    check('role').isIn(['Manager','Employee']).withMessage('Role must be Manager or Employee'),
], registerUser);

router.post('/login', [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required')
], loginUser);

module.exports=router;