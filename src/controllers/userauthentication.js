// // // const user=require("../models/users")
// // // const validate=require("../utils/validator")
// // // // const bcrypt=require("bcrypt")
// // // // // require("dotenv").config(); 




// // // const redisclient = require("../redis/redis");
// // // // const User =  require("../models/user")
// // // // const validate = require('../utils/validator');
// // // const bcrypt = require("bcrypt");
// // // const jwt = require('jsonwebtoken');
// // // const submission = require("../models/submission");






// // // // const register=async (req,res)=>{
// // // // try{
// // // //     // validate the data which we create
 
// // // //     validate(req.body); 
// // // //     const {firstname,emailId,password}=req.body;
// // // //      // check email exist or  not for another same time email  ye to unique se bhi pta chl jayga jo hmne sche,a me likha hi so  o need to that one 
// // // //         //  const ans=user.exist({emailId});   // ans in 0 and 1

// // // //         //  if(!ans)
// // // //         //     throw new error("email exist already");
    

// // // // req.body.password=await bcrypt.hash(password,10)
// // // // req.body.role='user';    // is path se as a user koi admin bhi dal kr aayega t register user ke nam se hi hoga 

// // // //     const user1=await user.create(req.body);
    

// // // //     // now register ho gya hai b token bhej dete hai jisse vh dubara access kr paye token se 
// // // //     const token=jwt.sign({id:user1.id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:3600});  // initially to ek user hi register krega to role user jissr db me query dalna na pade


// // // //      const reply={
// // // //         firstname:user1.firstname,
// // // //         emailId:user1.emailId,
// // // //       id:user1.id
// // // //       }
// // // //     res.cookie('token',token,/*{expiresIn:new Date(Date.now())}   OR */ {maxAge:60*60*1000});   // maxage is in milisec
// // // //     res.status(201).json({
// // // //         user1:reply,
// // // //         message:"register successfully"
// // // //       })
      

// // // // }
// // // // catch(err){
// // // //    res.status(400).send("error : "+err);
// // // // }
// // // // }

// // // // // const register = async (req,res)=>{
    
// // // // //     try{
// // // // //         // validate the data;



// // // // //       validate(req.body); 
// // // // //       const {emailId, password}  = req.body;

// // // // //       req.body.password = await bcrypt.hash(password, 10);
// // // // //       req.body.role = 'user'
// // // // //     //
    
// // // // //      const user =  await user.create(req.body);
// // // // //      const token =  jwt.sign({_id:user._id , emailId:emailId, role:'user'},process.env.JWT_KEY,{expiresIn: 60*60});
// // // // const reply={
// // // //         firstname:user1.firstname,
// // // //         emailId:user1.emailId,
// // // //       id:user1.id
// // // //       }

// // // // //      res.cookie('token',token,{maxAge: 60*60*1000});
// // // // //    res.status(201).json({
// // // //         user1:reply,
// // // //         message:"register successfully"
// // // //       })
// // // // //     }
// // // // //     catch(err){
// // // // //         res.status(400).send("Error: "+err);
// // // // //     }
// // // // // }


// // // // // FIXED `register` function

// // // // const register = async (req, res) => {
// // // //     try {
// // // //         validate(req.body); 
// // // //         const { firstname, emailId, password } = req.body;

// // // //         // --- NEW VALIDATION ---
// // // //         // You should check for an existing user BEFORE creating a new one
// // // //         const existingUser = await user.findOne({ emailId: emailId });
// // // //         if (existingUser) {
// // // //             // Send a specific, JSON-formatted error
// // // //             return res.status(400).json({ message: 'User with this email already exists' });
// // // //         }
// // // //         // --- END OF VALIDATION ---

// // // //         req.body.password = await bcrypt.hash(password, 10);
// // // //         req.body.role = 'user';
          
// // // //         const user1 = await user.create(req.body);
// // // //         const token = jwt.sign({ id: user1.id, emailId: emailId, role: 'user1' }, process.env.JWT_KEY, { expiresIn: 60*60 });
        
// // // //         const reply = {
// // // //             firstname: user1.firstname,
// // // //             emailId: user1.emailId,
// // // //             id: user1.id
           
// // // //         };

// // // //         res.cookie('token', token, { maxAge: 60*60*1000, httpOnly: true }); // Added httpOnly for security
        
// // // //         // This success response is already correct
// // // //         res.status(201).json({
// // // //             user: reply,
// // // //             message: "Register Successfully"
// // // //         });
        
// // // //         console.log("done");

// // // //     } catch (err) {
// // // //         // --- THIS IS THE FIX ---
// // // //         console.error(err); // Log the full error for your own debugging
// // // //         // Send a JSON response with a 'message' key
// // // //         res.status(400).json({ message: err.message || 'An error occurred during registration.' });
// // // //     }
// // // // };

// // // const register = async (req,res)=>{
    
// // //     try{
// // //         // validate the data;
// // //       validate(req.body); 
// // //       const {firstname, emailId, password}  = req.body;

// // //       req.body.password = await bcrypt.hash(password, 10);
// // //       req.body.role = 'user'
        
// // //      const user1 =  await user.create(req.body);
// // //      const token =  jwt.sign({id:user1.id , emailId:emailId, role:'user1'},process.env.JWT_KEY,{expiresIn: 60*60});
// // //      const reply = {
// // //         firstname: user1.firstname,
// // //         emailId: user1.emailId,
// // //         id: user1.id,
// // //         role:user1.role

// // //     }
// // //      res.cookie('token',token,{maxAge: 60*60*1000});
// // //      res.status(201).json({
// // //         user:reply,
// // //         message:"register  Successfully"
// // //     })
// // //     console.log("done")
// // //     }
// // //     catch(err){
// // //         res.status(400).send("Error1: "+err);
// // //     }
// // // }


// // // const login =async(req,res)=>{

// // //     try{
    
// // //       const{emailId,password}=req.body;
// // //       if(!emailId)
// // //         throw new Error("invalid credential");
      
// // //       if(!password)
// // //         throw new Error("invalid credential");
      
// // //       const people1=await user.findOne({emailId}); 
// // //       const match=await bcrypt.compare(password,people1.password);
  
// // //       if(!match)
// // //         throw new Error("invalid credential"); 
    
// // //     const token=jwt.sign({id:people1.id,emailId:emailId,role:people1.role},process.env.JWT_KEY,{expiresIn:3600})  // login to koi bhi kr skta hai ya to admin ya to user 


// // //     // ye isliye ki jb hm login krte hai to let say home about section rhta hai to jb hm home se about section pr jate haai to wh phir se hme login krne ke liye nhi bolta i.e., jaise hi hm logim krte hai sara data ko ek hi sath bhej deta hai
// // //       const reply={
// // //         firstname:people1.firstname,
// // //         emailId:people1.emailId,
// // //       id:people1.id,
// // //         role:people1.role

// // //       }
      
// // //       res.cookie("token",token,{maxAge:3600*1000});
// // //       res.status(200).json({
// // //         user:reply,
// // //         message:"Loggin successfully"
// // //       })
      
// // // }
      
      
      
      
      
      
      
      
      
      
      
      
      
// // //       /*  // const people=await user1.findById(req.body.id);
// // //       const people=await user.findOne({email:req.body.email}); 
  
// // //       if(!(req.body.email===people.email))
// // //         throw new Error("invalid credential");
// // //       // const isallow=await bcrypt.compare(req.body.password,people.password);
// // //       const isallow=people.verifypassword(req.body.password);
// // //       if(!isallow)
// // //         throw new Error("invalid credential");
// // //       const token=jwt.sign({id:people.id,email:people.email},"qwery")
// // //     //   const token=people.getjwt();
// // //       res.cookie("token",token);
// // //       res.send("successfully login")
// // //       console.log("success");
// // //     }*/
// // //     catch(err){
// // //     res.status(401).send("error" + err.message)
// // //     }
// // //   }




// // // const logout=async (req,res)=>{
// // //     try{
// // // const {token}=req.cookies;

// // // const payload=jwt.decode(token);  // is token ka sara data mil jayega isme iska expire time bhi likha rhta hai



// // // await redisclient.set(`token:${token}`,"blocked");
 
// // // await redisclient.expireAt(`token:${token}`,payload.exp);








// // //     // res.cookie("token","qwertyuioplkjhgfd");
// // //     res.cookie("token",null,{expires:new Date(Date.now())});

// // //     res.send("logout successfully");}
// // //     catch(err){
// // //         res.status(503).send("invalid")
// // //     }
// // //   }

// // //   const adminregister=async (req,res)=>{
// // //     try{
// // //         // validate the data which we create
// // //         if(req.ans1.role!='admin')
// // //           throw new console.Error("invalid credential");
          
     
// // //         validate(req.body); 
// // //         const {firstname,emailId,password}=req.body;
// // //          // check email exist or  not for another same time email  ye to unique se bhi pta chl jayga jo hmne sche,a me likha hi so  o need to that one 
// // //             //  const ans=user.exist({emailId});   // ans in 0 and 1
    
// // //             //  if(!ans)
// // //             //     throw new error("email exist already");
        

    
// // //     req.body.password=await bcrypt.hash(password,10)
// // //       // *  req.body.role='admin';// is path se as a user koi admin bhi dal kr aayega t register user ke nam se hi hoga 


    
// // //         const user1=await user.create(req.body);
        
    
// // //         // now register ho gya hai b token bhej dete hai jisse vh dubara access kr paye token se 
// // //         const token=jwt.sign({id:user1.id,emailId:emailId,role:user1.role  /* OR * role:'admin*/},process.env.JWT_KEY,{expiresIn:3600});  // initially to ek user hi register krega to role user jissr db me query dalna na pade // usetr,role se tum agr admin likhenge to db me to admin hoga agr user likhenge tpt user hpoga
// // // // agr kuch mention krke nhi bheje postman pr to user hi consider hoga bcoz default is user set in schema so for admin ,must mention admin as a role in postman
// // //         res.cookie('token',token,/*{expiresIn:new Date(Date.now())}   OR */ {maxAge:60*60*1000});   // maxage is in milisec
// // //         res.status(201).send("user registered successfully")
    
