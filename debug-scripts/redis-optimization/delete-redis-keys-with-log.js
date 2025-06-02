/**
 * Script to delete all Redis keys with detailed logging
 */
const Redis = require('ioredis');
const dotenv = require('dotenv');
const fs = require('fs');

// Create a log file
const logFile = 'redis-delete-keys.log';
const logStream = fs.createWriteStream(logFile, { flags: 'w' });

// Function to log to both console and file
function log(message) {
  console.log(message);
  logStream.write(message + '\n');
}

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Set a timeout for the entire script (5 minutes)
const SCRIPT_TIMEOUT = 5 * 60 * 1000;
const scriptTimeout = setTimeout(() => {
  log(`Script execution timed out after ${SCRIPT_TIMEOUT/1000} seconds`);
  process.exit(1);
}, SCRIPT_TIMEOUT);

// Initialize Redis client
async function main() {
  try {
    log('=== Redis Key Deletion Script ===');
    log(`Current time: ${new Date().toISOString()}`);
    
    // Get Redis Cloud configuration from environment variables
    const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
    const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
    
    // Redis Cloud connection options
    const redisOptions = {
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      // Only enable TLS for Redis Cloud, not for localhost
      tls: redisHost !== 'localhost' ? {} : undefined,
      connectTimeout: 5000,
      commandTimeout: 5000
    };
    
    log(`Redis Host: ${redisHost}`);
    log(`Redis Port: ${redisPort}`);
    log(`Redis Password: ${redisPassword ? '[set]' : 'not set'}`);
    
    log('Creating Redis client...');
    const redisClient = new Redis(redisOptions);
    
    // Set up event handlers
    redisClient.on('connect', () => {
      log('Redis client connected');
    });
    
    redisClient.on('ready', () => {
      log('Redis client ready');
    });
    
    redisClient.on('error', (err) => {
      log(`Redis client error: ${err.message}`);
    });
    
    // Test the connection
    log('Testing connection with PING...');
    const pingResult = await redisClient.ping();
    log(`Redis ping result: ${pingResult}`);
    
    // Count total keys
    log('Counting total Redis keys...');
    const totalKeys = await redisClient.dbsize();
    log(`Total Redis keys: ${totalKeys}`);
    
    // Count keys by type
    log('\nCounting keys by type...');
    
    // Old patterns
    const oldCptKeys = await redisClient.keys('cpt:code:*');
    const oldIcd10Keys = await redisClient.keys('icd10:code:*');
    const oldMappingKeys = await redisClient.keys('mapping:icd10-to-cpt:*');
    
    // New patterns
    const newCptKeys = await redisClient.keys('cpt:*');
    const newIcd10Keys = await redisClient.keys('icd10:*');
    const newMappingKeys = await redisClient.keys('mapping:*');
    const markdownKeys = await redisClient.keys('markdown:*');
    
    // Filter out old keys from new keys to avoid duplicates
    const filteredCptKeys = newCptKeys.filter(key => !oldCptKeys.includes(key));
    const filteredIcd10Keys = newIcd10Keys.filter(key => !oldIcd10Keys.includes(key));
    const filteredMappingKeys = newMappingKeys.filter(key => !oldMappingKeys.includes(key));
    
    log(`Old CPT keys: ${oldCptKeys.length}`);
    log(`Old ICD-10 keys: ${oldIcd10Keys.length}`);
    log(`Old mapping keys: ${oldMappingKeys.length}`);
    log(`New CPT keys (excluding old): ${filteredCptKeys.length}`);
    log(`New ICD-10 keys (excluding old): ${filteredIcd10Keys.length}`);
    log(`New mapping keys (excluding old): ${filteredMappingKeys.length}`);
    log(`Markdown keys: ${markdownKeys.length}`);
    
    // Ask for confirmation before deleting
    log('\nReady to delete all Redis keys.');
    log('Proceeding with deletion...');
    
    // Delete keys in batches
    const deleteKeysBatch = async (keys, name) => {
      if (keys.length === 0) {
        log(`No ${name} keys to delete`);
        return;
      }
      
      log(`Deleting ${keys.length} ${name} keys...`);
      
      // Delete in batches of 1000
      for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000);
        await redisClient.del(...batch);
        log(`  Deleted batch ${Math.floor(i / 1000) + 1}/${Math.ceil(keys.length / 1000)}`);
      }
    };
    
    // Delete all key types
    await deleteKeysBatch(oldCptKeys, 'old CPT');
    await deleteKeysBatch(oldIcd10Keys, 'old ICD-10');
    await deleteKeysBatch(oldMappingKeys, 'old mapping');
    await deleteKeysBatch(filteredCptKeys, 'new CPT');
    await deleteKeysBatch(filteredIcd10Keys, 'new ICD-10');
    await deleteKeysBatch(filteredMappingKeys, 'new mapping');
    await deleteKeysBatch(markdownKeys, 'markdown');
    
    // Verify deletion
    log('\nVerifying deletion...');
    const remainingKeys = await redisClient.keys('*');
    log(`Remaining keys after deletion: ${remainingKeys.length}`);
    
    if (remainingKeys.length > 0) {
      log('Warning: Some keys could not be deleted. Remaining keys:');
      log(remainingKeys.slice(0, 10).join('\n'));
      if (remainingKeys.length > 10) {
        log(`... and ${remainingKeys.length - 10} more`);
      }
    } else {
      log('All keys successfully deleted from Redis');
    }
    
    // Close Redis connection
    log('\nClosing Redis connection...');
    await redisClient.quit();
    log('Redis connection closed');
    
    // Clear the script timeout
    clearTimeout(scriptTimeout);
    
    log('\nScript completed successfully');
    
  } catch (error) {
    log(`Error: ${error.message}`);
    log(`Stack trace: ${error.stack}`);
    
    // Clear the script timeout
    clearTimeout(scriptTimeout);
    
    process.exit(1);
  }
}

// Run the main function
log('Starting Redis key deletion script...');
main().catch(err => {
  log(`Unhandled error: ${err.message}`);
  log(`Stack trace: ${err.stack}`);
  process.exit(1);
});