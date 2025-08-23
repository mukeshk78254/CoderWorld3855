// // // const express=require('express');
// // // const authrouter=express.Router();
// // // const usermiddleware=require("../middleware/middle")
// // // const adminmiddleware=require("../middleware/adminmiddle")

// // // const {register,login,logout,adminregister, sendOtpForRegistration, // New function
// // //     verifyOtpAndRegister,deleteprofile}=require("../controllers/userauthentication");
// // // const user = require('../models/users');


// // // // const authrouter=express.Router();
// // // authrouter.post('/send-otp-for-registration', usermiddleware,sendOtpForRegistration);
// // // authrouter.post('/verify-otp-and-register', usermiddleware,verifyOtpAndRegister);
// // // authrouter.post('/login',login);
// // // authrouter.post('/logout',usermiddleware,logout);  // logout se phle dekho ki ye token valid token hai ki nhi by using the middleware

// // // authrouter.post('/register',register);
// // // authrouter.post('/admin/register',adminmiddleware,adminregister);
// // // // authrouter.post('/admin/register',usermiddleware,adminregister);// ye bhi kr skte the without using adminmiddleware ,usermiddleware se check ho jata jate admi r egister me wha likhte agr req.ans1.role!='admin
// // // //  throw new error(err); phir bhi ho jata  req.ans1 isliye ki ans1 me admin ka sara chij hioga agr role admin nhi hua to invalid crdential btakr bhej denge


// // // // authrouter.get('/getpofile',getprofile);


// // //     authrouter.delete("/profile",adminmiddleware,deleteprofile);
// // //    authrouter.get('/check',usermiddleware,(req,res)=>{
   
// // //        const reply = {
// // //            firstname: req.ans1.firstname,
// // //            emailId: req.ans1.emailId,
// // //            id:req.ans1.id,
// // //         role:req.ans1.role

// // //        }
   
// // //        res.status(200).json({
// // //            user:reply,
// // //            message:"Valid User"
// // //        });
// // //     })


// // // module.exports=authrouter;

// // // // 1

// // // // const express = require('express');
// // // // const authrouter = express.Router();
// // // // const usermiddleware = require("../middleware/middle");
// // // // const adminmiddleware = require("../middleware/adminmiddle");
// // // // const passport = require('passport');
// // // // // Import all necessary functions from the controller
// // // // const {
// // // //     sendOtpForRegistration,
// // // //     verifyOtpAndRegister,
// // // //     forgotPasswordSendOtp,
// // // //     getUserProfileDetails,
// // // //     getSubmissionsByDate,
// // // //     updateSetting,
// // // //       getEditableProfile,
// // // //     updateProfileField,
// // // //     getUserDashboardStats,
// // // //     getNotifications,
// // // //     markNotificationsAsRead,
// // // //     resetPasswordWithOtp,
// // // //     login,
// // // //     logout,
// // // //     adminregister,
// // // //     deleteprofile
// // // // } = require("../controllers/userauthentication");
// // // // const user = require('../models/users');

// // // // // --- NEW OTP-BASED REGISTRATION ROUTES ---
// // // // // Step 1: Client sends user details, server sends back an OTP. No middleware needed.
// // // // authrouter.post('/send-otp-for-registration', sendOtpForRegistration);

// // // // // Step 2: Client sends email and OTP to finalize registration. No middleware needed.
// // // // authrouter.post('/verify-otp-and-register', verifyOtpAndRegister);

// // // // // --- OTHER AUTH ROUTES ---
// // // // authrouter.post('/login', login);
// // // // authrouter.post('/logout', usermiddleware, logout);
// // // // authrouter.post('/admin/register', adminmiddleware, adminregister);
// // // // authrouter.delete("/profile", adminmiddleware, deleteprofile);
// // // // authrouter.post('/forgot-password-send-otp', forgotPasswordSendOtp);
// // // // authrouter.post('/reset-password-with-otp', resetPasswordWithOtp);
// // // // authrouter.get('/dashboard-stats', usermiddleware, getUserDashboardStats); 
// // // // authrouter.get('/profile-details', usermiddleware, getUserProfileDetails); 
// // // // authrouter.get('/edit-profile', usermiddleware, getEditableProfile);
// // // // authrouter.patch('/edit-profile', usermiddleware, updateProfileField);
// // // // authrouter.patch('/settings', usermiddleware, updateSetting);
// // // // authrouter.get('/notifications', usermiddleware, getNotifications);
// // // // authrouter.post('/notifications/mark-read', usermiddleware, markNotificationsAsRead);
// // // // // The original '/register' route is now removed.

