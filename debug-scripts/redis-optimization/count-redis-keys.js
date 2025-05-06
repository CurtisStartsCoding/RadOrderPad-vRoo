/**
 * Script to count Redis keys by type
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
    };
    
    const redisClient = new Redis(redisOptions);
    
    // Test the connection
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Count total keys
    const allKeys = await redisClient.keys('*');
    console.log(`Total Redis keys: ${allKeys.length}`);
    
    // Count keys by type
    const icd10Keys = await redisClient.keys('icd10:*');
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    
    const cptKeys = await redisClient.keys('cpt:*');
    console.log(`CPT keys: ${cptKeys.length}`);
    
    const mappingKeys = await redisClient.keys('mapping:*');
    console.log(`Mapping keys: ${mappingKeys.length}`);
    
    const markdownKeys = await redisClient.keys('markdown:*');
    console.log(`Markdown keys: ${markdownKeys.length}`);
    
    // List some example keys
    if (icd10Keys.length > 0) {
      console.log('\nExample ICD-10 keys:');
      for (let i = 0; i < Math.min(5, icd10Keys.length); i++) {
        console.log(`- ${icd10Keys[i]}`);
      }
    }
    
    if (cptKeys.length > 0) {
      console.log('\nExample CPT keys:');
      for (let i = 0; i < Math.min(5, cptKeys.length); i++) {
        console.log(`- ${cptKeys[i]}`);
      }
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