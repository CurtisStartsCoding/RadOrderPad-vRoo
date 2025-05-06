/**
 * Script to populate Redis with ALL data from PostgreSQL
 * 
 * This script uses the updated Redis connection code that works with the current Redis Cloud setup.
 */
const Redis = require('ioredis');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables from .env.production
dotenv.config({ path: '.env.production' });

// Set NODE_ENV to production to use the production database connection strings
process.env.NODE_ENV = 'production';

// Get Redis configuration from environment variables
const redisHost = process.env.REDIS_CLOUD_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_CLOUD_PORT || '6379');
const redisPassword = process.env.REDIS_CLOUD_PASSWORD;
// Enable TLS for Redis Cloud
const redisTls = redisHost !== 'localhost' ? {} : undefined;

console.log('Redis connection details:');
console.log(`Host: ${redisHost}`);
console.log(`Port: ${redisPort}`);
console.log(`TLS: ${redisTls ? 'Enabled' : 'Disabled'}`);

// Create Redis client with the connection settings that work
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  tls: redisTls,
  connectionName: 'redis-populate-full',
  connectTimeout: 10000, // 10 seconds timeout
  retryStrategy: (times) => {
    console.log(`Redis connection retry attempt ${times}`);
    if (times > 3) {
      console.log('Maximum retry attempts reached, giving up');
      return null; // Stop retrying
    }
    return Math.min(times * 1000, 3000); // Retry with increasing delay, max 3 seconds
  }
});

// Set up event handlers
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  console.error('Connection details:', {
    host: redisHost,
    port: redisPort,
    tls: redisTls ? 'enabled' : 'disabled'
  });
});

redisClient.on('connect', () => console.log('Redis client connected successfully'));
redisClient.on('ready', () => console.log('Redis client ready'));

// Create PostgreSQL connection pool directly using the public connection string
const pgPool = new Pool({
  connectionString: 'postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main',
  ssl: { rejectUnauthorized: false }
});

// Set up event handlers for PostgreSQL
pgPool.on('error', (err) => {
  console.error('PostgreSQL Client Error:', err);
});

/**
 * Query the PostgreSQL database
 * @param {string} query - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} - Query result
 */
async function queryDb(query, params = []) {
  const client = await pgPool.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}

/**
 * Cache data in Redis using JSON
 * @param {string} key - Redis key
 * @param {object} data - Data to cache
 * @param {number} ttl - Time to live in seconds (0 for no expiration)
 */
async function cacheDataWithRedisJson(key, data, ttl = 3600) {
  try {
    // Store as a hash
    const pipeline = redisClient.pipeline();
    
    // Convert object to hash entries
    for (const [field, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        pipeline.hset(key, field, typeof value === 'object' ? JSON.stringify(value) : value.toString());
      }
    }
    
    // Set expiration if ttl > 0
    if (ttl > 0) {
      pipeline.expire(key, ttl);
    }
    
    await pipeline.exec();
  } catch (error) {
    console.error(`Error caching data for key ${key}:`, error);
    throw error;
  }
}

/**
 * Close Redis connection
 */
async function closeRedisConnection() {
  try {
    console.log('Closing Redis connection...');
    await redisClient.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
  }
}

/**
 * Close PostgreSQL connection
 */
async function closePgConnection() {
  try {
    console.log('Closing PostgreSQL connection...');
    await pgPool.end();
    console.log('PostgreSQL connection closed');
  } catch (error) {
    console.error('Error closing PostgreSQL connection:', error);
  }
}

/**
 * Populate Redis with all data from PostgreSQL
 */