// // // // // Your check route is perfectly fine as is.
// // // // authrouter.get('/check', usermiddleware, (req, res) => {
// // // //     const reply = {
// // // //         firstname: req.ans1.firstname,
// // // //         emailId: req.ans1.emailId,
// // // //         id: req.ans1.id,
// // // //         role: req.ans1.role
// // // //     }
// // // //     res.status(200).json({
// // // //         user: reply,
// // // //         message: "Valid User"
// // // //     });
// // // // });
// // // // const socialAuthCallback = (req, res) => {
// // // //     if (!req.user) {
// // // //         return res.redirect('http://localhost:5173/signup?error=auth_failed');
// // // //     }
// // // //     const token = jwt.sign(
// // // //         { id: req.user._id, emailId: req.user.emailId, role: req.user.role },
// // // //         process.env.JWT_KEY, { expiresIn: '1h' }
// // // //     );
// // // //     res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

// // // //     if (!req.user.isProfileComplete) {
// // // //         return res.redirect('http://localhost:5173/signup-social');
// // // //     }
// // // //     res.redirect('http://localhost:5173/');
// // // // };

// // // // // --- Social Auth Routes ---
// // // // authrouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// // // // authrouter.get('/auth/google/callback', 
// // // //     passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }), 
// // // //     socialAuthCallback
// // // // );
// // // // authrouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// // // // authrouter.get('/auth/facebook/callback',
// // // //     passport.authenticate('facebook', { session: false, failureRedirect: 'http://localhost:5173/login' }),
// // // //     socialAuthCallback
// // // // );

// // // // // --- NEW Endpoint to complete social signup ---
// // // // authrouter.post('/complete-social-signup', usermiddleware, async (req, res) => {
// // // //     try {
// // // //         const { username } = req.body;
// // // //         const userId = req.ans1.id;

// // // //         if (!username || username.length < 3) {
// // // //             return res.status(400).json({ message: "Username must be at least 3 characters." });
// // // //         }
        
// // // //         const existingUser = await User.findOne({ username, _id: { $ne: userId } }); // Check for other users with this username
// // // //         if (existingUser) {
// // // //             return res.status(409).json({ message: "Username is already taken." });
// // // //         }
        
// // // //         const updatedUser = await User.findByIdAndUpdate(userId, {
// // // //             username,
// // // //             isProfileComplete: true
// // // //         }, { new: true }).lean();

// // // //         const token = jwt.sign({ id: updatedUser._id, emailId: updatedUser.emailId, role: updatedUser.role }, process.env.JWT_KEY, { expiresIn: '1h' });
// // // //         res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });

// // // //         res.status(200).json({ user: updatedUser });
// // // //     } catch (err) {
// // // //         console.error("Error completing social signup:", err);
// // // //         res.status(500).json({ message: "Server error" });
// // // //     }
// // // // });


// // // // // module.exports = authrouter;

// // // // const express = require('express');
// // // // const authrouter = express.Router();
// // // // const usermiddleware = require("../middleware/middle");
// // // // const adminmiddleware = require("../middleware/adminmiddle");
// // // // const passport = require('passport');
// // // // const jwt = require('jsonwebtoken');
// // // // const { sendOtpForRegistration,
// // // //     verifyOtpAndRegister,
// // // //     forgotPasswordSendOtp,
// // // //     getUserProfileDetails,
// // // //     getSubmissionsByDate,
// // // //     updateSetting,
// // // //       getEditableProfile,
// // // //     updateProfileField,
// // // //     getUserDashboardStats,
// // // //     getNotifications,
// // // //     markNotificationsAsRead,
// // // //     resetPasswordWithOtp,
// // // //     login,
// // // //     logout,
// // // //     adminregister,
// // // //     deleteprofile } = require("../controllers/userauthentication");

