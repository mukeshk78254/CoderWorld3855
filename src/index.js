// const express= require('express');
// const app=express();
// require("dotenv").config(); 
// const main=require('./db')
// const cookieparser=require("cookie-parser");
// const authrouter=require("./routes/userauth")
// const redisclient=require("./redis/redis");
// const problemrouter = require("./routes/probcreator");
// const submitrouter = require("./routes/submit");
// const aiRouter = require("./routes/aiChatting")
// const videoRouter = require("./routes/videoCreator");

// const cors=require('cors');
// // isse btan padega ki kaun se location ko kewal access de rhe hai it protect from cors policy
// app.use(cors({
//     origin: 'http://localhost:5174',
//     credentials: true 
// }))



// app.use(express.json());
// app.use(cookieparser());
// app.use('/user',authrouter);
// app.use('/problem',problemrouter);
// app.use('/submission',submitrouter);
// app.use('/ai',aiRouter);
// app.use("/video",videoRouter);





// const initiliseconnection=async()=>{
//     try{
     
        
//         await Promise.all([redisclient.connect(),main()]);
//         console.log("connected to db"); 
  
//         app.listen(process.env.PORT,()=>{
//           console.log("listening at port no " + process.env.PORT);
//       })
    
  
//     }
    
//     catch(err){
//       console.log("error"+err.message);
//     }
//   }
//   initiliseconnection();

// // // 1

// // const express = require('express');
// // const app = express();
// // require("dotenv").config();
// // const main = require('./db'); // Assuming this connects to MongoDB
// // const cookieparser = require("cookie-parser");
// // const authrouter = require("./routes/userauth");
// // const redisclient = require("./redis/redis");
// // const problemrouter = require("./routes/probcreator");
// // const submitrouter = require("./routes/submit");
// // const aiRouter = require("./routes/aiChatting");
// // const videoRouter = require("./routes/videoCreator");
// // // Import the new router
// // const discussRoutes = require('./routes/discussRoutes');

// // // ... app.use(express.json()), etc.

// // app.use('/api/discuss', discussRoutes);

// // // ... (app.use for your other routers)


// // const cors = require('cors');

// // // Your CORS setup is correct
// // app.use(cors({
// //     origin: 'http://localhost:5173', // Your frontend URL
// //     credentials: true
// // }));

// // app.use(express.json());
// // app.use(cookieparser());
// // app.use('/user', authrouter);
// // app.use('/problem', problemrouter);
// // app.use('/submission', submitrouter);
// // app.use('/ai', aiRouter);
// // app.use("/video", videoRouter);

// // const initiliseconnection = async () => {
// //     try {
// //         await Promise.all([redisclient.connect(), main()]);
// //         console.log("Connected to Redis and DB");

// //         app.listen(process.env.PORT, () => {
// //             console.log("Listening at port no " + process.env.PORT);
// //         });

// //     }
// //     catch (err) {
// //         console.log("Connection error: " + err.message);
// //     }
// // }

// // initiliseconnection();

// // const express = require('express');
// // const app = express();
// // require("dotenv").config(); 
// // const main = require('./db');
// // const cookieparser = require("cookie-parser");
// // const cors = require('cors');
// // const session = require('express-session'); // <-- ADD THIS
// // const passport = require('passport');     // <-- ADD THIS
// // require('./config/passport');             // <-- ADD THIS to run the config

// // const authrouter = require("./routes/userauth");
// // const redisclient = require("./redis/redis");
// // const problemrouter = require("./routes/probcreator");
// // const submitrouter = require("./routes/submit");
// // const aiRouter = require("./routes/aiChatting");
// // const videoRouter = require("./routes/videoCreator");

// // app.use(cors({
// //     origin: process.env.CLIENT_URL || 'http://localhost:5173',
// //     credentials: true 
// // }));

// // app.use(express.json());
// // app.use(cookieparser());

// // // --- ADD PASSPORT & SESSION MIDDLEWARE ---
// // app.use(session({
// //     secret: process.env.JWT_KEY, // Use a strong secret
// //     resave: false,
// //     saveUninitialized: false
// // }));
// // app.use(passport.initialize());
// // // ----------------------------------------

// // app.use('/user', authrouter);
// // app.use('/problem', problemrouter);
// // app.use('/submission', submitrouter);
// // app.use('/ai', aiRouter);
// // app.use("/video", videoRouter);

// // const initiliseconnection = async () => {
// //     try {
// //         await Promise.all([redisclient.connect(), main()]);
// //         console.log("Connected to DB and Redis"); 
// //         app.listen(process.env.PORT || 3000, () => {
// //           console.log("Listening at port no " + (process.env.PORT || 3000));
// //         });
// //     } catch(err) {
// //       console.log("error"+err.message);
// //     }
// // };

// // initiliseconnection();



//simple 
const express = require('express');
const app = express();
require("dotenv").config(); 
const main = require('./db');
const cookieparser = require("cookie-parser");
const cors = require('cors');

// Import Routers
const authrouter = require("./routes/userauth");
const problemrouter = require("./routes/probcreator");
const submitrouter = require("./routes/submit");
const aiRouter = require("./routes/aiChatting");
const videoRouter = require("./routes/videoCreator");
const discussRouter = require("./routes/discussRoutes");
const profileRouter = require('./routes/profileRoutes'); // 
// const authRouter = require('./routes/'); // Assuming you have this
// const profileRouter = require('./routes/profileRoutes'); // Your new profile router
// CORS Configuration
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true 
}));

// Middlewares
app.use(express.json());
app.use(cookieparser());

// API Routes
app.use('/user', authrouter);
app.use('/problem', problemrouter);
app.use('/submission', submitrouter);
app.use('/ai', aiRouter);
app.use("/video", videoRouter);
app.use("/api/discuss", discussRouter);
app.use("/profile", profileRouter); 


// ...
// app.use('/auth', authRouter); // Or whatever prefix you use for auth routes
// app.use('/api', profileRouter); // Using /api for profile routes
// 
// Initialize Connections and Start Server
const initialiseConnection = async () => {
    try {
        await main(); // Connect to MongoDB
        console.log("Connected to DB"); 
  
        app.listen(process.env.PORT || 5000, () => {
          console.log("Server listening at port no " + (process.env.PORT || 5000));
        });
    } catch(err) {
      console.error("Failed to initialize server:", err.message);
      process.exit(1); // Exit process with failure
    }
};

initialiseConnection();