
const jwt = require("jsonwebtoken");
const redisclient = require("../redis/redis");
const user = require("../models/users");

const adminmiddleware = async (req, res, next) => {
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

      
        if (payload.role !== 'admin') {
            return res.status(403).json({ message: "Authorization failed: Admin access required." });
        }

        const ans1 = await user.findById(id);
        if (!ans1) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }
       
        if (ans1.role !== 'admin') {
            return res.status(403).json({ message: "Authorization failed: User is not an admin." });
        }


        req.ans1 = ans1;
        console.log("Admin authentication successful.");
        next();
    } catch (err) {
        console.error("Admin middleware error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Authentication failed: Invalid token." });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Authentication failed: Token has expired. Please log in again." });
        }
        return res.status(500).json({ message: "Authentication failed: Internal server error." });
    }
};

module.exports = adminmiddleware;