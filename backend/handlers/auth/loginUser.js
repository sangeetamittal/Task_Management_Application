const User = require('../../models/User')
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt=require('jsonwebtoken')

//Logging in User
const loginUser= async(req, res)=>{

    //Checking for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, password}= req.body;

    try{

        //Checking is user exists in database
        const user =await User.findOne({email});
        if(!user)
            return res.status(400).json({message: 'Invalid Credentials'})

        //Comparing passwords
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({message: 'Invalid Password'})

        //Issuing JWT token
        const token=jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '30min'}
        );

        return res.status(200).json({
            message: 'Login Successful!',
            token,
            user:{
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    }
    catch(err){
        console.error('Error in loginuser:', err);
        return res.status(500).json({message: 'Server error'});
    }
};

module.exports=loginUser;