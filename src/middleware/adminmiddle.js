// const jwt=require("jsonwebtoken");
// const redisclient=require("../redis/redis")
// const user=require("../models/users")


// const adminmiddleware=async (req,res,next)=>{
// try{
//     const {token}=req.cookies;  // ye token cookie me hoiga wha se nikal jayega 
//     if(!token)        // let say token exis nhi kiya ya koi glat user is token ko bheja tho error throw krkre bhejo
//       throw new Error("token dont exist");
//     const payload=jwt.verify(token,process.env.JWT_KEY);




//     const{id}=payload;    // playload ,e se id ko extract krke wha se info nikalo b
//     if(!id)
//       throw new Error("id is missing");
//     const ans1=await user.findById(id);


//     // check kr lo payload me i.e., tokenme role admin ka hoga to hi access hoga nhi to error

//     if(payload.role != 'admin')
//         throw new Error("invalid token1");
//     if(!ans1)
//       throw new Error("user dont exist");


// // check kro mi ye token redis me to nhi hai hai to vh block hai to usse nhi lens agr hua to
//     const isblock= await redisclient.exists(`token:${token}`);
//     if(isblock)
//      throw new Error("invalid token");
 
//    req.ans1=ans1; // req yha to ek object hai to usi ke ander is ans1 ko store kr ade rje hai phir ye request as a response me chla jayega index1 me nhi to wha pr bhi likhna pdta to db me do bar request dalna pdta so yha hm kr rhe hai optimise
//    console.log("user authentication done");

  

// next();

// }
//     catch(err){
//       throw new Error("error"+err.message);
//     } 
// } 
// module.exports=adminmiddleware;

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

        // --- ADMIN SPECIFIC CHECK ---
        if (payload.role !== 'admin') {
            return res.status(403).json({ message: "Authorization failed: Admin access required." });
        }

        const ans1 = await user.findById(id);
        if (!ans1) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }
        // Double-check if the user found in DB actually has 'admin' role, in case token was tampered or role changed
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