// // //     }
// // //     catch(err){
// // //        res.status(400).send("error1: "+err);
// // //     }
// // //     }


// // //     const deleteprofile=async(req,res)=>{
// // //       try{
// // //         const userid=req.ans1.id;
// // //         await user.findByIdAndDelete(userid);

// // //         // is user ke submission bhi delete kr do njisne profile apna delete kiya hai

// // //         // await submission.deleteMany({userid});  // jis jis submission me is userid se hoga to usko delte maro
// // //         // submission ko aise bhi delte kr skte hai aur userschema me jake post kr kre delete kr skte hai
// // //         res.status(201).send("profile deleted successfully")
// // //       }
// // //       catch(err){
// // //    res.send("internal server error"+err);
// // //       }
// // //     }
    
// // // module.exports = {
// // //     register,
// // //     login,logout,adminregister,deleteprofile
// // //   };


// const user = require("../models/users");
// const validate = require("../utils/validator");
// const redisclient = require("../redis/redis");
// const bcrypt = require("bcrypt");
// const jwt = require('jsonwebtoken');
// const submission = require("../models/submission");
// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// // --- NODEMAILER CONFIGURATION ---
// // IMPORTANT: Use environment variables for security.
// // For Gmail, you may need to create an "App Password".
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER || "your-email@gmail.com", // Replace with your email from .env
//     pass: process.env.EMAIL_PASS || "your-email-password", // Replace with your email password from .env
//   },
// });


// // STEP 1: Sends OTP to user's email and stores registration data in Redis
// const sendOtpForRegistration = async (req, res) => {
//     try {
//         validate(req.body); 
//         const { firstname, emailId, password } = req.body;

//         const existingUser = await user.findOne({ emailId });
//         if (existingUser) {
//             return res.status(409).json({ message: 'An account with this email already exists.' });
//         }

//         const otp = crypto.randomInt(100000, 999999).toString();
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Store user data and OTP in Redis for 10 minutes
//         const registrationData = {
//             firstname,
//             emailId,
//             password: hashedPassword,
//             otp,
//         };
//         await redisclient.set(`register:${emailId}`, JSON.stringify(registrationData));
//         await redisclient.expire(`register:${emailId}`, 600); 

//         // Send OTP via email
//         const mailOptions = {
//             from: process.env.EMAIL_USER || "your-email@gmail.com",
//             to: emailId,
//             subject: "Your Account Verification Code",
//             text: `Thank you for registering. Your OTP is ${otp}. It is valid for 10 minutes.`,
//         };

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({ message: `OTP has been sent to ${emailId}` });

//     } catch (err) {
//         // Send a proper JSON error response
//         res.status(400).json({ message: err.message || 'An error occurred while sending OTP.' });
//     }
// };

// // STEP 2: Verifies OTP and creates the user
// const verifyOtpAndRegister = async (req, res) => {
//     try {
//         const { emailId, otp } = req.body;
//         if (!emailId || !otp) {
//             return res.status(400).json({ message: "Email and OTP are required." });
//         }

//         const storedDataString = await redisclient.get(`register:${emailId}`);
//         if (!storedDataString) {
//             return res.status(400).json({ message: "OTP expired or is invalid. Please try signing up again." });
//         }

//         const storedData = JSON.parse(storedDataString);

//         if (storedData.otp !== otp) {
//             return res.status(400).json({ message: "Invalid OTP entered." });
//         }

//         // OTP is correct, create the user
//         const newUserPayload = {
//             firstname: storedData.firstname,
//             emailId: storedData.emailId,
//             password: storedData.password,
//             role: 'user',
//         };

//         const user1 = await user.create(newUserPayload);

//         // Clean up Redis
//         await redisclient.del(`register:${emailId}`);

//         // Create JWT and log user in
//         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        
//         const reply = {
//             firstname: user1.firstname,
//             emailId: user1.emailId,
//             id: user1.id,
//             role: user1.role,
//         };

//         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        
//         res.status(201).json({
//             user: reply,
//             message: "Registration successful!",
//         });

//     } catch (err) {
//         res.status(500).json({ message: err.message || "An internal server error occurred." });
//     }
// };

// // This function is no longer used for the new flow but kept to avoid breaking other parts
// const register = async (req,res)=>{
//     try{
//       validate(req.body); 
//       const {firstname, emailId, password}  = req.body;

//       req.body.password = await bcrypt.hash(password, 10);
//       req.body.role = 'user'
        
//      const user1 =  await user.create(req.body);
//      const token =  jwt.sign({id:user1.id , emailId:emailId, role:'user1'},process.env.JWT_KEY,{expiresIn: 60*60});
//      const reply = {
//         firstname: user1.firstname,
//         emailId: user1.emailId,
//         id: user1.id,
//         role:user1.role
//     }
//      res.cookie('token',token,{maxAge: 60*60*1000});
//      res.status(201).json({
//         user:reply,
//         message:"register  Successfully"
//     })
//     console.log("done")
//     }
//     catch(err){
//         res.status(400).json({ message: "Error1: " + err });
//     }
// }


// // const login = async(req,res)=>{
// //     try{
// //       const{emailId,password}=req.body;
// //       if(!emailId || !password) {
// //         return res.status(401).json({ message: "Invalid credential" });
// //       }
      
// //       const people1=await user.findOne({emailId}); 
// //       if (!people1) {
// //         return res.status(401).json({ message: "Invalid credential" });
// //       }

// //       const match=await bcrypt.compare(password,people1.password);
  
// //       if(!match) {
// //         return res.status(401).json({ message: "Invalid credential" });
// //       }
    
// //       const token=jwt.sign({id:people1.id,emailId:emailId,role:people1.role},process.env.JWT_KEY,{expiresIn:3600})

// //       const reply={
// //         firstname:people1.firstname,
// //         emailId:people1.emailId,
// //         id:people1.id,
// //         role:people1.role
// //       }
      
// //       res.cookie("token",token,{maxAge:3600*1000, httpOnly: true});
// //       res.status(200).json({
// //         user:reply,
// //         message:"Loggin successfully"
// //       })
// //     }
// //     catch(err){
// //         res.status(401).json({ message: "error " + err.message });
// //     }
// // }
// const login = async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     if (!emailId || !password) {
//       return res.status(401).json({ message: "Invalid credential" });
//     }

//     const people1 = await user.findOne({ emailId });

//     if (!people1) {
//       return res.status(401).json({ message: "Invalid credential" });
//     }

//     const match = await bcrypt.compare(password, people1.password);

//     if (!match) {
//       return res.status(401).json({ message: "Invalid credential" });
//     }

//     const token = jwt.sign(
//       { id: people1.id, emailId: emailId, role: people1.role },
//       process.env.JWT_KEY,
//       { expiresIn: 3600 }
//     );

//     const reply = {
//       firstname: people1.firstname,
//       emailId: people1.emailId,
//       id: people1.id,
//       role: people1.role,
//     };

//     // ✅ Set token in cookie (optional)
//     res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true });

//     // ✅ Also send token in response body
//     res.status(200).json({
//       user: reply,
//       token, // <-- Add this line
//       message: "Login successful",
//     });
//   } catch (err) {
//     res.status(401).json({ message: "error " + err.message });
//   }
// };

// const logout = async (req,res)=>{
//     try{
//         const {token}=req.cookies;
//         if (token) {
//             const payload=jwt.decode(token);
//             await redisclient.set(`token:${token}`,"blocked");
//             await redisclient.expireAt(`token:${token}`,payload.exp);
//         }
//         res.cookie("token",null,{expires:new Date(Date.now()), httpOnly: true});
//         res.status(200).json({ message: "logout successfully" });
//     } catch(err){
//         res.status(503).json({ message: "invalid request" });
//     }
// }

// const adminregister=async (req,res)=>{
//     try{
//         if(req.ans1.role!='admin')
//           throw new console.Error("invalid credential");
          
//         validate(req.body); 
//         const {firstname,emailId,password}=req.body;
        
//         req.body.password=await bcrypt.hash(password,10)
    
//         const user1=await user.create(req.body);
        
//         const token=jwt.sign({id:user1.id,emailId:emailId,role:user1.role},process.env.JWT_KEY,{expiresIn:3600});
//         res.cookie('token',token,{maxAge:60*60*1000});
//         res.status(201).send("user registered successfully")
    
//     }
//     catch(err){
//        res.status(400).send("error1: "+err);
//     }
// }

// const deleteprofile=async(req,res)=>{
//     try{
//         const userid=req.ans1.id;
//         await user.findByIdAndDelete(userid);
//         res.status(201).send("profile deleted successfully")
//     }
//     catch(err){
//         res.send("internal server error"+err);
//     }
// }
    

// module.exports = {
//     sendOtpForRegistration, // New function
//     verifyOtpAndRegister,   // New function
//     register,
//     login,
//     logout,
//     adminregister,
//     deleteprofile
// };

// // 1


// // // const user = require("../models/users");
// // // const problem=require("../models/problem")
// // // const validate = require("../utils/validator");
// // // const redisclient = require("../redis/redis");
// // // const bcrypt = require("bcrypt");
// // // const jwt = require('jsonwebtoken');
// // // const submission = require("../models/submission");
// // // const nodemailer = require("nodemailer");
// // // const crypto = require("crypto");
// // // const Notification = require('../models/notification');

// // // // --- NODEMAILER CONFIGURATION ---
// // // // This uses the credentials from your .env file. It's secure.
// // // // const transporter = nodemailer.createTransport({
// // // //     service: "gmail",
// // // //     auth: {
// // // //         user: process.env.EMAIL_USER,
// // // //         pass: process.env.EMAIL_PASS,
// // // //     },
// // // // });

