/**
 * Redis Cloud Connection Test Script
 * 
 * This script tests the connection to Redis Cloud and provides guidance
 * on how to update the IP allowlist if needed.
 * 
 * Usage:
 * ```
 * node scripts/test-redis-connection.js
 * ```
 */

import { testRedisConnection } from '../dist/config/redis.js';
import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

/**
 * Get the current public IP address
 * @returns {Promise<string>} The current public IP address
 */
async function getCurrentIpAddress() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting current IP address:', error.message);
    return 'unknown';
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Redis Cloud Connection Test');
  console.log('==========================\n');
  
  // Get current IP address
  const currentIp = await getCurrentIpAddress();
  console.log(`Current public IP address: ${currentIp}`);
  
  // Test Redis connection
  console.log('\nTesting Redis Cloud connection...');
  const connectionSuccessful = await testRedisConnection();
  
  if (connectionSuccessful) {
    console.log('\n✅ Connection successful!');
    console.log('Redis Cloud connection is working properly.');
  } else {
    console.log('\n❌ Connection failed!');
    console.log('Redis Cloud connection could not be established.');
    
    console.log('\nPossible reasons:');
    console.log('1. Your IP address is not in the allowlist');
    console.log('2. Redis Cloud credentials are incorrect');
    console.log('3. Redis Cloud instance is not running');
    
    console.log('\nIP Allowlist Information:');
    console.log('- Currently only 3.135.76.53 is allowed to connect');
    console.log(`- Your current IP address (${currentIp}) needs to be added to the allowlist`);
    
    if (currentIp === '69.138.136.57') {
      console.log('\n✅ Your IP address matches the expected IP: 69.138.136.57');
    } else {
      console.log('\n⚠️ Your IP address is different from the expected IP (69.138.136.57)');
      console.log('This might be because you\'re connecting from a different network or using a VPN.');
    }
    
    console.log('\nTo update the IP allowlist:');
    console.log('1. Log in to the Redis Cloud console');
    console.log('2. Navigate to your database');
    console.log('3. Go to the "Security" tab');
    console.log('4. Under "CIDR allow list", add your IP address');
    console.log('5. Click "Save"');
    
    console.log('\nFor more information, see Docs/implementation/redis-cloud-integration.md');
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});