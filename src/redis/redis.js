// const redis= require('redis');
// const redisclient=redis.createClient({
//     username: 'default',

//     password:  process.env.REDIS_PASS  ,
//       socket: {
//          host: 'redis-12572.crce206.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 12572
//     }
// });
// // const connectredis=async()=>{
// //     await redisclient.connect();
// //     console.log("connected to redis");
// // }
// // connectredis();

// module.exports=redisclient;

const { createClient } = require('redis');
require('dotenv').config(); // Ensure dotenv is loaded to access process.env.REDIS_PASS

const redisClient = createClient({
    username: 'default', // Your Redis Cloud username
    password: process.env.REDIS_PASS, // Your Redis Cloud password from .env
    socket: {
        host: 'redis-13069.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 13069
    }
    // Optional: Add a connection timeout for cloud instances
    // connectTimeout: 10000 // 10 seconds timeout for initial connection
});

// --- CRUCIAL: Add event listeners for connection status ---
redisClient.on('connect', () => {
    console.log('Redis Client: Attempting to connect to Redis Cloud...');
});

redisClient.on('ready', () => {
    console.log('Redis Client: Successfully connected to Redis Cloud!');
});

redisClient.on('error', (err) => {
    // This will catch "The client is closed" and other connection errors
    console.error('Redis Client Error:', err.message);
    // You might want to implement more sophisticated error handling here,
    // like notifying an administrator or attempting a reconnect.
});

redisClient.on('end', () => {
    console.log('Redis Client: Connection ended.');
});

redisClient.on('reconnecting', () => {
    console.log('Redis Client: Reconnecting to Redis Cloud...');
});


// --- CRUCIAL: Explicitly connect the client ---
// This immediately tries to connect when the module is loaded (required)
// ensuring the client is ready before it's used elsewhere.
(async () => {
    try {
        // Only try to connect if Redis password is provided
        if (process.env.REDIS_PASS && process.env.REDIS_PASS !== 'your_redis_password_here') {
            await redisClient.connect();
        } else {
            console.log('⚠️  Redis: Skipping connection (no valid password provided)');
            console.log('💡 Redis is optional for basic functionality');
        }
    } catch (err) {
        console.error('❌ Redis: Connection failed:', err.message);
        console.log('💡 Redis is optional - server will continue without it');
        // Don't exit the process - Redis is optional
    }
})();

module.exports = redisClient;