// // // // // --- Standard Auth Routes ---
// // // // authrouter.post('/send-otp-for-registration', sendOtpForRegistration);
// // // // authrouter.post('/verify-otp-and-register', verifyOtpAndRegister);
// // // // authrouter.post('/login', login);
// // // // authrouter.post('/logout', usermiddleware, logout);
// // // // authrouter.get('/check', usermiddleware, (req, res) => {
// // // //     const reply = {
// // // //         firstname: req.ans1.firstname,
// // // //         emailId: req.ans1.emailId,
// // // //         id: req.ans1.id,
// // // //         role: req.ans1.role
// // // //     }
// // // //     res.status(200).json({
// // // //         user: reply,
// // // //         message: "Valid User"
// // // //     });
// // // // });

// // // // // --- Social Auth Callback (used by Google, Facebook, etc.) ---
// // // // const socialAuthCallback = (req, res) => {
// // // //     if (!req.user) {
// // // //         return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
// // // //     }
// // // //     const token = jwt.sign(
// // // //         { id: req.user._id, emailId: req.user.emailId, role: req.user.role },
// // // //         process.env.JWT_KEY, { expiresIn: '1h' }
// // // //     );
// // // //     res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
// // // //     // Redirect to homepage because profile is now complete
// // // //     res.redirect(process.env.CLIENT_URL || 'http://localhost:5173/');
// // // // };

// // // // // --- Social Auth Routes ---
// // // // authrouter.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
// // // // authrouter.get('/auth/facebook/callback',
// // // //     passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
// // // //     socialAuthCallback
// // // // );

// // // // // --- Profile & Settings Routes ---
// // // // authrouter.delete("/delete-profile", adminmiddleware, deleteprofile); // This should be usermiddleware
// // // // authrouter.post('/forgot-password-send-otp', forgotPasswordSendOtp);
// // // // authrouter.post('/reset-password-with-otp', resetPasswordWithOtp);
// // // // authrouter.get('/profile-details', usermiddleware, getUserProfileDetails);
// // // // authrouter.get('/edit-profile', usermiddleware, getEditableProfile);
// // // // authrouter.patch('/edit-profile', usermiddleware, updateProfileField);
// // // // authrouter.patch('/settings', usermiddleware, updateSetting);
// // // // authrouter.get('/notifications', usermiddleware, getNotifications);
// // // // authrouter.post('/notifications/mark-read', usermiddleware, markNotificationsAsRead);

// // // // // --- Admin Routes ---
// // // // authrouter.post('/admin/register', adminmiddleware, adminregister);

// // // // module.exports = authrouter;


// // const express=require('express');
// // const authrouter=express.Router();
// // const usermiddleware=require("../middleware/middle")
// // const adminmiddleware=require("../middleware/adminmiddle")

// // const {
// //     register,
// //     login,
// //     logout,
// //     adminregister, 
// //     sendOtpForRegistration,
// //     verifyOtpAndRegister,
// //     sendOtpForPasswordReset, // NEW
// //     resetPassword,           // NEW
// //     deleteprofile            // MODIFIED
// // } = require("../controllers/userauthentication");
// // const user = require('../models/users');


// // authrouter.post('/send-otp-for-registration', usermiddleware,sendOtpForRegistration); // Ensure middleware is correct here or remove it if signup doesn't require auth
// // authrouter.post('/verify-otp-and-register', usermiddleware,verifyOtpAndRegister); // Same as above, remove middleware if it's open signup
// // authrouter.post('/login',login);
// // authrouter.post('/logout',usermiddleware,logout);

// // // You might consider removing the direct '/register' if the OTP flow is the primary signup
// // authrouter.post('/register',register); 

// // authrouter.post('/admin/register',adminmiddleware,adminregister);

// // // NEW Password Reset Routes
// // authrouter.post('/send-reset-otp', sendOtpForPasswordReset); // No auth needed for sending reset OTP
// // authrouter.post('/reset-password', resetPassword); // No auth needed for resetting password with OTP

