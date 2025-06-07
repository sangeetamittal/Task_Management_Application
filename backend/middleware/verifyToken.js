const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    //Checking if token exists or not
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next();
    }
    catch (err) {
        console.error('JWT Verification Failed:', err);
        res.status(403).json({ message: 'Invalid or expired token' })
    }
};

module.exports = verifyToken;