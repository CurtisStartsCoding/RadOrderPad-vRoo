const Redis = require('ioredis');
const fs = require('fs');

// Redis Cloud connection details from .env.production
const redisHost = 'redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com';
const redisPort = 11584;
const redisPassword = 'zHUbspGPcewJsoT9G9TSQncuSl0v0MUH';

// Create a log file
const logFile = 'debug-scripts/redis-optimization/index-schema-results.log';
let logOutput = '';

// Function to log to both console and file
function log(message) {
  console.log(message);
  logOutput += message + '\n';
}

const client = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: {}
});

async function checkIndices() {
  try {
    // Get all indices
    const indices = await client.call('FT._LIST');
    log('Available indices: ' + JSON.stringify(indices));
    
    // Check each index schema
    for (const index of indices) {
      log(`\n=== INDEX: ${index} ===`);
      const info = await client.call('FT.INFO', index);
      
      // Extract and display key information
      const keyType = info[info.indexOf('key_type') + 1];
      log(`Key Type: ${keyType}`);
      
      // Display schema details
      const schemaIndex = info.indexOf('attributes');
      if (schemaIndex >= 0) {
        const schemaCount = info[schemaIndex + 1];
        log(`Schema has ${schemaCount} fields:`);
        
        for (let i = 0; i < schemaCount; i++) {
          const fieldInfo = info[schemaIndex + 2 + i];
          log(`  Field: ${fieldInfo[1]}, Type: ${fieldInfo[3]}, Weight: ${fieldInfo[5] || 'N/A'}`);
        }
      }
    }
  } catch (error) {
    log('Error checking indices: ' + error.message);
    console.error(error);
  } finally {
    // Write log to file
    fs.writeFileSync(logFile, logOutput);
    log(`Results written to ${logFile}`);
    client.quit();
  }
}

checkIndices();