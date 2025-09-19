// // const jwt=require("jsonwebtoken");
// // const redisclient=require("../redis/redis")
// // const user=require("../models/users")


// // const usermiddleware=async (req,res,next)=>{
// // try{
// //     const {token}=req.cookies;  // ye token cookie me hoiga wha se nikal jayega 
// //     if(!token)        // let say token exis nhi kiya ya koi glat user is token ko bheja tho error throw krkre bhejo
// //       throw new Error("token dont exist");
// //     const payload=jwt.verify(token,process.env.JWT_KEY);




// //     const{id}=payload;    // playload ,e se id ko extract krke wha se info nikalo b
// //     if(!id)
// //       throw new Error("id is missing");
// //     const ans1=await user.findById(id);
// //     if(!ans1)
// //       throw new Error("user1 dont exist");


// // // check kro mi ye token redis me to nhi hai hai to vh block hai to usse nhi lens agr hua to
// //     const isblock= await redisclient.exists(`token:${token}`);
// //     if(isblock)
// //      throw new Error("invalid token");
 
// //    req.ans1=ans1; // req yha to ek object hai to usi ke ander is ans1 ko store kr ade rje hai phir ye request as a response me chla jayega index1 me nhi to wha pr bhi likhna pdta to db me do bar request dalna pdta so yha hm kr rhe hai optimise
// //    console.log("user authentication done");

  

// // next();
// // }
// //     catch(err){
// //     res.status(401).send("Error: "+ err.message)
// //     } 
// // } 
// // module.exports=usermiddleware;


// // // // const jwt = require('jsonwebtoken');
// // // // const User = require('../models/users'); // Ensure path is correct

// // // // const usermiddleware = async (req, res, next) => {
// // // //     try {
// // // //         const { token } = req.cookies;

// // // //         if (!token) {
// // // //             // This is where your error comes from. We'll send a clearer JSON response.
// // // //             return res.status(401).json({ message: "Authentication failed: No token provided. Please log in." });
// // // //         }

// // // //         // Verify the token
// // // //         const payload = jwt.verify(token, process.env.JWT_KEY);
        
// // // //         // Find the user from the token payload
// // // //         const user = await User.findById(payload.id).select('-password');

// // // //         if (!user) {
// // // //             return res.status(401).json({ message: "Authentication failed: User not found." });
// // // //         }

// // // //         // Attach user info to the request object
// // // //         req.ans1 = user;
// // // //         next(); // Proceed to the next function (the actual controller)

// // // //     } catch (err) {
// // // //         // This will catch errors from jwt.verify (e.g., expired token, invalid signature)
// // // //         return res.status(401).json({ message: "Authentication failed: " + err.message });
// // // //     }
// // // // };

// // // // module.exports = usermiddleware;


// // // // //simple 
// // // // const jwt = require('jsonwebtoken');
// // // // const User = require('../models/users'); 

// // // // const usermiddleware = async (req, res, next) => {
// // // //     try {
// // // //         const authHeader = req.headers.authorization;

// // // //         if (!authHeader || !authHeader.startsWith('Bearer ')) {
// // // //             return res.status(401).json({ message: "Authentication failed: No token provided." });
// // // //         }

// // // //         const token = authHeader.split(' ')[1];

// // // //         // Verify the token's validity
// // // //         const payload = jwt.verify(token, process.env.JWT_KEY);
        
// // // //         // Find the user from the token's payload, excluding the password hash
// // // //         const user = await User.findById(payload.id).select('-password');

// // // //         if (!user) {
// // // //             return res.status(401).json({ message: "Authentication failed: User not found." });
// // // //         }

// // // //         // Attach the authenticated user object to the request for use in controllers
// // // //         req.ans1 = user;
        
// // // //         next(); // Proceed to the next middleware or the route's controller

// // // //     } catch (err) {
// // // //         // This block catches errors from jwt.verify (e.g., expired token, invalid signature)
// // // //         return res.status(401).json({ message: "Authentication failed: Invalid or expired token." });
// // // //     }
// // // // };

// // // // module.exports = usermiddleware;


// // // // // const jwt = require('jsonwebtoken');
// // // // // const User = require('../models/users');

// // // // // const usermiddleware = async (req, res, next) => {
// // // // //   try {
// // // // //     const authHeader = req.headers.authorization;
// // // // //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// // // // //       return res.status(401).json({ message: "No token provided." });
// // // // //     }

// // // // //     const token = authHeader.split(" ")[1];
// // // // //     const payload = jwt.verify(token, process.env.JWT_KEY);

// // // // //     const user = await User.findById(payload.id).select("-password");
// // // // //     if (!user) {
// // // // //       return res.status(401).json({ message: "User not found." });
// // // // //     }

// // // // //     req.ans1 = user;
// // // // //     next();
// // // // //   } catch (err) {
// // // // //     return res.status(401).json({ message: "Authentication failed: " + err.message });
// // // // //   }
// // // // // };

// // // // // module.exports = usermiddleware;

// // // // // middlewares/usermiddleware.js
// // // const jwt = require('jsonwebtoken');
// // // const User = require('../models/users'); // Ensure path to your User model is correct
// // // const redisclient = require('../redis/redis'); // Ensure path to your Redis client is correct

// // // const usermiddleware = async (req, res, next) => {
// // //     try {
// // //         let token;

