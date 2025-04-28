import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import enhancedLogger from '../utils/enhanced-logger';

// Load environment variables
dotenv.config();

/**
 * Database configuration
 */

// Determine which database URLs to use based on USE_PRIVATE_DB flag
const usePrivateDb = process.env.USE_PRIVATE_DB === 'true';
enhancedLogger.info('Using private databases:', usePrivateDb);

// Main database configuration
export const mainDbConfig = {
  connectionString: process.env.NODE_ENV === 'production'
    ? (usePrivateDb ? process.env.PRIVATE_MAIN_DATABASE_URL : process.env.MAIN_DATABASE_URL)
    : process.env.DEV_MAIN_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// PHI database configuration
export const phiDbConfig = {
  connectionString: process.env.NODE_ENV === 'production'
    ? (usePrivateDb ? process.env.PRIVATE_PHI_DATABASE_URL : process.env.PHI_DATABASE_URL)
    : process.env.DEV_PHI_DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Log database connection strings
enhancedLogger.info('Database connection strings:');
enhancedLogger.info('Environment:', process.env.NODE_ENV);

// Log which database URLs are being used
if (process.env.NODE_ENV === 'production') {
  if (usePrivateDb) {
    enhancedLogger.info('Using PRIVATE database connections');
    enhancedLogger.info('PRIVATE_MAIN_DATABASE_URL:', process.env.PRIVATE_MAIN_DATABASE_URL);
    enhancedLogger.info('PRIVATE_PHI_DATABASE_URL:', process.env.PRIVATE_PHI_DATABASE_URL);
  } else {
    enhancedLogger.info('Using PUBLIC database connections');
    enhancedLogger.info('MAIN_DATABASE_URL:', process.env.MAIN_DATABASE_URL);
    enhancedLogger.info('PHI_DATABASE_URL:', process.env.PHI_DATABASE_URL);
  }
} else {
  enhancedLogger.info('Using DEVELOPMENT database connections');
  enhancedLogger.info('DEV_MAIN_DATABASE_URL:', process.env.DEV_MAIN_DATABASE_URL);
  enhancedLogger.info('DEV_PHI_DATABASE_URL:', process.env.DEV_PHI_DATABASE_URL);
}

// Create connection pools
export const mainDbPool = new Pool(mainDbConfig);
export const phiDbPool = new Pool(phiDbConfig);

// Event listeners for connection issues
mainDbPool.on('error', (err) => {
  enhancedLogger.error('Unexpected error on main database idle client', err);
  // Don't exit the process, just log the error
});

phiDbPool.on('error', (err) => {
  enhancedLogger.error('Unexpected error on PHI database idle client', err);
  // Don't exit the process, just log the error
});