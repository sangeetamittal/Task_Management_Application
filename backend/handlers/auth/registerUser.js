const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

//Registering an user
const registerUser = async (req, res) => {

    //Checking for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, email, password, role } = req.body;

    try {

        //Checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        //Insert new user in database with hashed password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        return res.status(201).json({ message: 'User registered successfully' })
    }
    catch (err) {
        console.error('Error in registerUser:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = registerUser;