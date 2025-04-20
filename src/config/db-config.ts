import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Database configuration
 */

// Main database configuration
export const mainDbConfig = {
  connectionString: process.env.NODE_ENV === 'production'
    ? process.env.MAIN_DATABASE_URL
    : process.env.DEV_MAIN_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// PHI database configuration
export const phiDbConfig = {
  connectionString: process.env.NODE_ENV === 'production'
    ? process.env.PHI_DATABASE_URL
    : process.env.DEV_PHI_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Log database connection strings
console.log('Database connection strings:');
console.log('Environment:', process.env.NODE_ENV);
console.log('MAIN_DATABASE_URL:', process.env.NODE_ENV === 'production'
  ? process.env.MAIN_DATABASE_URL
  : process.env.DEV_MAIN_DATABASE_URL);
console.log('PHI_DATABASE_URL:', process.env.NODE_ENV === 'production'
  ? process.env.PHI_DATABASE_URL
  : process.env.DEV_PHI_DATABASE_URL);

// Create connection pools
export const mainDbPool = new Pool(mainDbConfig);
export const phiDbPool = new Pool(phiDbConfig);

// Event listeners for connection issues
mainDbPool.on('error', (err) => {
  console.error('Unexpected error on main database idle client', err);
  // Don't exit the process, just log the error
});

phiDbPool.on('error', (err) => {
  console.error('Unexpected error on PHI database idle client', err);
  // Don't exit the process, just log the error
});