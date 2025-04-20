/**
 * Basic Redis test script
 * 
 * This script tests the basic functionality of the Redis client.
 * It doesn't rely on importing the compiled TypeScript files.
 * 
 * Usage:
 * ```
 * node tests/test-redis-basic.js
 * ```
 */

import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get MemoryDB configuration from environment variables
const memoryDbHost = process.env.MEMORYDB_HOST || 'localhost';
const memoryDbPort = parseInt(process.env.MEMORYDB_PORT || '6379');
const memoryDbUser = process.env.MEMORYDB_USER;
const memoryDbPassword = process.env.MEMORYDB_PASSWORD;
// Enable TLS only when connecting directly to AWS MemoryDB (not through SSM tunnel)
const isLocalhost = memoryDbHost === 'localhost' || memoryDbHost === '127.0.0.1';
const memoryDbTls = isLocalhost ? false : {};

// Create Redis client
const client = new Redis({
  host: memoryDbHost,
  port: memoryDbPort,
  username: memoryDbUser,
  password: memoryDbPassword,
  tls: memoryDbTls,
  connectionName: 'test-redis-client'
});

// Set up event handlers with more detailed logging
client.on('error', (err) => {
  console.log('Redis Client Error', err);
  console.log('Connection details:', {
    host: memoryDbHost,
    port: memoryDbPort,
    tls: 'enabled' // TLS is enabled
  });
});
client.on('connect', () => console.log('Redis client connected successfully'));
client.on('ready', () => console.log('Redis client ready'));
client.on('reconnecting', (params) => console.log('Redis client reconnecting', params));
client.on('end', () => console.log('Redis client connection ended'));

async function runTest() {
  try {
    console.log('Starting basic Redis test...');
    console.log('Connection details:', {
      host: memoryDbHost,
      port: memoryDbPort,
      tls: 'enabled' // TLS is enabled
    });
    
    // No need to explicitly connect with ioredis, it connects automatically
    console.log('Checking connection to Redis...');
    
    // Set a timeout for the ping operation using Promise.race
    const pingPromise = client.ping();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout after 5 seconds')), 5000);
    });
    
    try {
      // Race the ping operation against the timeout
      const result = await Promise.race([pingPromise, timeoutPromise]);
      console.log('Successfully connected to Redis and executed PING command');
      console.log('PING result:', result);
    } catch (connError) {
      console.error('Connection test failed:', connError.message);
      throw new Error(`Redis connection test failed: ${connError.message}`);
    }
    
    // Test basic operations
    console.log('\n--- Testing basic Redis operations ---');
    
    // Set a value
    await client.set('test-key', 'test-value');
    console.log('Set test-key to test-value');
    
    // Get the value
    const value = await client.get('test-key');
    console.log('Got test-key:', value);
    
    // Delete the value
    await client.del('test-key');
    console.log('Deleted test-key');
    
    // Test JSON operations
    console.log('\n--- Testing JSON operations ---');
    
    // Set a JSON value
    const testData = {
      id: 1,
      name: 'Test',
      tags: ['tag1', 'tag2']
    };
    
    await client.set('test-json', JSON.stringify(testData));
    console.log('Set test-json to', testData);
    
    // Get the JSON value
    const jsonValue = await client.get('test-json');
    console.log('Got test-json:', JSON.parse(jsonValue));
    
    // Delete the JSON value
    await client.del('test-json');
    console.log('Deleted test-json');
    
    console.log('\nBasic Redis test completed successfully!');
  } catch (error) {
    console.error('Error in basic Redis test:', error);
  } finally {
    // Close the Redis connection
    await client.quit();
    console.log('Redis connection closed');
  }
}

// Run the test
runTest();