// // // // // ====================================================================
// // // // // NEW REGISTRATION FLOW - STEP 1: Send OTP for Registration
// // // // // ====================================================================
// // // const sendOtpForRegistration = async (req, res) => {
// // //     try {
// // //         validate(req.body);
// // //         const { firstname, emailId, password } = req.body;

// // //         // 1. Check if a user with this email already exists in the database
// // //         const existingUser = await user.findOne({ emailId });
// // //         if (existingUser) {
// // //             // Use 409 Conflict status code for existing resource
// // //             return res.status(409).json({ message: 'An account with this email already exists.' });
// // //         }

// // //         // 2. Generate a secure 6-digit OTP
// // //         const otp = crypto.randomInt(100000, 999999).toString();
// // //         const hashedPassword = await bcrypt.hash(password, 10);

// // //         // 3. Store the user's details and the OTP in Redis with a 10-minute expiry
// // //         const registrationData = {
// // //             firstname,
// // //             emailId,
// // //             password: hashedPassword,
// // //             otp,
// // //         };
// // //         const redisKey = `register:${emailId}`;
// // //         await redisclient.set(redisKey, JSON.stringify(registrationData));
// // //         await redisclient.expire(redisKey, 600); // Expires in 600 seconds (10 minutes)

// // //         // 4. Send the OTP to the user's email address
// // //         const mailOptions = {
// // //             from: `"Coder World" <${process.env.EMAIL_USER}>`,
// // //             to: emailId,
// // //             subject: "Your Account Verification Code",
// // //             html: `<p>Thank you for signing up. Here is your code  to access your account : <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>`,
// // //         };

// // //         await transporter.sendMail(mailOptions);

// // //         res.status(200).json({ message: `An OTP has been sent to ${emailId}.` });

// // //     } catch (err) {
// // //         console.error("Error in sendOtpForRegistration:", err);
// // //         res.status(400).json({ message: err.message || 'An error occurred while processing your request.' });
// // //     }
// // // };

// // // // ====================================================================
// // // // NEW REGISTRATION FLOW - STEP 2: Verify OTP and Create User
// // // // ====================================================================
// // // const verifyOtpAndRegister = async (req, res) => {
// // //     try {
// // //         const { emailId, otp } = req.body;
// // //         if (!emailId || !otp) {
// // //             return res.status(400).json({ message: "Email and OTP are required." });
// // //         }

// // //         const redisKey = `register:${emailId}`;
// // //         const storedDataString = await redisclient.get(redisKey);

// // //         if (!storedDataString) {
// // //             return res.status(400).json({ message: "OTP has expired or is invalid. Please try signing up again." });
// // //         }

// // //         const storedData = JSON.parse(storedDataString);

// // //         if (storedData.otp !== otp) {
// // //             return res.status(400).json({ message: "The OTP you entered is incorrect." });
// // //         }

// // //         const newUserPayload = {
// // //             firstname: storedData.firstname,
// // //             emailId: storedData.emailId,
// // //             password: storedData.password,
// // //             role: 'user',
// // //         };

// // //         const user1 = await user.create(newUserPayload);

// // //         await redisclient.del(redisKey);

// // //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });

// // //         const reply = {
// // //             firstname: user1.firstname,
// // //             emailId: user1.emailId,
// // //             id: user1.id,
// // //             role: user1.role,
// // //         };

// // //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

// // //         res.status(201).json({
// // //             user: reply,
// // //             message: "Registration successful! You are now logged in.",
// // //         });

// // //     } catch (err) {
// // //         console.error("Error in verifyOtpAndRegister:", err);
// // //         res.status(500).json({ message: err.message || "An internal server error occurred." });
// // //     }
// // // };

// // // // --- Your Other Functions (with improved error handling and security) ---

// // // const login = async (req, res) => {
// // //     try {
// // //         const { emailId, password } = req.body;
// // //         if (!emailId || !password) {
// // //             return res.status(401).json({ message: "Invalid credentials" });
// // //         }
// // //         const people1 = await user.findOne({ emailId });
// // //         if (!people1) {
// // //             return res.status(401).json({ message: "Invalid credentials" });
// // //         }
// // //         const match = await bcrypt.compare(password, people1.password);
// // //         if (!match) {
// // //             return res.status(401).json({ message: "Invalid credentials" });
// // //         }
// // //         const token = jwt.sign({ id: people1.id, emailId: emailId, role: people1.role }, process.env.JWT_KEY, { expiresIn: 3600 });
// // //         const reply = {
// // //             firstname: people1.firstname,
// // //             emailId: people1.emailId,
// // //             id: people1.id,
// // //             role: people1.role
// // //         };
// // //         res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// // //         res.status(200).json({
// // //             user: reply,
// // //             message: "Logged in successfully"
// // //         });
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Internal server error: " + err.message });
// // //     }
// // // };


// // const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //     },
// // });
// // const register = async (req,res)=>{
// //     try{
// //       validate(req.body); 
// //       const {firstname, emailId, password}  = req.body;

// //       req.body.password = await bcrypt.hash(password, 10);
// //       req.body.role = 'user'
        
// //      const user1 =  await user.create(req.body);
// //      const token =  jwt.sign({id:user1.id , emailId:emailId, role:'user1'},process.env.JWT_KEY,{expiresIn: 60*60});
// //      const reply = {
// //         firstname: user1.firstname,
// //         emailId: user1.emailId,
// //         id: user1.id,
// //         role:user1.role
// //     }
// //      res.cookie('token',token,{maxAge: 60*60*1000});
// //      res.status(201).json({
// //         user:reply,
// //         message:"register  Successfully"
// //     })
// //     console.log("done")
// //     }
// //     catch(err){
// //         res.status(400).json({ message: "Error1: " + err });
// //     }
// // }


// // // // ====================================================================
// // // // REGISTRATION FLOW - STEP 1: Send OTP for Registration
// // // // ====================================================================
// // const sendOtpForRegistration = async (req, res) => {
// //     try {
// //         validate(req.body);
// //         const { firstname, emailId, password } = req.body;
// //         const existingUser = await user.findOne({ emailId });
// //         if (existingUser) {
// //             return res.status(409).json({ message: 'An account with this email already exists.' });
// //         }
// //         const otp = crypto.randomInt(100000, 999999).toString();
// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         const registrationData = { firstname, emailId, password: hashedPassword, otp };
// //         const redisKey = `register:${emailId}`;
// //         await redisclient.set(redisKey, JSON.stringify(registrationData));
// //         await redisclient.expire(redisKey, 600);
// //         const mailOptions = {
// //             from: `"Coder World" <${process.env.EMAIL_USER}>`,
// //             to: emailId,
// //             subject: "Your Account Verification Code",
// //             html: `<p>Thank you for signing up. Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>`,
// //         };
// //         await transporter.sendMail(mailOptions);
// //         res.status(200).json({ message: `An OTP has been sent to ${emailId}.` });
// //     } catch (err) {
// //         console.error("Error in sendOtpForRegistration:", err);
// //         res.status(400).json({ message: err.message || 'An error occurred while processing your request.' });
// //     }
// // };

// // const verifyOtpAndRegister = async (req, res) => {
// //     try {
// //         const { emailId, otp } = req.body;
// //         if (!emailId || !otp) return res.status(400).json({ message: "Email and OTP are required." });

// //         const redisKey = `register:${emailId}`;
// //         const storedDataString = await redisclient.get(redisKey);
// //         if (!storedDataString) return res.status(400).json({ message: "OTP has expired or is invalid. Please try signing up again." });

// //         const storedData = JSON.parse(storedDataString);
// //         if (storedData.otp !== otp) return res.status(400).json({ message: "The OTP you entered is incorrect." });

// //         const newUserPayload = {
// //             firstname: storedData.firstname,
// //             emailId: storedData.emailId,
// //             password: storedData.password,
// //             isProfileComplete: true,
// //             role: 'user',
// //         };

// //         const user1 = await user.create(newUserPayload);
// //         await redisclient.del(redisKey);
// //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
// //         const reply = { firstname: user1.firstname, emailId: user1.emailId, id: user1.id, role: user1.role };
// //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// //         res.status(201).json({ user: reply, message: "Registration successful! You are now logged in." });
// //     } catch (err) {
// //         console.error("Error in verifyOtpAndRegister:", err);
// //         res.status(500).json({ message: err.message || "An internal server error occurred." });
// //     }
// // };

// // const login = async (req, res) => {
// //     try {
// //         const { emailId, password } = req.body;
// //         if (!emailId || !password) return res.status(401).json({ message: "Invalid credentials" });
// //         const people1 = await user.findOne({ emailId });
// //         if (!people1) return res.status(401).json({ message: "Invalid credentials" });
// //         if (!people1.password) {
// //             return res.status(401).json({ message: "This account was created with a social provider. Please log in using that provider." });
// //         }
// //         const match = await bcrypt.compare(password, people1.password);
// //         if (!match) return res.status(401).json({ message: "Invalid credentials" });
// //         const token = jwt.sign({ id: people1.id, emailId: emailId, role: people1.role }, process.env.JWT_KEY, { expiresIn: 3600 });
// //         const reply = { firstname: people1.firstname, emailId: people1.emailId, id: people1.id, role: people1.role };
// //         res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// //         res.status(200).json({ user: reply, message: "Logged in successfully" });
// //     } catch (err) {
// //         res.status(500).json({ message: "Internal server error: " + err.message });
// //     }
// // };

// // const logout = async (req, res) => {
// //     try {
// //         const { token } = req.cookies;
// //         if (token) {
// //             const payload = jwt.decode(token);
// //             if (payload && payload.exp) {
// //                 await redisclient.set(`token:${token}`, "blocked", { EXAT: payload.exp });
// //             }
// //         }
// //         res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
// //         res.status(200).json({ message: "Logged out successfully" });
// //     } catch (err) {
// //         res.status(503).json({ message: "Logout failed: " + err.message });
// //     }
// // };

// // const adminregister = async (req, res) => {
// //     try {
// //         if (req.ans1.role != 'admin')
// //             throw new Error("Invalid credential: Not an admin");

