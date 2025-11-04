// Core Dependencies
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieparser = require("cookie-parser");

// Authentication & Security
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const crypto = require('crypto');

// Payment Gateway
const Razorpay = require('razorpay');

// Database & Caching
const { createClient } = require('redis');

// Utilities
const axios = require('axios');
const validator = require('validator');
const nodemailer = require('nodemailer');

// AI Integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Media Upload
const cloudinary = require('cloudinary').v2;

// Session Management
const session = require('express-session');

// Initialize dotenv
dotenv.config();

// Initialize Express App
const app = express();

// Database Connection
const main = require('./db');


const authrouter = require("./routes/userauth");
const userRoutes = require('./routes/userRoutes');
const problemrouter = require("./routes/probcreator");
const submitrouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const discussRouter = require("./routes/discussRoutes");
const profileRouter = require('./routes/profileRoutes'); // 
const notificationRoutes = require('./routes/notificationRoutes');
const migrationRoutes = require('./routes/migrationRoutes'); 
const paymentRoutes = require('./routes/payment'); 

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            'https://coder-world3855.vercel.app'
        ];
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        
        // Allow all Vercel preview deployments
        if (origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        
        // Allow specific origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['set-cookie']
}));

app.use(express.json());
app.use(cookieparser());
// Add after line 74 (after cookieparser middleware)
app.get('/', (req, res) => {
    res.json({
        status: 'Server is running',
        message: 'CoderWorld API',
        endpoints: {
            auth: '/user',
            problems: '/problem',
            submissions: '/submission',
            ai: '/ai',
            video: '/video',
            discuss: '/api/discuss',
            profile: '/profile',
            notifications: '/api/notifications',
            payment: '/payment'
        }
    });
});

app.use('/user', authrouter);
app.use('/user', userRoutes);
app.use('/problem', problemrouter);
app.use('/submission', submitrouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);
app.use("/api/discuss", discussRouter);
app.use("/profile", profileRouter); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/migration", migrationRoutes);
app.use("/payment", paymentRoutes); 



const initialiseConnection = async () => {
    try {
       
        await main(); 
        console.log(" Connected to MongoDB"); 
  
       
        app.listen(process.env.PORT || 5000, () => {
          console.log(" Server listening at port " + (process.env.PORT || 5000));
          console.log(" Frontend URL: http://localhost:5173");
          console.log(" Backend URL: http://localhost:" + (process.env.PORT || 5000));
        });
    } catch(err) {
      console.error(" Failed to initialize server:", err.message);
      console.log(" Make sure MongoDB is running on your system");
      console.log(" You can start MongoDB with: mongod");
      process.exit(1); 
    }
};

initialiseConnection();