// // // MODIFIED: User can delete their OWN profile
// // authrouter.delete("/profile", usermiddleware, deleteprofile); 

// // authrouter.get('/check',usermiddleware,(req,res)=>{
   
// //        const reply = {
// //            firstname: req.ans1.firstname,
// //            emailId: req.ans1.emailId,
// //            id:req.ans1.id,
// //            role:req.ans1.role
// //        }
   
// //        res.status(200).json({
// //            user:reply,
// //            message:"Valid User"
// //        });
// //     })


// // module.exports=authrouter;

const express=require('express');
const authrouter=express.Router();
const usermiddleware=require("../middleware/middle")
const adminmiddleware=require("../middleware/adminmiddle")

const {
    register,
    login,
    logout,
    adminregister, 
    // sendOtpForRegistration,
    // verifyOtpAndRegister,
    // sendOtpForPasswordReset,
    // resetPassword,
    deleteprofile
} = require("../controllers/userauthentication");
const user = require('../models/users');


// authrouter.post('/send-otp-for-registration', usermiddleware,sendOtpForRegistration);
// authrouter.post('/verify-otp-and-register', usermiddleware,verifyOtpAndRegister);
authrouter.post('/login',login);
authrouter.post('/logout',usermiddleware,logout);

authrouter.post('/register',register); 

authrouter.post('/admin/register',adminmiddleware,adminregister);

// // NEW Password Reset Routes
// authrouter.post('/send-reset-otp', sendOtpForPasswordReset);
// authrouter.post('/reset-password', resetPassword);

// MODIFIED: User can delete their OWN profile
authrouter.delete("/profile", usermiddleware, deleteprofile); 

authrouter.get('/check',usermiddleware,(req,res)=>{
   
       const reply = {
           firstname: req.ans1.firstname,
           emailId: req.ans1.emailId,
           id:req.ans1.id,
           role:req.ans1.role
       }
   
       res.status(200).json({
           user:reply,
           message:"Valid User"
       });
    })


module.exports=authrouter;
// const express=require('express');
// const authrouter=express.Router();
// const usermiddleware=require("../middleware/middle") // This middleware likely checks for an existing authenticated user
// const adminmiddleware=require("../middleware/adminmiddle")

// const {
//     register, // This original 'register' function will not be used by the new frontend Signup
//     login,
//     logout,
//     adminregister, 
//     // sendOtpForRegistration,
//     // verifyOtpAndRegister,
//     // sendOtpForPasswordReset,
//     // resetPassword,
//     deleteprofile
// } = require("../controllers/userauthentication");
// const user = require('../models/users');


// // REMOVED usermiddleware from signup process, as new users are not yet authenticated
// // authrouter.post('/send-otp-for-registration', sendOtpForRegistration); 
// // authrouter.post('/verify-otp-and-register', verifyOtpAndRegister);

// authrouter.post('/login',usermiddleware,login);
// authrouter.post('/logout',usermiddleware,logout); // Logout requires authentication to invalidate token

// // The original '/register' route is not used by the new frontend signup flow.
// // If you intend for OTP to be the *only* signup method, you can remove this line.
// // authrouter.post('/register',register); 

// authrouter.post('/admin/register',adminmiddleware,adminregister); // Admin registration requires admin authentication

// // NEW Password Reset Routes (do not require authentication)
// authrouter.post('/send-reset-otp', sendOtpForPasswordReset);
// authrouter.post('/reset-password', resetPassword);

// // MODIFIED: User can delete their OWN profile (requires authentication)
// authrouter.delete("/profile", usermiddleware, deleteprofile); 

// // Check Auth route (requires authentication)
// authrouter.get('/check',usermiddleware,(req,res)=>{
   
//        const reply = {
//            firstname: req.ans1.firstname,
//            emailId: req.ans1.emailId,
//            id:req.ans1.id,
//            role:req.ans1.role
//        }
   
//        res.status(200).json({
//            user:reply,
//            message:"Valid User"
//        });
//     })


// module.exports=authrouter;