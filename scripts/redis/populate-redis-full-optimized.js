/**
 * Script to populate Redis with ALL data from PostgreSQL - Optimized Version
 * 
 * This script uses batch operations and pipelines for faster loading.
 * It's also resilient to database schema differences.
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
  connectionName: 'redis-populate-optimized',
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
 * Cache data in Redis using batch operations
 * @param {Array} items - Array of items to cache
 * @param {Function} keyFn - Function to generate key for each item
 * @param {number} ttl - Time to live in seconds (0 for no expiration)
 */
async function cacheBatch(items, keyFn, ttl = 0) {
  const BATCH_SIZE = 1000; // Process 1000 items at a time
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const pipeline = redisClient.pipeline();
    
    for (const item of batch) {
      const key = keyFn(item);
      
      // Store as a hash
      for (const [field, value] of Object.entries(item)) {
        if (value !== null && value !== undefined) {
          pipeline.hset(key, field, typeof value === 'object' ? JSON.stringify(value) : value.toString());
        }
      }
      
      // Set expiration if ttl > 0
      if (ttl > 0) {
        pipeline.expire(key, ttl);
      }
    }
    
    await pipeline.exec();
    console.log(`Processed batch ${i / BATCH_SIZE + 1}/${Math.ceil(items.length / BATCH_SIZE)}, ${i + batch.length}/${items.length} items`);
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
 * Get table columns
 * @param {string} tableName - Table name
 * @returns {Promise<Array>} - Array of column names
 */
async function getTableColumns(tableName) {
  try {
    const result = await queryDb(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
    `, [tableName]);
    
    return result.rows.map(row => row.column_name);
  } catch (error) {
    console.error(`Error getting columns for table ${tableName}:`, error);
    return [];
  }
}

/**
 * Populate Redis with all data from PostgreSQL
 */
async function populateRedisFull() {
  try {
    console.log('Populating Redis with ALL data from PostgreSQL...');
    const startTime = Date.now();
    
    // Check if Redis is connected
    const pingResult = await redisClient.ping();
    console.log(`Redis ping result: ${pingResult}`);
    
    // Test PostgreSQL connection
    console.log('Testing PostgreSQL connection...');
    const testResult = await queryDb('SELECT 1 as test');
    console.log('PostgreSQL connection successful:', testResult.rows[0].test);
    
    // Check if tables exist
    console.log('Checking if tables exist...');
    
    // Check if medical_cpt_codes table exists
    try {
      console.log('Getting CPT codes from PostgreSQL...');
      const cptColumns = await getTableColumns('medical_cpt_codes');
      console.log('CPT table columns:', cptColumns);
      
      if (cptColumns.length > 0) {
        // Get CPT codes from PostgreSQL
        const cptResult = await queryDb(`SELECT * FROM medical_cpt_codes`);
        console.log(`Found ${cptResult.rows.length} CPT codes`);
        
        // Store CPT codes in Redis
        console.log('Storing CPT codes in Redis...');
        await cacheBatch(cptResult.rows, row => `cpt:${row.cpt_code || row.code}`);
        console.log(`Completed storing ${cptResult.rows.length} CPT codes in Redis`);
      } else {
        console.log('CPT table not found or has no columns');
      }
    } catch (error) {
      console.error('Error processing CPT codes:', error);
    }
    
    // Check if medical_icd10_codes table exists
    try {
      console.log('Getting ICD-10 codes from PostgreSQL...');
      const icd10Columns = await getTableColumns('medical_icd10_codes');
      console.log('ICD-10 table columns:', icd10Columns);
      
      if (icd10Columns.length > 0) {
        // Get ICD-10 codes from PostgreSQL
        const icd10Result = await queryDb(`SELECT * FROM medical_icd10_codes`);
        console.log(`Found ${icd10Result.rows.length} ICD-10 codes`);
        
        // Store ICD-10 codes in Redis
        console.log('Storing ICD-10 codes in Redis...');
        await cacheBatch(icd10Result.rows, row => `icd10:${row.icd10_code || row.code}`);
        console.log(`Completed storing ${icd10Result.rows.length} ICD-10 codes in Redis`);
      } else {
        console.log('ICD-10 table not found or has no columns');
      }
    } catch (error) {
      console.error('Error processing ICD-10 codes:', error);
    }
    
    // Check if medical_cpt_icd10_mappings table exists
    try {
      console.log('Getting mappings from PostgreSQL...');
      const mappingColumns = await getTableColumns('medical_cpt_icd10_mappings');
      console.log('Mapping table columns:', mappingColumns);
      
      if (mappingColumns.length > 0) {
        // Get mappings from PostgreSQL
        const mappingResult = await queryDb(`
          SELECT * FROM medical_cpt_icd10_mappings
        `);
        console.log(`Found ${mappingResult.rows.length} mappings`);
        
        // Store mappings in Redis
        console.log('Storing mappings in Redis...');
        await cacheBatch(mappingResult.rows, row => `mapping:${row.icd10_code || row.icd_code}:${row.cpt_code}`);
        console.log(`Completed storing ${mappingResult.rows.length} mappings in Redis`);
      } else {
        console.log('Mapping table not found or has no columns');
      }
    } catch (error) {
      console.error('Error processing mappings:', error);
    }
    
    // Check if medical_icd10_markdown_docs table exists
    try {
      console.log('Getting markdown docs from PostgreSQL...');
      const markdownColumns = await getTableColumns('medical_icd10_markdown_docs');
      console.log('Markdown table columns:', markdownColumns);
      
      if (markdownColumns.length > 0) {
        // Get markdown docs from PostgreSQL
        const markdownResult = await queryDb(`
          SELECT * FROM medical_icd10_markdown_docs
        `);
        console.log(`Found ${markdownResult.rows.length} markdown docs`);
        
        // Store markdown docs in Redis
        console.log('Storing markdown docs in Redis...');
        await cacheBatch(markdownResult.rows, row => `markdown:${row.icd10_code || row.icd_code}`);
        console.log(`Completed storing ${markdownResult.rows.length} markdown docs in Redis`);
      } else {
        console.log('Markdown table not found or has no columns');
      }
    } catch (error) {
      console.error('Error processing markdown docs:', error);
    }
    
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
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(`Redis full population complete in ${duration.toFixed(2)} seconds!`);
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
      'code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0'
    );
    console.log('Created ICD-10 index');
    
    // Create CPT index
    await redisClient.call(
      'FT.CREATE', 'cpt_idx', 'ON', 'HASH', 'PREFIX', '1', 'cpt:', 
      'SCHEMA',
      'cpt_code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'code', 'TEXT', 'NOSTEM', 'SORTABLE',
      'description', 'TEXT', 'WEIGHT', '2.0'
    );
    console.log('Created CPT index');
    
    console.log('Search indexes created successfully');
  } catch (error) {
    console.error('Error creating search indexes:', error);
  }
}

// Run the population script
populateRedisFull();