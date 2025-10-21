
const { createClient } = require('redis');
require('dotenv').config(); 

const redisClient = createClient({
    username: 'default', 
    password: process.env.REDIS_PASS, 
    socket: {
        host: 'redis-13069.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 13069
    }
   
});


redisClient.on('connect', () => {
    console.log('Redis Client: Attempting to connect to Redis Cloud...');
});

redisClient.on('ready', () => {
    console.log('Redis Client: Successfully connected to Redis Cloud!');
});

redisClient.on('error', (err) => {
   
    console.error('Redis Client Error:', err.message);
    
});

redisClient.on('end', () => {
    console.log('Redis Client: Connection ended.');
});

redisClient.on('reconnecting', () => {
    console.log('Redis Client: Reconnecting to Redis Cloud...');
});



(async () => {
    try {
      
        if (process.env.REDIS_PASS && process.env.REDIS_PASS !== 'your_redis_password_here') {
            await redisClient.connect();
        } else {
            console.log('  Redis: Skipping connection (no valid password provided)');
            console.log(' Redis is optional for basic functionality');
        }
    } catch (err) {
        console.error(' Redis: Connection failed:', err.message);
        console.log(' Redis is optional - server will continue without it');
      
    }
})();

module.exports = redisClient;