// // //         // 1. Check for token in Authorization header (Bearer token - preferred for client-side apps)
// // //         const authHeader = req.headers.authorization;
// // //         if (authHeader && authHeader.startsWith('Bearer ')) {
// // //             token = authHeader.split(' ')[1];
// // //         }

// // //         // 2. Fallback: Check for token in httpOnly cookie (for browser-based authentication or mixed apps)
// // //         // Axios on the client is configured to send the Bearer token, so this is mainly a fallback.
// // //         if (!token && req.cookies && req.cookies.token) {
// // //             token = req.cookies.token;
// // //         }

// // //         if (!token) {
// // //             // No token found in header or cookie
// // //             return res.status(401).json({ message: "Authentication failed: No token provided. Please log in." });
// // //         }

// // //         // Check if token is blacklisted (e.g., after logout)
// // //         const isBlocked = await redisclient.get(`token:${token}`); // Prefix `token:` matches `userController.js` logout logic
// // //         if (isBlocked === 'blocked') {
// // //             return res.status(401).json({ message: "Authentication failed: Token invalidated." });
// // //         }

// // //         // Verify the token using your JWT secret key
// // //         const decoded = jwt.verify(token, process.env.JWT_KEY);
        
// // //         // Fetch user data from DB to ensure the user still exists and get up-to-date info
// // //         const currentUser = await User.findById(decoded.id).select('-password'); // Exclude password hash
// // //         if (!currentUser) {
// // //             return res.status(401).json({ message: "Authentication failed: User not found." });
// // //         }

// // //         // Attach user data to the request object, using `req.ans1` for consistency with your existing code
// // //         req.ans1 = currentUser; 
// // //         next(); // Proceed to the next middleware or route handler
// // //     } catch (err) {
// // //         console.error("Authentication middleware error:", err.message);
// // //         if (err.name === 'JsonWebTokenError') {
// // //             return res.status(401).json({ message: "Authentication failed: Invalid token." });
// // //         }
// // //         if (err.name === 'TokenExpiredError') {
// // //             return res.status(401).json({ message: "Authentication failed: Token has expired. Please log in again." });
// // //         }
// // //         // Generic error for other issues during token processing
// // //         res.status(500).json({ message: "Authentication failed: Internal server error." });
// // //     }
// // // };

// // // module.exports = usermiddleware;
// const jwt = require("jsonwebtoken");
// const redisclient = require("../redis/redis");
// const user = require("../models/users");

// const usermiddleware = async (req, res, next) => {
//     try {
//         let token;

//         // 1. Prioritize checking Authorization header for Bearer token (standard for SPAs)
//         const authHeader = req.headers.authorization;
//         if (authHeader && authHeader.startsWith('Bearer ')) {
//             token = authHeader.split(' ')[1];
//         } 
//         // 2. Fallback: Check httpOnly cookie (for browser-managed tokens or older apps)
//         else if (req.cookies && req.cookies.token) {
//             token = req.cookies.token;
//         }

//         if (!token) {
//             return res.status(401).json({ message: "Authentication failed: No token provided. Please log in." });
//         }

//         // Check if token is blacklisted in Redis (for logout functionality)
//         const isBlocked = await redisclient.get(`token:${token}`);
//         if (isBlocked === 'blocked') {
//             return res.status(401).json({ message: "Authentication failed: This token has been invalidated." });
//         }

//         const payload = jwt.verify(token, process.env.JWT_KEY);

//         const { id } = payload;
//         if (!id) {
//             return res.status(401).json({ message: "Authentication failed: Invalid token payload (missing ID)." });
//         }

//         const ans1 = await user.findById(id);
//         if (!ans1) {
//             return res.status(401).json({ message: "Authentication failed: User not found." });
//         }

//         req.ans1 = ans1;
//         console.log("User authentication successful.");
//         next();
//     } catch (err) {
//         console.error("Authentication middleware error:", err.message);
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: "Authentication failed: Invalid token." });
//         }
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: "Authentication failed: Token has expired. Please log in again." });
//         }
//         return res.status(500).json({ message: "Authentication failed: Internal server error." });
//     }
// };

// module.exports = usermiddleware;
const jwt = require("jsonwebtoken");
const redisclient = require("../redis/redis");
const User = require("../models/users"); // Corrected to use 'User' as per model export

const usermiddleware = async (req, res, next) => {
    try {
        let token;

        // 1. Prioritize checking Authorization header for Bearer token (standard for SPAs)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // 2. Fallback: Check httpOnly cookie (for browser-managed tokens or older apps)
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication failed: No token provided. Please log in." });
        }

        // Check if token is blacklisted in Redis (for logout functionality)
        const isBlocked = await redisclient.get(`token:${token}`);
        if (isBlocked === 'blocked') {
            return res.status(401).json({ message: "Authentication failed: This token has been invalidated." });
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { id } = payload;
        if (!id) {
            return res.status(401).json({ message: "Authentication failed: Invalid token payload (missing ID)." });
        }

        const foundUser = await User.findById(id); // Using 'User' model
        if (!foundUser) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        // ⭐ Your requested change: Keeping req.ans1
        req.ans1 = foundUser; 
        // ⭐ Critical addition: Also set req.user to resolve TypeError in userRoutes
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