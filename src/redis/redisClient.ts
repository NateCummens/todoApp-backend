const redis = require("redis");

const client = redis.createClient({
    socket:{
        host: 'redis-cache',
        port: 6379
    }
  
  });
  
  (async () => {
    try {
        await client.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
  })();

  module.exports = client;