// //         validate(req.body);
// //         const { firstname, emailId, password } = req.body;
// //         req.body.password = await bcrypt.hash(password, 10);
// //         const user1 = await user.create(req.body);
// //         const token = jwt.sign({ id: user1.id, emailId: emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: 3600 });
// //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// //         res.status(201).json({ message: "Admin user registered successfully" });
// //     }
// //     catch (err) {
// //         res.status(400).json({ message: "Error: " + err.message });
// //     }
// // };

// // // const deleteprofile = async (req, res) => {
// // //     try {
// // //         const userid = req.ans1.id;
// // //         await user.findByIdAndDelete(userid);
// // //         res.status(200).json({ message: "Profile deleted successfully" });
// // //     }
// // //     catch (err) {
// // //         res.status(500).json({ message: "Internal server error: " + err.message });
// // //     }
// // // };
// // // const forgotPasswordSendOtp = async (req, res) => {
// // //     try {
// // //         const { emailId } = req.body;
// // //         if (!emailId) {
// // //             return res.status(400).json({ message: "Email address is required." });
// // //         }

// // //         const existingUser = await user.findOne({ emailId });
// // //         if (!existingUser) {
// // //             // For security, don't reveal if the email is registered.
// // //             // Always return a positive-sounding, generic message.
// // //             return res.status(200).json({ message: "If an account with this email exists, a password reset OTP has been sent." });
// // //         }

// // //         const otp = crypto.randomInt(100000, 999999).toString();
// // //         const redisKey = `reset-password:${emailId}`;
// // //         await redisclient.set(redisKey, otp);
// // //         await redisclient.expire(redisKey, 600); // OTP is valid for 10 minutes

// // //         const mailOptions = {
// // //             from: `"Coder World" <${process.env.EMAIL_USER}>`,
// // //             to: emailId,
// // //             subject: "Your Password Reset Code",
// // //             html: `<p>You requested a password reset. Your One-Time Password is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>`,
// // //         };
// // //         await transporter.sendMail(mailOptions);
        
// // //         res.status(200).json({ message: "If an account with this email exists, a password reset OTP has been sent." });

// // //     } catch (err) {
// // //         console.error("Error in forgotPasswordSendOtp:", err);
// // //         res.status(500).json({ message: "An internal server error occurred." });
// // //     }
// // // };

// // // // ====================================================================
// // // // FORGOT PASSWORD - STEP 2: Verify OTP and Reset the Password
// // // // ====================================================================
// // // const resetPasswordWithOtp = async (req, res) => {
// // //     try {
// // //         const { emailId, otp, newPassword } = req.body;
// // //         if (!emailId || !otp || !newPassword) {
// // //             return res.status(400).json({ message: "Email, OTP, and new password are required." });
// // //         }
        
// // //         const redisKey = `reset-password:${emailId}`;
// // //         const storedOtp = await redisclient.get(redisKey);

// // //         if (!storedOtp) {
// // //             return res.status(400).json({ message: "OTP has expired. Please request a new one." });
// // //         }
// // //         if (storedOtp !== otp) {
// // //             return res.status(400).json({ message: "The OTP you entered is incorrect." });
// // //         }
        
// // //         const hashedPassword = await bcrypt.hash(newPassword, 10);
// // //         await user.findOneAndUpdate({ emailId }, { password: hashedPassword });
        
// // //         await redisclient.del(redisKey);
        
// // //         res.status(200).json({ message: "Password has been reset successfully. You can now log in." });

// // //     } catch (err) {
// // //         console.error("Error in resetPasswordWithOtp:", err);
// // //         res.status(500).json({ message: "An internal server error occurred." });
// // //     }
// // // };

// // // // ====================================================================
// // // const getUserDashboardStats = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id; // From your auth middleware

// // //         // 1. Get user and total problem count in parallel for efficiency
// // //         const [userData, totalProblemCount] = await Promise.all([
// // //             user.findById(userId).lean(),
// // //             problem.countDocuments()
// // //         ]);

// // //         if (!userData) {
// // //             return res.status(404).json({ message: "User not found" });
// // //         }

// // //         // 2. Get all successful submissions for streak calculation, sorted by newest first
// // //         const submissions = await submission.find({ 
// // //             userid: userId, 
// // //             status: 'accepted' 
// // //         }).sort({ createdAt: -1 }).lean();

// // //         // 3. Calculate Daily Streak
// // //         let dailyStreak = 0;
// // //         if (submissions.length > 0) {
// // //             const uniqueDates = [...new Set(submissions.map(s => new Date(s.createdAt).toDateString()))];
// // //             let currentDate = new Date();
// // //             let streakActive = false;

// // //             // Check if the user solved a problem today or yesterday to start the streak
// // //             if (uniqueDates.includes(currentDate.toDateString())) {
// // //                 streakActive = true;
// // //             } else {
// // //                 let yesterday = new Date();
// // //                 yesterday.setDate(yesterday.getDate() - 1);
// // //                 if (uniqueDates.includes(yesterday.toDateString())) {
// // //                     streakActive = true;
// // //                     currentDate = yesterday; // Start counting from yesterday
// // //                 }
// // //             }

// // //             if (streakActive) {
// // //                 dailyStreak = 1;
// // //                 // Loop backwards from the current streak day
// // //                 for (let i = 1; i < uniqueDates.length; i++) {
// // //                     let previousDay = new Date(currentDate);
// // //                     previousDay.setDate(previousDay.getDate() - 1);
// // //                     if (uniqueDates.includes(previousDay.toDateString())) {
// // //                         dailyStreak++;
// // //                         currentDate = previousDay;
// // //                     } else {
// // //                         break; // Streak is broken
// // //                     }
// // //                 }
// // //             }
// // //         }
        
// // //         // 4. Calculate Rank/Level based on solved count
// // //         const solvedCount = userData.problemsSolved?.length || 0;
// // //         let rank = 'Novice';
// // //         if (solvedCount > 50) rank = 'Expert';
// // //         else if (solvedCount > 25) rank = 'Pro';
// // //         else if (solvedCount > 10) rank = 'Adept';
// // //         else if (solvedCount > 5) rank = 'Rookie';

// // //         // 5. Assemble the final stats object
// // //         const stats = {
// // //             solvedCount,
// // //             totalProblemCount,
// // //             dailyStreak,
// // //             rank,
// // //         };

// // //         res.status(200).json(stats);

// // //     } catch (err) {
// // //         console.error("Error fetching dashboard stats:", err);
// // //         res.status(500).json({ message: "Internal server error." });
// // //     }
// // // };

// // // const getUserProfileDetails = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;

// // //         // 1. Get Core User Data and Total Problem Count
// // //         const [userData, totalProblemCount, totalProblems] = await Promise.all([
// // //             user.findById(userId).lean(),
// // //             problem.countDocuments(),
// // //             problem.find({}).select('difficulty').lean() // Get all problems for total counts
// // //         ]);

// // //         if (!userData) return res.status(404).json({ message: "User not found" });

// // //         const solvedProblemIds = userData.problemsSolved || [];

// // //         // 2. Get All Required Data in Parallel for maximum speed
// // //         const [
// // //             solvedProblems,
// // //             allSubmissions,
// // //             recentAcceptedSubmissions
// // //         ] = await Promise.all([
// // //             problem.find({ _id: { $in: solvedProblemIds } }).select('difficulty tags').lean(),
// // //             submission.find({ userid: userId }).select('createdAt').lean(),
// // //             submission.find({ userid: userId, status: 'accepted' })
// // //                 .sort({ createdAt: -1 }).limit(5)
// // //                 .populate({ path: 'problemid', select: 'title _id' }).lean()
// // //         ]);

// // //         // 3. Process Data for the Frontend
// // //         const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
// // //         const totalDifficulty = { easy: 0, medium: 0, hard: 0 };
// // //         solvedProblems.forEach(p => { if (p.difficulty) difficultyBreakdown[p.difficulty]++; });
// // //         totalProblems.forEach(p => { if (p.difficulty) totalDifficulty[p.difficulty]++; });

// // //         const skillsBreakdown = {};
// // //         solvedProblems.forEach(p => { if (p.tags) skillsBreakdown[p.tags] = (skillsBreakdown[p.tags] || 0) + 1; });

// // //         const calendarData = allSubmissions.map(sub => ({ date: sub.createdAt }));

// // //         const profileData = {
// // //             username: userData.firstname,
// // //             rank: userData.rank || 1081203,
// // //             solvedCount: solvedProblemIds.length,
// // //             totalProblemCount,
// // //             difficultyBreakdown,
// // //             totalDifficulty,
// // //             skillsBreakdown,
// // //             submissionCalendar: calendarData,
// // //             recentSubmissions: recentAcceptedSubmissions.map(s => ({
// // //                 _id: s._id,
// // //                 title: s.problemid.title,
// // //                 problemId: s.problemid._id,
// // //                 submittedAt: s.createdAt,
// // //             }))
// // //         };
        
// // //         res.status(200).json(profileData);

// // //     } catch (err) {
// // //         console.error("Error fetching user profile details:", err);
// // //         res.status(500).json({ message: "Internal server error" });
// // //     }
// // // };

// // // // ====================================================================
// // // // NEW: Get submissions for a specific date (for the interactive heatmap)
// // // // ====================================================================
// // // const getSubmissionsByDate = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         const { date } = req.query; // Expecting date in 'YYYY-MM-DD' format

// // //         if (!date) {
// // //             return res.status(400).json({ message: "Date parameter is required." });
// // //         }
        
// // //         const startOfDay = new Date(date);
// // //         startOfDay.setUTCHours(0, 0, 0, 0);

// // //         const endOfDay = new Date(date);
// // //         endOfDay.setUTCHours(23, 59, 59, 999);
        
// // //         const submissionsOnDate = await submission.find({
// // //             userid: userId,
// // //             createdAt: { $gte: startOfDay, $lte: endOfDay }
// // //         }).sort({ createdAt: -1 }).populate({ path: 'problemid', select: 'title' }).lean();

