//Verify a role

const verifyRole = (...allowedRoles) => {

    return (req, res, next) => {
        const userRole = req.user.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied: insufficient role' })
        }

        next();
    }
};

module.exports = verifyRole;