/**
 * Test script for connect-redis v8.0.3 integration
 * 
 * This script tests different approaches to using connect-redis v8.0.3
 * with express-session to identify the correct pattern.
 */

// Import required modules
const express = require('express');
const session = require('express-session');
const redis = require('redis');

console.log('Testing connect-redis v8.0.3 integration');

// Create Express app
const app = express();

// Skip Redis connection for now and just test the module imports
console.log('Skipping Redis connection, just testing module imports');

// Create a mock Redis client
const redisClient = {
  connect: () => {},
  disconnect: () => {},
};

// Test different approaches to using connect-redis
(async () => {
  try {
    
    // Approach 1: Using require with .default
    try {
      console.log('\nApproach 1: Using require with .default');
      const RedisStore1 = require('connect-redis').default;
      console.log('RedisStore1 type:', typeof RedisStore1);
      console.log('RedisStore1 constructor?', typeof RedisStore1 === 'function');
      
      if (typeof RedisStore1 === 'function') {
        const store1 = new RedisStore1({ client: redisClient });
        console.log('Store1 created successfully');
      } else {
        console.log('RedisStore1 is not a constructor');
        console.log('RedisStore1 properties:', Object.keys(RedisStore1));
      }
    } catch (error) {
      console.error('Approach 1 error:', error.message);
    }
    
    // Approach 2: Using require with factory pattern
    try {
      console.log('\nApproach 2: Using require with factory pattern');
      const connectRedis2 = require('connect-redis');
      console.log('connectRedis2 type:', typeof connectRedis2);
      console.log('connectRedis2 function?', typeof connectRedis2 === 'function');
      
      if (typeof connectRedis2 === 'function') {
        const RedisStore2 = connectRedis2(session);
        console.log('RedisStore2 type:', typeof RedisStore2);
        console.log('RedisStore2 constructor?', typeof RedisStore2 === 'function');
        
        if (typeof RedisStore2 === 'function') {
          const store2 = new RedisStore2({ client: redisClient });
          console.log('Store2 created successfully');
        } else {
          console.log('RedisStore2 is not a constructor');
        }
      } else {
        console.log('connectRedis2 is not a function');
        console.log('connectRedis2 properties:', Object.keys(connectRedis2));
      }
    } catch (error) {
      console.error('Approach 2 error:', error.message);
    }
    
    // Approach 3: Using require with destructuring
    try {
      console.log('\nApproach 3: Using require with destructuring');
      const { RedisStore: RedisStore3 } = require('connect-redis');
      console.log('RedisStore3 type:', typeof RedisStore3);
      console.log('RedisStore3 constructor?', typeof RedisStore3 === 'function');
      
      if (typeof RedisStore3 === 'function') {
        const store3 = new RedisStore3({ client: redisClient });
        console.log('Store3 created successfully');
      } else {
        console.log('RedisStore3 is not a constructor');
      }
    } catch (error) {
      console.error('Approach 3 error:', error.message);
    }
    
    // Approach 4: Using require with default property
    try {
      console.log('\nApproach 4: Using require with default property');
      const connectRedis4 = require('connect-redis');
      const RedisStore4 = connectRedis4.default;
      console.log('RedisStore4 type:', typeof RedisStore4);
      console.log('RedisStore4 constructor?', typeof RedisStore4 === 'function');
      
      if (typeof RedisStore4 === 'function') {
        const store4 = new RedisStore4({ client: redisClient });
        console.log('Store4 created successfully');
      } else {
        console.log('RedisStore4 is not a constructor');
      }
    } catch (error) {
      console.error('Approach 4 error:', error.message);
    }
    
    // Approach 5: Using require with createClient
    try {
      console.log('\nApproach 5: Using require with createClient');
      const RedisStore5 = require('connect-redis').default;
      console.log('RedisStore5 type:', typeof RedisStore5);
      
      if (typeof RedisStore5 === 'function') {
        const store5 = new RedisStore5({
          client: redisClient,
          prefix: "test:",
        });
        console.log('Store5 created successfully');
      } else {
        console.log('RedisStore5 is not a constructor');
      }
    } catch (error) {
      console.error('Approach 5 error:', error.message);
    }
    
    // Approach 6: Using dynamic import
    try {
      console.log('\nApproach 6: Using dynamic import');
      import('connect-redis').then((connectRedisModule) => {
        console.log('connectRedisModule type:', typeof connectRedisModule);
        console.log('connectRedisModule properties:', Object.keys(connectRedisModule));
        
        const RedisStore6 = connectRedisModule.default;
        console.log('RedisStore6 type:', typeof RedisStore6);
        
        if (typeof RedisStore6 === 'function') {
          const store6 = new RedisStore6({ client: redisClient });
          console.log('Store6 created successfully');
        } else {
          console.log('RedisStore6 is not a constructor');
        }
      }).catch((error) => {
        console.error('Dynamic import error:', error.message);
      });
    } catch (error) {
      console.error('Approach 6 error:', error.message);
    }
    
    // No need to disconnect since we're not connecting
    console.log('\nTest completed');
    process.exit(0);
    
  } catch (error) {
    console.error('Test error:', error.message);
    process.exit(1);
  }
})();