// // //         res.status(200).json(submissionsOnDate);

// // //     } catch (err) {
// // //         console.error("Error fetching submissions by date:", err);
// // //         res.status(500).json({ message: "Internal server error" });
// // //     }
// // // };
// // // const getEditableProfile = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         const userData = await user.findById(userId)
// // //             .select('firstname emailId profile')
// // //             .lean();
        
// // //         if (!userData) {
// // //             return res.status(404).json({ message: "User not found" });
// // //         }
        
// // //         // Ensure the profile object exists for a consistent response
// // //         const responseData = {
// // //             ...userData,
// // //             profile: userData.profile || {} // Return empty object if profile doesn't exist
// // //         };

// // //         res.status(200).json(responseData);

// // //     } catch (err) {
// // //         console.error("Error fetching editable profile:", err);
// // //         res.status(500).json({ message: "Internal Server Error" });
// // //     }
// // // };

// // // // ====================================================================
// // // // NEW: Update a specific field in the user's profile
// // // // ====================================================================
// // // const updateProfileField = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         const { field, value } = req.body;

// // //         const allowedProfileFields = [
// // //             'location', 'birthday', 'gender', 'summary', 'website', 
// // //             'github', 'linkedin', 'twitter', 'work', 'education', 'skills'
// // //         ];

// // //         let updateQuery;

// // //         if (field === 'firstname') {
// // //             updateQuery = { $set: { firstname: value } };
// // //         } else if (allowedProfileFields.includes(field)) {
// // //             // Use dot notation to update a field within the nested 'profile' object
// // //             updateQuery = { $set: { [`profile.${field}`]: value } };
// // //         } else {
// // //             return res.status(400).json({ message: "Invalid field specified for update." });
// // //         }

// // //         const updatedUser = await user.findByIdAndUpdate(
// // //             userId, 
// // //             updateQuery,
// // //             { new: true, runValidators: true }
// // //         ).select('firstname profile'); // Select the fields that might have changed

// // //         if (!updatedUser) {
// // //             return res.status(404).json({ message: "User not found" });
// // //         }

// // //         res.status(200).json({ message: "Profile updated successfully", user: updatedUser });

// // //     } catch (err) {
// // //         console.error("Error updating profile field:", err);
// // //         res.status(500).json({ message: "Server error: " + err.message });
// // //     }
// // // };

// // // const updateSetting = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         // Expecting 'path' like 'notifications.importantAnnouncements.email' and 'value' (true/false)
// // //         const { path, value } = req.body;

// // //         if (!path || typeof value !== 'boolean') {
// // //             return res.status(400).json({ message: "Invalid settings update request." });
// // //         }
        
// // //         // --- THIS IS THE KEY CHANGE ---
// // //         // The path from the frontend directly maps to the database field path.
// // //         const updateQuery = { $set: { [`settings.${path}`]: value } };
        
// // //         await user.findByIdAndUpdate(userId, updateQuery);

// // //         res.status(200).json({ message: "Setting updated successfully." });
// // //     } catch (err) {
// // //         console.error("Error updating setting:", err);
// // //         res.status(500).json({ message: "Server Error" });
// // //     }
// // // };
// // // const getNotifications = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         // Find all notifications and add a field 'isRead' if the user's ID is in the 'readBy' array
// // //         const notifications = await Notification.aggregate([
// // //             { $sort: { createdAt: -1 } },
// // //             { $limit: 10 }, // Get the 10 most recent notifications
// // //             {
// // //                 $addFields: {
// // //                     isRead: { $in: [new mongoose.Types.ObjectId(userId), "$readBy"] }
// // //                 }
// // //             },
// // //             { $project: { readBy: 0 } } // Don't send the full list of readers
// // //         ]);
        
// // //         const unreadCount = notifications.filter(n => !n.isRead).length;

// // //         res.status(200).json({ notifications, unreadCount });
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Server Error: " + err.message });
// // //     }
// // // };

// // // // --- NEW: Mark all notifications as read for the user ---
// // // const markNotificationsAsRead = async (req, res) => {
// // //     try {
// // //         const userId = req.ans1.id;
// // //         // Add the user's ID to the 'readBy' array for all notifications
// // //         // where their ID is not already present.
// // //         await Notification.updateMany(
// // //             { readBy: { $ne: userId } },
// // //             { $addToSet: { readBy: userId } }
// // //         );
// // //         res.status(200).json({ message: "Notifications marked as read." });
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Server Error: " + err.message });
// // //     }
// // // };

// // // // --- You would also need an admin controller to create notifications ---
// // // // Example (place in an admin controller file):
// // // const createNotification = async (req, res) => {
// // //     try {
// // //         const { title, message, link } = req.body;
// // //         const newNotification = await Notification.create({ title, message, link });
// // //         res.status(201).json(newNotification);
// // //     } catch (err) {
// // //         res.status(400).json({ message: "Error creating notification." });
// // //     }
// // // };


// // // // In your module.exports at the end of the file, add the new function:
// // // module.exports = {
// // //     sendOtpForRegistration,
// // //     verifyOtpAndRegister,
// // //     getUserProfileDetails,
// // //     updateSetting,
// // //       getEditableProfile,
// // //     updateProfileField,
// // //     getSubmissionsByDate,
// // //     getNotifications,
// // //     markNotificationsAsRead,
// // //     login,
// // //     logout,
// // //     adminregister,
// // //     deleteprofile,
// // //     forgotPasswordSendOtp,
// // //     resetPasswordWithOtp,
// // //     getUserDashboardStats, // <-- **ADD THIS EXPORT**
// // // // };
// // const user = require("../models/users");
// // const validate = require("../utils/validator");
// // const redisclient = require("../redis/redis");
// // const bcrypt = require("bcrypt");
// // const jwt = require('jsonwebtoken');
// // const submission = require("../models/submission"); // Assuming this is used elsewhere
// // const nodemailer = require("nodemailer");
// // const crypto = require("crypto");

// // // --- NODEMAILER CONFIGURATION ---
// // // IMPORTANT: Use environment variables for security.
// // // For Gmail, you may need to create an "App Password".
// // const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //         user: process.env.EMAIL_USER || "your-email@gmail.com", // Replace with your email from .env
// //         pass: process.env.EMAIL_PASS || "your-email-password", // Replace with your email password from .env
// //     },
// // });

// // // STEP 1: Sends OTP to user's email and stores registration data in Redis
// // // const sendOtpForRegistration = async (req, res) => {
// // //     try {
// // //         // Ensure validation happens here for all fields required for registration
// // //         // Assuming 'validate' function throws an error if validation fails
// // //         validate(req.body); 
// // //         const { firstname, emailId, password } = req.body;

// // //         const existingUser = await user.findOne({ emailId });
// // //         if (existingUser) {
// // //             return res.status(409).json({ message: 'An account with this email already exists.' });
// // //         }

// // //         const otp = crypto.randomInt(100000, 999999).toString();
// // //         const hashedPassword = await bcrypt.hash(password, 10);

// // //         // Store user data and OTP in Redis for 10 minutes (600 seconds)
// // //         const registrationData = {
// // //             firstname,
// // //             emailId,
// // //             password: hashedPassword,
// // //             otp,
// // //         };
// // //         await redisclient.set(`register:${emailId}`, JSON.stringify(registrationData));
// // //         await redisclient.expire(`register:${emailId}`, 600); 

// // //         // Send OTP via email
// // //         const mailOptions = {
// // //             from: process.env.EMAIL_USER || "your-email@gmail.com",
// // //             to: emailId,
// // //             subject: "Your Account Verification Code",
// // //             text: `Thank you for registering. Your OTP is ${otp}. It is valid for 10 minutes.`,
// // //         };

// // //         await transporter.sendMail(mailOptions);

// // //         res.status(200).json({ message: `OTP has been sent to ${emailId}` });

// // //     } catch (err) {
// // //         console.error("Error in sendOtpForRegistration:", err);
// // //         // Provide more specific error messages if possible from validate or nodemailer
// // //         if (err.name === 'ValidationError') { // Assuming validate throws a named error
// // //             return res.status(400).json({ message: err.message });
// // //         }
// // //         res.status(500).json({ message: 'Failed to send OTP. Please try again later.' }); // General server error
// // //     }
// // // };

// // // // STEP 2: Verifies OTP and creates the user
// // // const verifyOtpAndRegister = async (req, res) => {
// // //     try {
// // //         const { emailId, otp } = req.body;
// // //         if (!emailId || !otp) {
// // //             return res.status(400).json({ message: "Email and OTP are required." });
// // //         }

// // //         const storedDataString = await redisclient.get(`register:${emailId}`);
// // //         if (!storedDataString) {
// // //             // This case covers both OTP expiration and if no registration was initiated
// // //             return res.status(400).json({ message: "OTP expired or no pending registration found. Please try signing up again." });
// // //         }

// // //         const storedData = JSON.parse(storedDataString);

// // //         if (storedData.otp !== otp) {
// // //             // FIX: More specific error for invalid OTP
// // //             return res.status(400).json({ message: "Invalid OTP entered. Please check and try again." });
// // //         }

// // //         // Check if user already exists *after* OTP validation (race condition unlikely but good to double check)
// // //         const existingUser = await user.findOne({ emailId });
// // //         if (existingUser) {
// // //             // If somehow user was created in between, clean up redis and report.
// // //             await redisclient.del(`register:${emailId}`);
// // //             return res.status(409).json({ message: 'An account with this email already exists.' });
// // //         }

// // //         // OTP is correct, create the user
// // //         const newUserPayload = {
// // //             firstname: storedData.firstname,
// // //             emailId: storedData.emailId,
// // //             password: storedData.password,
// // //             role: 'user',
// // //         };

// // //         const user1 = await user.create(newUserPayload);

// // //         // Clean up Redis
// // //         await redisclient.del(`register:${emailId}`);

// // //         // Create JWT and log user in
// // //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
        
