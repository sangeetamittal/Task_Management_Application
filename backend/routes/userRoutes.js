const express= require('express');
const verifyRole = require('../middleware/verifyRole');
const verifyToken = require('../middleware/verifyToken');
const getUsers = require('../handlers/users/getUsers');
const router= express.Router();

router.get('/', verifyToken, verifyRole('Manager'), getUsers)

module.exports=router;