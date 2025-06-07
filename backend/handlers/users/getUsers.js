const User = require("../../models/User");

const getUsers=async (req, res)=>{
    const {role} = req.query;

    try{
        const query=role?{role}: {};
        const users=await User.find(query).select('-password')
        res.status(200).json({users});
    }
    catch(err){
        console.error('Error in getUsers: ', err)
        res.status(500).json({message: 'Server error'})
    }
}

module.exports = getUsers;