// // //         const reply = {
// // //             firstname: user1.firstname,
// // //             emailId: user1.emailId,
// // //             id: user1.id,
// // //             role: user1.role,
// // //         };

// // //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
        
// // //         res.status(201).json({
// // //             user: reply,
// // //             token,
// // //             message: "Registration successful!",
// // //         });

// // //     } catch (err) {
// // //         console.error("Error in verifyOtpAndRegister:", err);
// // //         res.status(500).json({ message: err.message || "An internal server error occurred during registration." });
// // //     }
// // // }

// // // const sendOtpForRegistration = async (req, res) => {
// // //     try {
// // //         validate(req.body);
// // //         const { firstname, emailId, password } = req.body;
// // //         const existingUser = await user.findOne({ emailId });
// // //         if (existingUser) {
// // //             return res.status(409).json({ message: 'An account with this email already exists.' });
// // //         }
// // //         const otp = crypto.randomInt(100000, 999999).toString();
// // //         const hashedPassword = await bcrypt.hash(password, 10);
// // //         const registrationData = { firstname, emailId, password: hashedPassword, otp };
// // //         const redisKey = `register:${emailId}`;
// // //         await redisclient.set(redisKey, JSON.stringify(registrationData));
// // //         await redisclient.expire(redisKey, 600);
// // //         const mailOptions = {
// // //             from: `"Coder World" <${process.env.EMAIL_USER}>`,
// // //             to: emailId,
// // //             subject: "Your Account Verification Code",
// // //             html: `<p>Thank you for signing up. Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>`,
// // //         };
// // //         await transporter.sendMail(mailOptions);
// // //         res.status(200).json({ message: `An OTP has been sent to ${emailId}.` });
// // //     } catch (err) {
// // //         console.error("Error in sendOtpForRegistration:", err);
// // //         res.status(400).json({ message: err.message || 'An error occurred while processing your request.' });
// // //     }
// // // };

// // // const verifyOtpAndRegister = async (req, res) => {
// // //     try {
// // //         const { emailId, otp } = req.body;
// // //         if (!emailId || !otp) return res.status(400).json({ message: "Email and OTP are required." });

// // //         const redisKey = `register:${emailId}`;
// // //         const storedDataString = await redisclient.get(redisKey);
// // //         if (!storedDataString) return res.status(400).json({ message: "OTP has expired or is invalid. Please try signing up again." });

// // //         const storedData = JSON.parse(storedDataString);
// // //         if (storedData.otp !== otp) return res.status(400).json({ message: "The OTP you entered is incorrect." });

// // //         const newUserPayload = {
// // //             firstname: storedData.firstname,
// // //             emailId: storedData.emailId,
// // //             password: storedData.password,
// // //             isProfileComplete: true,
// // //             role: 'user',
// // //         };

// // //         const user1 = await user.create(newUserPayload);
// // //         await redisclient.del(redisKey);
// // //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
// // //         const reply = { firstname: user1.firstname, emailId: user1.emailId, id: user1.id, role: user1.role };
// // //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// // //         res.status(201).json({ user: reply, message: "Registration successful! You are now logged in." });
// // //     } catch (err) {
// // //         console.error("Error in verifyOtpAndRegister:", err);
// // //         res.status(500).json({ message: err.message || "An internal server error occurred." });
// // //     }
// // // };

// // // const sendOtpForRegistration = async (req, res) => {
// // //     try {
// // //         validate(req.body);
// // //         const { firstname, emailId, password } = req.body;
// // //         const existingUser = await user.findOne({ emailId });
// // //         if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });
// // //         const otp = crypto.randomInt(100000, 999999).toString();
// // //         const hashedPassword = await bcrypt.hash(password, 10);
// // //         const registrationData = { firstname, emailId, password: hashedPassword, otp };
// // //         const redisKey = `register:${emailId}`;
// // //         await redisclient.set(redisKey, JSON.stringify(registrationData));
// // //         await redisclient.expire(redisKey, 600);
// // //         const mailOptions = { from: `"Coder World" <${process.env.EMAIL_USER}>`, to: emailId, subject: "Your Account Verification Code", html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>` };
// // //         await transporter.sendMail(mailOptions);
// // //         res.status(200).json({ message: `An OTP has been sent to ${emailId}.` });
// // //     } catch (err) {
// // //         console.error("Error in sendOtpForRegistration:", err);
// // //         res.status(400).json({ message: err.message || 'An error occurred while processing your request.' });
// // //     }
// // // };

// // // const verifyOtpAndRegister = async (req, res) => {
// // //     try {
// // //         const { emailId, otp } = req.body;
// // //         if (!emailId || !otp) return res.status(400).json({ message: "Email and OTP are required." });
// // //         const redisKey = `register:${emailId}`;
// // //         const storedDataString = await redisclient.get(redisKey);
// // //         if (!storedDataString) return res.status(400).json({ message: "OTP has expired or is invalid. Please try signing up again." });
// // //         const storedData = JSON.parse(storedDataString);
// // //         if (storedData.otp !== otp) return res.status(400).json({ message: "The OTP you entered is incorrect." });
// // //         const newUserPayload = { firstname: storedData.firstname, emailId: storedData.emailId, password: storedData.password, isProfileComplete: true, role: 'user' };
// // //         const user1 = await user.create(newUserPayload);
// // //         await redisclient.del(redisKey);
// // //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
// // //         const reply = { firstname: user1.firstname, emailId: user1.emailId, id: user1.id, role: user1.role };
// // //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// // //         res.status(201).json({ user: reply, message: "Registration successful! You are now logged in." });
// // //     } catch (err) {
// // //         console.error("Error in verifyOtpAndRegister:", err);
// // //         res.status(500).json({ message: err.message || "An internal server error occurred." });
// // //     }
// // // };
// // const sendOtpForRegistration = async (req, res) => {
// //     try {
// //         validate(req.body);
// //         const { firstname, emailId, password } = req.body;
// //         const existingUser = await user.findOne({ emailId });
// //         if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });
// //         const otp = crypto.randomInt(100000, 999999).toString();
// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         const registrationData = { firstname, emailId, password: hashedPassword, otp };
// //         const redisKey = `register:${emailId}`;
// //         await redisclient.set(redisKey, JSON.stringify(registrationData));
// //         await redisclient.expire(redisKey, 600);
// //         const mailOptions = { from: `"Coder World" <${process.env.EMAIL_USER}>`, to: emailId, subject: "Your Account Verification Code", html: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>` };
// //         await transporter.sendMail(mailOptions);
// //         res.status(200).json({ message: `An OTP has been sent to ${emailId}.` });
// //     } catch (err) {
// //         console.error("Error in sendOtpForRegistration:", err);
// //         res.status(400).json({ message: err.message || 'An error occurred while processing your request.' });
// //     }
// // };

// // const verifyOtpAndRegister = async (req, res) => {
// //     try {
// //         const { emailId, otp } = req.body;
// //         if (!emailId || !otp) return res.status(400).json({ message: "Email and OTP are required." });
// //         const redisKey = `register:${emailId}`;
// //         const storedDataString = await redisclient.get(redisKey);
// //         if (!storedDataString) return res.status(400).json({ message: "OTP has expired or is invalid. Please try signing up again." });
// //         const storedData = JSON.parse(storedDataString);
// //         if (storedData.otp !== otp) return res.status(400).json({ message: "The OTP you entered is incorrect." });
// //         const newUserPayload = { firstname: storedData.firstname, emailId: storedData.emailId, password: storedData.password, isProfileComplete: true, role: 'user' };
// //         const user1 = await user.create(newUserPayload);
// //         await redisclient.del(redisKey);
// //         const token = jwt.sign({ id: user1.id, emailId: user1.emailId, role: user1.role }, process.env.JWT_KEY, { expiresIn: '1h' });
// //         const reply = { firstname: user1.firstname, emailId: user1.emailId, id: user1.id, role: user1.role };
// //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// //         res.status(201).json({ user: reply, message: "Registration successful! You are now logged in." });
// //     } catch (err) {
// //         console.error("Error in verifyOtpAndRegister:", err);
// //         res.status(500).json({ message: err.message || "An internal server error occurred." });
// //     }
// // };

// // const login = async (req, res) => {
// //     try {
// //         const { emailId, password } = req.body;
// //         if (!emailId || !password) return res.status(401).json({ message: "Invalid credentials" });
// //         const people1 = await user.findOne({ emailId });
// //         if (!people1) return res.status(401).json({ message: "Invalid credentials" });
// //         if (!people1.password) return res.status(401).json({ message: "This account uses a social login. Please sign in with that provider." });
// //         const match = await bcrypt.compare(password, people1.password);
// //         if (!match) return res.status(401).json({ message: "Invalid credentials" });
// //         const token = jwt.sign({ id: people1.id, emailId: emailId, role: people1.role }, process.env.JWT_KEY, { expiresIn: 3600 });
// //         const reply = { firstname: people1.firstname, emailId: people1.emailId, id: people1.id, role: people1.role };
// //         res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
// //         res.status(200).json({ user: reply, message: "Logged in successfully" });
// //     } catch (err) {
// //         res.status(500).json({ message: "Internal server error: " + err.message });
// //     }
// // };

// // const logout = async (req, res) => {
// //     try {
// //         const { token } = req.cookies;
// //         if (token) {
// //             const payload = jwt.decode(token);
// //             if (payload && payload.exp) await redisclient.set(`token:${token}`, "blocked", { EXAT: payload.exp });
// //         }
// //         res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
// //         res.status(200).json({ message: "Logged out successfully" });
// //     } catch (err) {
// //         res.status(503).json({ message: "Logout failed: " + err.message });
// //     }
// // };

