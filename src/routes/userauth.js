

const express=require('express');
const authrouter=express.Router();
const usermiddleware=require("../middleware/middle")
const adminmiddleware=require("../middleware/adminmiddle")

const {
    register,
    login,
    logout,
    adminregister, 
    sendOtpForRegistration,
    verifyOtpAndRegister,
    resendOtpForRegistration,
    
    deleteprofile,
    sendOtpForPasswordReset,
    resetPassword,
  
    googleOAuthCallback,
    facebookOAuthCallback,
    socialLogin
} = require("../controllers/userauthentication");
const user = require('../models/users');


authrouter.post('/send-otp-for-registration', sendOtpForRegistration);
authrouter.post('/verify-otp-and-register', verifyOtpAndRegister);
authrouter.post('/resend-otp-for-registration', resendOtpForRegistration);
authrouter.post('/login',login);
authrouter.post('/logout',usermiddleware,logout);

authrouter.post('/register',register); 

authrouter.post('/admin/register',adminmiddleware,adminregister);


authrouter.post('/send-reset-otp', sendOtpForPasswordReset);
authrouter.post('/change-password', resetPassword);


authrouter.delete("/profile", usermiddleware, deleteprofile); 

authrouter.get('/check',usermiddleware,(req,res)=>{
   
       const reply = {
           firstname: req.ans1.firstname,
           emailId: req.ans1.emailId,
           id:req.ans1.id,
           role:req.ans1.role,
         
           isPremium: req.ans1.isPremium || false,
           subscriptionType: req.ans1.subscriptionType || null,
           subscriptionStartDate: req.ans1.subscriptionStartDate || null,
           subscriptionEndDate: req.ans1.subscriptionEndDate || null,
           paymentId: req.ans1.paymentId || null,
           orderId: req.ans1.orderId || null
       }
   
       res.status(200).json({
           user:reply,
           message:"Valid User"
       });
   });

authrouter.get('/auth/google', (req, res) => {
    const googleRedirect = process.env.GOOGLE_REDIRECT_URI || `http://localhost:${process.env.PORT || 5000}/user/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(googleRedirect)}&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
        `access_type=offline&` +
        `prompt=consent`;
    console.log('[OAuth][Google] Redirecting to:', googleAuthUrl);
    
    res.redirect(googleAuthUrl);
});

authrouter.get('/auth/facebook', (req, res) => {
    const facebookRedirect = process.env.FACEBOOK_REDIRECT_URI || `http://localhost:${process.env.PORT || 5000}/user/auth/facebook/callback`;
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(facebookRedirect)}&` +
        `response_type=code&` +
        `scope=email,public_profile`;
    
    res.redirect(facebookAuthUrl);
});

authrouter.get('/auth/github', (req, res) => {
    const githubRedirect = process.env.GITHUB_REDIRECT_URI || `http://localhost:${process.env.PORT || 5000}/user/auth/github/callback`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
        `client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(githubRedirect)}&` +
        `scope=user:email&` +
        `state=${Math.random().toString(36).substring(7)}`;
    
    res.redirect(githubAuthUrl);
});

authrouter.get('/auth/google/callback', googleOAuthCallback);
authrouter.get('/auth/facebook/callback', facebookOAuthCallback);
authrouter.get('/auth/github/callback', socialLogin);

module.exports=authrouter;
