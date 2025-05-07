/**
 * Direct script to add the referring_organization_name column to the orders table
 * This script uses environment variables from .env.production to connect to the database
 */

const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.production
dotenv.config({ path: path.resolve(__dirname, '../.env.production') });

console.log('=== Direct Column Addition Script ===');
console.log('This script will add the referring_organization_name column to the orders table');

// Get the database URL from environment variables
const phiDbUrl = process.env.PROD_PHI_DATABASE_URL;

if (!phiDbUrl) {
  console.error('ERROR: PROD_PHI_DATABASE_URL is not set in .env.production');
  process.exit(1);
}

console.log('Using database URL from: PROD_PHI_DATABASE_URL');

// Create modified connection string with SSL verification disabled
const connectionString = phiDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

// Show more details about the connection string (masking password)
const maskedUrl = connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
console.log(`Connection string (masked): ${maskedUrl}`);

// Create connection pool with SSL verification disabled
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// SQL to add the column if it doesn't exist
const addColumnSQL = `
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'referring_organization_name'
    ) THEN
        -- Add the missing column
        ALTER TABLE orders
        ADD COLUMN referring_organization_name VARCHAR(255);
        
        RAISE NOTICE 'Added referring_organization_name column to orders table';
    ELSE
        RAISE NOTICE 'referring_organization_name column already exists in orders table';
    END IF;
END $$;
`;

// Function to add the column
async function addColumn() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    try {
      console.log('Connected to database. Adding column...');
      await client.query(addColumnSQL);
      console.log('Column added successfully!');
      
      // Verify the column was added
      const verifyResult = await client.query(`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'orders' 
          AND column_name = 'referring_organization_name'
        );
      `);
      
      if (verifyResult.rows[0].exists) {
        console.log('✅ Verification successful: referring_organization_name column exists in the orders table.');
      } else {
        console.log('❌ Verification failed: referring_organization_name column does NOT exist in the orders table.');
      }
    } catch (err) {
      console.error(`Error executing SQL: ${err.message}`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(`Error connecting to database: ${err.message}`);
  } finally {
    await pool.end();
  }
}

// Run the function
addColumn();