// // const forgotPasswordSendOtp = async (req, res) => {
// //     try {
// //         const { emailId } = req.body;
// //         if (!emailId) return res.status(400).json({ message: "Email address is required." });
// //         const existingUser = await user.findOne({ emailId });
// //         if (!existingUser) return res.status(200).json({ message: "If an account with this email exists, an OTP has been sent." });
// //         const otp = crypto.randomInt(100000, 999999).toString();
// //         const redisKey = `reset-password:${emailId}`;
// //         await redisclient.set(redisKey, otp);
// //         await redisclient.expire(redisKey, 600);
// //         const mailOptions = { from: `"Coder World" <${process.env.EMAIL_USER}>`, to: emailId, subject: "Your Password Reset Code", html: `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>` };
// //         await transporter.sendMail(mailOptions);
// //         res.status(200).json({ message: "If an account with this email exists, an OTP has been sent." });
// //     } catch (err) {
// //         console.error("Error in forgotPasswordSendOtp:", err);
// //         res.status(500).json({ message: "An internal server error occurred." });
// //     }
// // };

// // const resetPasswordWithOtp = async (req, res) => {
// //     try {
// //         const { emailId, otp, newPassword } = req.body;
// //         if (!emailId || !otp || !newPassword) return res.status(400).json({ message: "Email, OTP, and new password are required." });
// //         const redisKey = `reset-password:${emailId}`;
// //         const storedOtp = await redisclient.get(redisKey);
// //         if (!storedOtp) return res.status(400).json({ message: "OTP has expired. Please try again." });
// //         if (storedOtp !== otp) return res.status(400).json({ message: "The OTP you entered is incorrect." });
// //         const hashedPassword = await bcrypt.hash(newPassword, 10);
// //         await user.findOneAndUpdate({ emailId }, { password: hashedPassword });
// //         await redisclient.del(redisKey);
// //         res.status(200).json({ message: "Password has been reset successfully. You can now log in." });
// //     } catch (err) {
// //         console.error("Error in resetPasswordWithOtp:", err);
// //         res.status(500).json({ message: "An internal server error occurred." });
// //     }
// // };
// // // const register = async(req,res)=>{
// // //     try{
// // //       validate(req.body); 
// // //       const {firstname, emailId, password}  = req.body;

// // //       req.body.password = await bcrypt.hash(password, 10);
// // //       req.body.role = 'user'
        
// // //      const user1 =  await user.create(req.body);
// // //      const token =  jwt.sign({id:user1.id , emailId:emailId, role:'user1'},process.env.JWT_KEY,{expiresIn: 60*60});
// // //      const reply = {
// // //         firstname: user1.firstname,
// // //         emailId: user1.emailId,
// // //         id: user1.id,
// // //         role:user1.role
// // //     }
// // //      res.cookie('token',token,{maxAge: 60*60*1000});
// // //      res.status(201).json({
// // //         user:reply,
// // //         message:"register  Successfully"
// // //     })
// // //     console.log("done")
// // //     }
// // //     catch(err){
// // //         console.error("Error in register (legacy):", err);
// // //         res.status(400).json({ message: "Error1: " + err });
// // //     }
// // // }

// // // const login = async (req, res) => {
// // //     try {
// // //         const { emailId, password } = req.body;

// // //         if (!emailId || !password) {
// // //             return res.status(401).json({ message: "Invalid credential" });
// // //         }

// // //         const people1 = await user.findOne({ emailId });

// // //         if (!people1) {
// // //             return res.status(401).json({ message: "Invalid credential" });
// // //         }

// // //         const match = await bcrypt.compare(password, people1.password);

// // //         if (!match) {
// // //             return res.status(401).json({ message: "Invalid credential" });
// // //         }

// // //         const token = jwt.sign(
// // //             { id: people1.id, emailId: emailId, role: people1.role },
// // //             process.env.JWT_KEY,
// // //             { expiresIn: '1h' } // Token expires in 1 hour
// // //         );

// // //         const reply = {
// // //             firstname: people1.firstname,
// // //             emailId: people1.emailId,
// // //             id: people1.id,
// // //             role: people1.role,
// // //         };

// // //         // ✅ Set token in cookie
// // //         res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });

// // //         // ✅ Also send token in response body (for client-side storage if needed)
// // //         res.status(200).json({
// // //             user: reply,
// // //             token, // <-- Add this line
// // //             message: "Login successful",
// // //         });
// // //     } catch (err) {
// // //         console.error("Error in login:", err);
// // //         res.status(401).json({ message: "error " + err.message });
// // //     }
// // // };

// // // const logout = async (req,res)=>{
// // //     try{
// // //         const token = req.cookies.token; // Get token from cookies
// // //         if (token) {
// // //             const payload = jwt.decode(token);
// // //             // Blacklist the token with its remaining expiry time
// // //             if (payload && payload.exp) {
// // //                 const expiresInSeconds = payload.exp - Math.floor(Date.now() / 1000);
// // //                 if (expiresInSeconds > 0) {
// // //                     await redisclient.set(`blocked_token:${token}`, "blocked");
// // //                     await redisclient.expire(`blocked_token:${token}`, expiresInSeconds);
// // //                 }
// // //             }
// // //         }
// // //         res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' }); // Clear the token cookie
// // //         res.status(200).json({ message: "Logout successful" });
// // //     } catch(err){
// // //         console.error("Error in logout:", err);
// // //         res.status(503).json({ message: "Invalid request or server error" });
// // //     }
// // // }

// // const adminregister=async (req,res)=>{
// //     try{
// //         if(req.ans1.role!='admin') {
// //             return res.status(403).json({ message: "Unauthorized: Admin access required." });
// //         }
            
// //         validate(req.body); 
// //         const {firstname,emailId,password}=req.body;
        
// //         req.body.password=await bcrypt.hash(password,10)
    
// //         const user1=await user.create(req.body);
        
// //         const token=jwt.sign({id:user1.id,emailId:emailId,role:user1.role},process.env.JWT_KEY,{expiresIn:3600});
// //         res.cookie('token',token,{maxAge:60*60*1000});
// //         res.status(201).json({ message: "Admin user registered successfully" });
    
// //     }
// //     catch(err){
// //        console.error("Error in adminregister:", err);
// //        res.status(400).json({ message: "Error: " + err.message });
// //     }
// // }

// // // NEW: Send OTP for password reset
// // const sendOtpForPasswordReset = async (req, res) => {
// //     try {
// //         const { emailId } = req.body;
// //         if (!emailId) {
// //             return res.status(400).json({ message: "Email is required." });
// //         }

// //         const existingUser = await user.findOne({ emailId });
// //         if (!existingUser) {
// //             // Be vague about user existence for security
// //             return res.status(200).json({ message: "If the email is registered, an OTP has been sent." });
// //         }

// //         const otp = crypto.randomInt(100000, 999999).toString();
// //         // Store OTP in Redis with a specific key for password reset, expires in 10 minutes
// //         await redisclient.set(`password_reset:${emailId}`, otp);
// //         await redisclient.expire(`password_reset:${emailId}`, 600); 

// //         const mailOptions = {
// //             from: process.env.EMAIL_USER || "your-email@gmail.com",
// //             to: emailId,
// //             subject: "Password Reset OTP for CoderWorld",
// //             text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes. Do not share it with anyone.`,
// //         };

// //         await transporter.sendMail(mailOptions);
// //         res.status(200).json({ message: `OTP sent to ${emailId} for password reset.` });

// //     } catch (err) {
// //         console.error("Error sending OTP for password reset:", err);
// //         res.status(500).json({ message: "Failed to send OTP. Please try again later." });
// //     }
// // };

// // // NEW: Reset password using OTP
// // const resetPassword = async (req, res) => {
// //     try {
// //         const { emailId, otp, newPassword } = req.body;
// //         if (!emailId || !otp || !newPassword) {
// //             return res.status(400).json({ message: "Email, OTP, and new password are required." });
// //         }

// //         const storedOtp = await redisclient.get(`password_reset:${emailId}`);
// //         if (!storedOtp || storedOtp !== otp) {
// //             return res.status(400).json({ message: "Invalid or expired OTP." });
// //         }

// //         const existingUser = await user.findOne({ emailId });
// //         if (!existingUser) {
// //             return res.status(404).json({ message: "User not found." });
// //         }

// //         // Hash the new password
// //         existingUser.password = await bcrypt.hash(newPassword, 10);
// //         await existingUser.save();

// //         // Delete the OTP from Redis after successful reset
// //         await redisclient.del(`password_reset:${emailId}`);

// //         res.status(200).json({ message: "Password has been reset successfully." });

// //     } catch (err) {
// //         console.error("Error resetting password:", err);
// //         res.status(500).json({ message: "Failed to reset password. Please try again." });
// //     }
// // };

// // // MODIFIED: Allows user to delete their own profile
// // const deleteprofile = async (req, res) => {
// //     try {
// //         const userId = req.ans1.id; // From usermiddleware
// //         if (!userId) {
// //             return res.status(400).json({ message: "User ID not found in token." });
// //         }

// //         const deletedUser = await user.findByIdAndDelete(userId);
// //         if (!deletedUser) {
// //             return res.status(404).json({ message: "User not found." });
// //         }
        
// //         // Clear the token cookie after successful deletion
// //         res.cookie("token", "", { expires: new Date(0), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' });
// //         res.status(200).json({ message: "Profile deleted successfully." });
// //     } catch (err) {
// //         console.error("Error deleting profile:", err);
// //         res.status(500).json({ message: "Internal server error: " + err.message });
// //     }
// // };

// // module.exports = {
// // sendOtpForRegistration, verifyOtpAndRegister, login, logout, forgotPasswordSendOtp, resetPasswordWithOtp, 
// //    
// //     adminregister,
// //     sendOtpForPasswordReset,
// //     resetPassword,
// //     deleteprofile
// // };


const user = require("../models/users");
const validate = require("../utils/validator"); // Assuming this utility handles input validation and throws errors.
const redisclient = require("../redis/redis"); // Assuming redisclient is correctly initialized and connected.
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const submission = require("../models/submission"); // For cascade deletion in deleteprofile
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// --- NODEMAILER CONFIGURATION ---
// IMPORTANT: Use environment variables for security.
// For Gmail, you may need to create an "App Password".
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Ensure this is set in your .env file
    pass: process.env.EMAIL_PASS, // Ensure this is set in your .env file
  },
});

