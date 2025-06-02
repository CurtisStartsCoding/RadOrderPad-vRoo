/**
 * Script to delete all Redis keys
 */
const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Initialize Redis client
async function main() {
  try {
    console.log('Initializing Redis client...');
    
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
    
    console.log(`Redis Host: ${redisHost}`);
    console.log(`Redis Port: ${redisPort}`);
    
    const redisClient = new Redis(redisOptions);
    
    // Test the connection
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Count keys by type before deletion
    const allKeys = await redisClient.keys('*');
    const cptKeys = await redisClient.keys('cpt:*');
    const icd10Keys = await redisClient.keys('icd10:*');
    const mappingKeys = await redisClient.keys('mapping:*');
    const markdownKeys = await redisClient.keys('markdown:*');
    
    console.log('\nCurrent Redis key counts before deletion:');
    console.log(`Total keys: ${allKeys.length}`);
    console.log(`CPT keys: ${cptKeys.length}`);
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    console.log(`Mapping keys: ${mappingKeys.length}`);
    console.log(`Markdown keys: ${markdownKeys.length}`);
    
    // Delete keys in batches
    console.log('\nDeleting Redis keys...');
    
    const deleteKeysBatch = async (keys, name) => {
      if (keys.length === 0) {
        console.log(`No ${name} keys to delete`);
        return;
      }
      
      console.log(`Deleting ${keys.length} ${name} keys...`);
      
      // Delete in batches of 1000
      for (let i = 0; i < keys.length; i += 1000) {
        const batch = keys.slice(i, i + 1000);
        await redisClient.del(...batch);
        console.log(`  Deleted batch ${Math.floor(i / 1000) + 1}/${Math.ceil(keys.length / 1000)}`);
      }
    };
    
    await deleteKeysBatch(cptKeys, 'CPT');
    await deleteKeysBatch(icd10Keys, 'ICD-10');
    await deleteKeysBatch(mappingKeys, 'mapping');
    await deleteKeysBatch(markdownKeys, 'markdown');
    
    // Verify deletion
    const remainingKeys = await redisClient.keys('*');
    console.log(`\nRemaining keys after deletion: ${remainingKeys.length}`);
    
    if (remainingKeys.length > 0) {
      console.log('Warning: Some keys could not be deleted. Remaining keys:');
      console.log(remainingKeys.slice(0, 10));
      if (remainingKeys.length > 10) {
        console.log(`... and ${remainingKeys.length - 10} more`);
      }
    } else {
      console.log('All keys successfully deleted from Redis');
    }
    
    // Close Redis connection
    await redisClient.quit();
    console.log('Redis connection closed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();