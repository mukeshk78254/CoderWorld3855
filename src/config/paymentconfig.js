const razorpay = require("razorpay");
const dotenv = require("dotenv");
const razorpayInstance = () =>{
    return new razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});
}