// Helper function for cookie options
const getCookieOptions = () => ({
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'Lax', // Protects against CSRF attacks
});

// --- NEW REGISTRATION FLOW - STEP 1: Send OTP for Registration ---
const sendOtpForRegistration = async (req, res) => {
    try {
        // Validate input fields (e.g., email format, password strength)
        validate(req.body); 
        const { firstname, emailId, password } = req.body;

        // Check if user already exists
        const existingUser = await user.findOne({ emailId });
        if (existingUser) {
            // Use 409 Conflict for existing resource
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        // Generate OTP and hash password
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store user data and OTP in Redis for 10 minutes (600 seconds)
        const registrationData = {
            firstname,
            emailId,
            password: hashedPassword,
            otp,
        };
        await redisclient.set(`register:${emailId}`, JSON.stringify(registrationData));
        await redisclient.expire(`register:${emailId}`, 600); 

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Your email
            to: emailId,
            subject: "Your Account Verification Code",
            text: `Thank you for registering. Your OTP is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Thank you for registering with CoderWorld! Your One-Time Password (OTP) for account verification is:</p>
                   <h2><strong>${otp}</strong></h2>
                   <p>This code is valid for 10 minutes. Please do not share this code with anyone.</p>
                   <p>If you did not request this, please ignore this email.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `An OTP has been sent to ${emailId} for verification.` });

    } catch (err) {
        console.error("Error in sendOtpForRegistration:", err);
        // Provide more specific error messages if possible
        if (err.name === 'ValidationError') { // Example: If validate throws a specific error type
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message || 'An error occurred while sending the OTP. Please try again later.' });
    }
};

// --- NEW REGISTRATION FLOW - STEP 2: Verify OTP and Create the User ---
const verifyOtpAndRegister = async (req, res) => {
    try {
        const { emailId, otp } = req.body;
        if (!emailId || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const storedDataString = await redisclient.get(`register:${emailId}`);
        if (!storedDataString) {
            return res.status(400).json({ message: "OTP expired or is invalid. Please try signing up again." });
        }

        const storedData = JSON.parse(storedDataString);

        if (storedData.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP entered. Please check and try again." });
        }

        // OTP is correct, create the user
        const newUserPayload = {
            firstname: storedData.firstname,
            emailId: storedData.emailId,
            password: storedData.password,
            role: 'user', // Default role for new registrations
        };

        const user1 = await user.create(newUserPayload);

        // Clean up Redis: remove the temporary registration data
        await redisclient.del(`register:${emailId}`);

        // Create JWT and log user in
        const token = jwt.sign(
            { id: user1.id, emailId: user1.emailId, role: user1.role },
            process.env.JWT_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        
        const reply = {
            firstname: user1.firstname,
            emailId: user1.emailId,
            id: user1.id,
            role: user1.role,
        };

        // Set token in an HttpOnly cookie for security
        res.cookie('token', token, getCookieOptions());
        
        res.status(201).json({
            user: reply,
            message: "Registration successful! You are now logged in.",
        });

    } catch (err) {
        console.error("Error in verifyOtpAndRegister:", err);
        // Handle specific errors like unique email constraint if not caught earlier
        if (err.code === 11000) { // MongoDB duplicate key error (e.g., email already exists)
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        res.status(500).json({ message: err.message || "An internal server error occurred during registration." });
    }
};

// --- LEGACY REGISTER (If not using OTP, otherwise consider removing) ---
// --- REGISTER (Direct registration) ---
const register = async (req,res)=>{
    try{
      validate(req.body); 
      const {firstname, emailId, password}  = req.body;

      const existingUser = await user.findOne({ emailId });
      if (existingUser) {
          return res.status(409).json({ message: 'An account with this email already exists.' });
      }

      req.body.password = await bcrypt.hash(password, 10);
      req.body.role = 'user';
        
      const user1 =  await user.create(req.body);
      const token =  jwt.sign({id:user1.id , emailId:emailId, role:user1.role},process.env.JWT_KEY,{expiresIn: 60*60});
      const reply = {
        firstname: user1.firstname,
        emailId: user1.emailId,
        id: user1.id,
        role:user1.role
      }
      res.cookie('token', token, getCookieOptions());
      res.status(201).json({
        user: reply,
        token: token, // <--- ADDED: Return token in response body
        message:"Registration successful!"
      })
      console.log("Direct registration done.")
    }
    catch(err){
        console.error("Error in direct register:", err);
        if (err.code === 11000) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        res.status(400).json({ message: "Error: " + err.message });
    }
}

// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(401).json({ message: "Invalid credentials: Email and password are required." });
    }

    const people1 = await user.findOne({ emailId });

    if (!people1) {
      return res.status(401).json({ message: "Invalid credentials: User not found." });
    }

    if (!people1.password) {
        return res.status(401).json({ message: "This account was created with a social provider. Please log in using that provider." });
    }

    const match = await bcrypt.compare(password, people1.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials: Incorrect password." });
    }

    const token = jwt.sign(
      { id: people1.id, emailId: emailId, role: people1.role },
      process.env.JWT_KEY,
      { expiresIn: 3600 }
    );

    const reply = {
      firstname: people1.firstname,
      emailId: people1.emailId,
      id: people1.id,
      role: people1.role,
    };

    res.cookie("token", token, getCookieOptions());

    res.status(200).json({
      user: reply,
      token: token, // <--- Already here, good!
      message: "Login successful",
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Internal server error: " + err.message });
  }
};

// --- LOGOUT ---
const logout = async (req,res)=>{
    try{
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Check both places for robustness
        if (token) {
            const payload = jwt.decode(token);
            if (payload && payload.exp) {
                const expiresInSeconds = payload.exp - Math.floor(Date.now() / 1000);
                if (expiresInSeconds > 0) {
                    await redisclient.set(`token:${token}`, "blocked");
                    await redisclient.expire(`token:${token}`, expiresInSeconds);
                }
            }
        }
        res.cookie("token", "", { expires: new Date(0), ...getCookieOptions() });
        res.status(200).json({ message: "Logout successful" });
    } catch(err){
        console.error("Error in logout:", err);
        res.status(500).json({ message: "Internal server error during logout: " + err.message });
    }
}

// --- ADMIN REGISTER ---
const adminregister=async (req,res)=>{
    try{
        if(req.ans1.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized: Only administrators can register new admin users." });
        }
          
        validate(req.body); 
        const {firstname, emailId, password} = req.body;

        const existingUser = await user.findOne({ emailId });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }
        
        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = 'admin';
    
        const user1 = await user.create(req.body);
        
        const token = jwt.sign({id:user1.id, emailId:emailId, role:user1.role}, process.env.JWT_KEY,{expiresIn:3600});
        res.cookie('token',token, getCookieOptions());
        res.status(201).json({ message: "Admin user registered successfully" });
    }
    catch(err){
       console.error("Error in adminregister:", err);
       if (err.code === 11000) {
           return res.status(409).json({ message: 'An account with this email already exists.' });
       }
       res.status(400).json({ message: "Error during admin registration: " + err.message });
    }
}

// --- DELETE PROFILE ---
const deleteprofile = async (req, res) => {
    try {
        const userId = req.ans1.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID not found in token." });
        }

        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found or already deleted." });
        }
        
        await submission.deleteMany({ userid: userId });
        console.log(`Deleted all submissions for user ${userId}.`);

        res.cookie("token", "", { expires: new Date(0), ...getCookieOptions() });

        res.status(200).json({ message: "Profile and associated data deleted successfully." });
    } catch (err) {
        console.error("Error deleting profile:", err);
        res.status(500).json({ message: "Internal server error during profile deletion: " + err.message });
    }
};
// --- FORGOT PASSWORD - STEP 1: Send OTP for Password Reset ---
const sendOtpForPasswordReset = async (req, res) => {
    try {
        const { emailId } = req.body;
        if (!emailId) {
            return res.status(400).json({ message: "Email address is required." });
        }

        const existingUser = await user.findOne({ emailId });
        if (!existingUser) {
            // Security Best Practice: Do not reveal if the email is registered.
            return res.status(200).json({ message: "If an account with this email exists, a password reset OTP has been sent." });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        // Store OTP in Redis with a specific key for password reset, expires in 10 minutes
        await redisclient.set(`password_reset:${emailId}`, otp);
        await redisclient.expire(`password_reset:${emailId}`, 600); 

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emailId,
            subject: "Password Reset OTP for CoderWorld",
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes. Do not share it with anyone.`,
            html: `<p>You requested a password reset for your CoderWorld account. Your One-Time Password (OTP) is:</p>
                   <h2><strong>${otp}</strong></h2>
                   <p>This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: `OTP sent to ${emailId} for password reset.` });

    } catch (err) {
        console.error("Error sending OTP for password reset:", err);
        res.status(500).json({ message: "Failed to send OTP. Please try again later." });
    }
};

// --- FORGOT PASSWORD - STEP 2: Reset Password using OTP ---
const resetPassword = async (req, res) => {
    try {
        const { emailId, otp, newPassword } = req.body;
        if (!emailId || !otp || !newPassword) {
            return res.status(400).json({ message: "Email, OTP, and new password are required." });
        }

        const storedOtp = await redisclient.get(`password_reset:${emailId}`);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please request a new one." });
        }

        const existingUser = await user.findOne({ emailId });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password and save
        existingUser.password = await bcrypt.hash(newPassword, 10);
        await existingUser.save();

        // Delete the OTP from Redis after successful reset
        await redisclient.del(`password_reset:${emailId}`);

        res.status(200).json({ message: "Password has been reset successfully. You can now log in." });

    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({ message: "Failed to reset password. Please try again." });
    }
};

module.exports = {
    sendOtpForRegistration,
    verifyOtpAndRegister,
    register, // Kept, but consider if still needed alongside OTP flow
    login,
    logout,
    adminregister,
    deleteprofile,
    sendOtpForPasswordReset,
    resetPassword,
};