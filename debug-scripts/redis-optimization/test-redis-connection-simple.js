/**
 * Simple Redis Connection Test
 * This script tests the connection to Redis and outputs debug information immediately
 */

// Import required modules
const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Immediately output debug information
console.log('=== Simple Redis Connection Test ===');
console.log(`Current time: ${new Date().toISOString()}`);
console.log('Environment variables:');
console.log(`REDIS_CLOUD_HOST: ${process.env.REDIS_CLOUD_HOST || 'not set'}`);
console.log(`REDIS_CLOUD_PORT: ${process.env.REDIS_CLOUD_PORT || 'not set'}`);
console.log(`REDIS_CLOUD_PASSWORD: ${process.env.REDIS_CLOUD_PASSWORD ? '[set]' : 'not set'}`);

// Set a short timeout for the entire script
const SCRIPT_TIMEOUT = 30 * 1000; // 30 seconds
console.log(`Setting script timeout: ${SCRIPT_TIMEOUT}ms`);

const scriptTimeout = setTimeout(() => {
  console.error(`Script execution timed out after ${SCRIPT_TIMEOUT/1000} seconds`);
  process.exit(1);
}, SCRIPT_TIMEOUT);

// Function to test Redis connection
async function testRedisConnection() {
  console.log('\nAttempting to connect to Redis...');
  
  try {
    // Get Redis Cloud configuration from environment variables
    const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
    const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
    
    console.log(`Redis Host: ${redisHost}`);
    console.log(`Redis Port: ${redisPort}`);
    console.log(`Redis Password: ${redisPassword ? '[set]' : 'not set'}`);
    
    // Redis Cloud connection options
    const redisOptions = {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      // Only enable TLS for Redis Cloud, not for localhost
      tls: redisHost !== 'localhost' ? {} : undefined,
      connectTimeout: 5000,
      commandTimeout: 5000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null // Disable retries
    };
    
    console.log('Creating Redis client with options:', JSON.stringify({
      ...redisOptions,
      password: redisPassword ? '[hidden]' : undefined
    }, null, 2));
    
    // Create Redis client
    const redisClient = new Redis(redisOptions);
    
    // Set up event handlers
    redisClient.on('connect', () => {
      console.log('Redis client connected');
    });
    
    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis client error:', err.message);
    });
    
    redisClient.on('close', () => {
      console.log('Redis connection closed');
    });
    
    redisClient.on('reconnecting', () => {
      console.log('Redis client reconnecting...');
    });
    
    // Test the connection with a timeout
    console.log('Sending PING command...');
    const pingPromise = redisClient.ping();
    
    // Add a timeout to the ping
    const pingWithTimeout = Promise.race([
      pingPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Redis ping timed out after 5 seconds')), 5000)
      )
    ]);
    
    // Wait for ping result
    const pingResult = await pingWithTimeout;
    console.log(`Redis ping result: ${pingResult}`);
    
    // Count keys
    console.log('Counting Redis keys...');
    const keyCount = await redisClient.dbsize();
    console.log(`Total Redis keys: ${keyCount}`);
    
    // Close Redis connection
    console.log('Closing Redis connection...');
    await redisClient.quit();
    console.log('Redis connection closed successfully');
    
    return true;
  } catch (error) {
    console.error('Error during Redis connection test:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  } finally {
    // Clear the script timeout
    clearTimeout(scriptTimeout);
  }
}

// Run the test
console.log('Starting Redis connection test...');
testRedisConnection()
  .then(success => {
    console.log(`\nTest ${success ? 'completed successfully' : 'failed'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });

// Force output to be flushed immediately
setInterval(() => {
  process.stdout.write('');
}, 100);