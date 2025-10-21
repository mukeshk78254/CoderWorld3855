
const jwt = require("jsonwebtoken");
const redisclient = require("../redis/redis");
const User = require("../models/users"); 

const usermiddleware = async (req, res, next) => {
    try {
        let token;

        
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication failed: No token provided. Please log in." });
        }

        
        const isBlocked = await redisclient.get(`token:${token}`);
        if (isBlocked === 'blocked') {
            return res.status(401).json({ message: "Authentication failed: This token has been invalidated." });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { id } = payload;
        if (!id) {
            return res.status(401).json({ message: "Authentication failed: Invalid token payload (missing ID)." });
        }

        const foundUser = await User.findById(id);
        if (!foundUser) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        
        req.ans1 = foundUser; 
      
        req.user = foundUser; 

        console.log("User authentication successful. User ID:", req.user.id);
        next();
    } catch (err) {
        console.error("Authentication middleware error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Authentication failed: Invalid token." });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Authentication failed: Token has expired. Please log in again." });
        }
        return res.status(500).json({ message: "Authentication failed: Internal server error." });
    }
};

module.exports = usermiddleware;