async function populateRedisFull() {
  try {
    console.log('Populating Redis with ALL data from PostgreSQL...');
    
    // Check if Redis is connected
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Test PostgreSQL connection
    console.log('Testing PostgreSQL connection...');
    const testResult = await queryDb('SELECT 1 as test');
    console.log('PostgreSQL connection successful:', testResult.rows[0].test);
    
    // Get CPT codes from PostgreSQL (no limit)
    console.log('Getting ALL CPT codes from PostgreSQL...');
    const cptResult = await queryDb('SELECT * FROM medical_cpt_codes');
    console.log(`Found ${cptResult.rows.length} CPT codes`);
    
    // Store CPT codes in Redis
    console.log('Storing CPT codes in Redis...');
    let cptCount = 0;
    for (const row of cptResult.rows) {
      const key = `cpt:${row.cpt_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      cptCount++;
      if (cptCount % 100 === 0) {
        console.log(`Stored ${cptCount} CPT codes so far...`);
      }
    }
    console.log(`Completed storing ${cptCount} CPT codes in Redis`);
    
    // Get ICD-10 codes from PostgreSQL (no limit)
    console.log('Getting ALL ICD-10 codes from PostgreSQL...');
    const icd10Result = await queryDb('SELECT * FROM medical_icd10_codes');
    console.log(`Found ${icd10Result.rows.length} ICD-10 codes`);
    
    // Store ICD-10 codes in Redis
    console.log('Storing ICD-10 codes in Redis...');
    let icd10Count = 0;
    for (const row of icd10Result.rows) {
      const key = `icd10:${row.icd10_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      icd10Count++;
      if (icd10Count % 100 === 0) {
        console.log(`Stored ${icd10Count} ICD-10 codes so far...`);
      }
    }
    console.log(`Completed storing ${icd10Count} ICD-10 codes in Redis`);
    
    // Get mappings from PostgreSQL (no limit)
    console.log('Getting ALL mappings from PostgreSQL...');
    const mappingResult = await queryDb(`
      SELECT m.id, m.icd10_code, i.description as icd10_description, 
             m.cpt_code, c.description as cpt_description, 
             m.appropriateness, m.evidence_source, m.refined_justification
      FROM medical_cpt_icd10_mappings m
      JOIN medical_icd10_codes i ON m.icd10_code = i.icd10_code
      JOIN medical_cpt_codes c ON m.cpt_code = c.cpt_code
    `);
    console.log(`Found ${mappingResult.rows.length} mappings`);
    
    // Store mappings in Redis
    console.log('Storing mappings in Redis...');
    let mappingCount = 0;
    for (const row of mappingResult.rows) {
      const key = `mapping:${row.icd10_code}:${row.cpt_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      mappingCount++;
      if (mappingCount % 100 === 0) {
        console.log(`Stored ${mappingCount} mappings so far...`);
      }
    }
    console.log(`Completed storing ${mappingCount} mappings in Redis`);
    
    // Get markdown docs from PostgreSQL (no limit)
    console.log('Getting ALL markdown docs from PostgreSQL...');
    const markdownResult = await queryDb(`
      SELECT md.id, md.icd10_code, i.description as icd10_description, 
             md.content, md.content_preview
      FROM medical_icd10_markdown_docs md
      JOIN medical_icd10_codes i ON md.icd10_code = i.icd10_code
    `);
    console.log(`Found ${markdownResult.rows.length} markdown docs`);
    
    // Store markdown docs in Redis
    console.log('Storing markdown docs in Redis...');
    let markdownCount = 0;
    for (const row of markdownResult.rows) {
      const key = `markdown:${row.icd10_code}`;
      await cacheDataWithRedisJson(key, row, 0);
      markdownCount++;
      if (markdownCount % 100 === 0) {
        console.log(`Stored ${markdownCount} markdown docs so far...`);
      }
    }
    console.log(`Completed storing ${markdownCount} markdown docs in Redis`);
    
    // Check if the data was stored
    const keys = await redisClient.keys('*');
    console.log(`Total Redis keys after population: ${keys.length}`);
    
    // Count keys by type
    const cptKeys = await redisClient.keys('cpt:*');
    const icd10Keys = await redisClient.keys('icd10:*');
    const mappingKeys = await redisClient.keys('mapping:*');
    const markdownKeys = await redisClient.keys('markdown:*');
    
    console.log(`CPT keys: ${cptKeys.length}`);
    console.log(`ICD-10 keys: ${icd10Keys.length}`);
    console.log(`Mapping keys: ${mappingKeys.length}`);
    console.log(`Markdown keys: ${markdownKeys.length}`);
    
    // Create search indexes
    await createSearchIndexes();
    
    console.log('Redis full population complete!');
  } catch (error) {
    console.error('Error populating Redis:', error);
  } finally {
    await closeRedisConnection();
    await closePgConnection();
  }
}

/**
 * Create search indexes for efficient searching
 */
async function createSearchIndexes() {
  try {
    console.log('\n--- Creating RediSearch indexes ---');
    
    // Drop existing indexes if they exist
    try {
      await redisClient.call('FT.DROPINDEX', 'icd10_idx', 'DD');
      console.log('Dropped existing ICD-10 index');
    } catch (error) {
      // Ignore error if index doesn't exist
    }
    
    try {
      await redisClient.call('FT.DROPINDEX', 'cpt_idx', 'DD');
      console.log('Dropped existing CPT index');
    } catch (error) {
      // Ignore error if index doesn't exist
    }
    
    // Create ICD-10 index
    await redisClient.call(
      'FT.CREATE', 'icd10_idx', 'ON', 'HASH', 'PREFIX', '1', 'icd10:', 
      'SCHEMA',
      'icd10_code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0',
      'specialty', 'TAG',
      'category', 'TAG'
    );
    console.log('Created ICD-10 index');
    
    // Create CPT index
    await redisClient.call(
      'FT.CREATE', 'cpt_idx', 'ON', 'HASH', 'PREFIX', '1', 'cpt:', 
      'SCHEMA',
      'cpt_code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0',
      'modality', 'TAG',
      'category', 'TAG'
    );
    console.log('Created CPT index');
    
    console.log('Search indexes created successfully');
  } catch (error) {
    console.error('Error creating search indexes:', error);
  }
}

// Run the population script
populateRedisFull();