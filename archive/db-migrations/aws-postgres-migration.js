/**
 * AWS PostgreSQL Migration Script
 * 
 * This script migrates data from local PostgreSQL databases to AWS RDS instances.
 * It handles both the main database and PHI database separately.
 * 
 * Usage:
 * node aws-postgres-migration.js [options]
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const winston = require('winston');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'db-migrations/migration.log' })
  ]
});

// Parse command line arguments
program
  .option('--source-main <url>', 'Source main database connection URL')
  .option('--source-phi <url>', 'Source PHI database connection URL')
  .option('--target-main <url>', 'Target AWS main database connection URL')
  .option('--target-phi <url>', 'Target AWS PHI database connection URL')
  .option('--schema-only', 'Migrate schema only (no data)')
  .option('--data-only', 'Migrate data only (assumes schema exists)')
  .option('--use-env', 'Use environment variables for connection details')
  .parse(process.argv);

const options = program.opts();

// If using environment variables, set the connection URLs
if (options.useEnv) {
  logger.info('Using connection details from environment variables');
  
  options.sourceMain = process.env.MAIN_DATABASE_URL || process.env.DEV_MAIN_DATABASE_URL;
  options.sourcePhi = process.env.PHI_DATABASE_URL || process.env.DEV_PHI_DATABASE_URL;
  options.targetMain = process.env.PROD_MAIN_DATABASE_URL;
  options.targetPhi = process.env.PROD_PHI_DATABASE_URL;
  
  logger.info(`Source Main DB: ${options.sourceMain.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  logger.info(`Source PHI DB: ${options.sourcePhi.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  logger.info(`Target Main DB: ${options.targetMain.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
  logger.info(`Target PHI DB: ${options.targetPhi.replace(/\/\/([^:]+):[^@]+@/, '//***:***@')}`);
}

// Validate required parameters
if (!options.sourceMain || !options.sourcePhi || !options.targetMain || !options.targetPhi) {
  logger.error('Missing required connection parameters. Use --help for usage information.');
  logger.error('You can provide connection URLs directly or use --use-env to read from .env file.');
  process.exit(1);
}

// Database connection clients
let sourceMainClient, sourcePhiClient, targetMainClient, targetPhiClient;

/**
 * Connect to all databases
 */
async function connectToDatabases() {
  try {
    logger.info('Connecting to source main database...');
    sourceMainClient = new Client(options.sourceMain);
    await sourceMainClient.connect();
    
    logger.info('Connecting to source PHI database...');
    sourcePhiClient = new Client(options.sourcePhi);
    await sourcePhiClient.connect();
    
    logger.info('Connecting to target AWS main database...');
    targetMainClient = new Client(options.targetMain);
    await targetMainClient.connect();
    
    logger.info('Connecting to target AWS PHI database...');
    targetPhiClient = new Client(options.targetPhi);
    await targetPhiClient.connect();
    
    logger.info('Successfully connected to all databases');
  } catch (error) {
    logger.error(`Error connecting to databases: ${error.message}`);
    await cleanup();
    process.exit(1);
  }
}

/**
 * Get table list from a database
 */
async function getTableList(client, schemaName = 'public') {
  const query = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = $1 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  
  const result = await client.query(query, [schemaName]);
  return result.rows.map(row => row.table_name);
}

/**
 * Get table schema (CREATE TABLE statement)
 */
async function getTableSchema(client, tableName, schemaName = 'public') {
  // This uses pg_dump to get the CREATE TABLE statement
  // In a real implementation, you might want to use a more robust approach
  const query = `
    SELECT 
      'CREATE TABLE ' || 
      quote_ident('${tableName}') || ' (' || 
      string_agg(
        quote_ident(column_name) || ' ' || 
        data_type || 
        CASE 
          WHEN character_maximum_length IS NOT NULL THEN '(' || character_maximum_length || ')'
          ELSE ''
        END || 
        CASE 
          WHEN is_nullable = 'NO' THEN ' NOT NULL'
          ELSE ''
        END,
        ', '
      ) || ');' as create_statement
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
    GROUP BY table_name;
  `;
  
  const result = await client.query(query, [schemaName, tableName]);
  return result.rows[0]?.create_statement || '';
}

/**
 * Get primary key and index definitions
 */
async function getTableConstraints(client, tableName, schemaName = 'public') {
  const query = `
    SELECT pg_get_constraintdef(c.oid) || ';' as constraint_def
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE n.nspname = $1
    AND t.relname = $2;
  `;
  
  const result = await client.query(query, [schemaName, tableName]);
  return result.rows.map(row => row.constraint_def);
}

/**
 * Get index definitions
 */
async function getTableIndexes(client, tableName, schemaName = 'public') {
  const query = `
    SELECT pg_get_indexdef(i.indexrelid) || ';' as index_def
    FROM pg_index i
    JOIN pg_class t ON t.oid = i.indrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = $1
    AND t.relname = $2
    AND i.indisprimary = false;
  `;
  
  const result = await client.query(query, [schemaName, tableName]);
  return result.rows.map(row => row.index_def);
}

/**
 * Migrate schema for a single table
 */
async function migrateTableSchema(sourceClient, targetClient, tableName) {
  try {
    logger.info(`Migrating schema for table: ${tableName}`);
    
    // Get table schema
    const createTableStatement = await getTableSchema(sourceClient, tableName);
    
    // Get constraints
    const constraints = await getTableConstraints(sourceClient, tableName);
    
    // Get indexes
    const indexes = await getTableIndexes(sourceClient, tableName);
    
    // Create table in target database
    await targetClient.query(createTableStatement);
    
    // Create constraints
    for (const constraint of constraints) {
      await targetClient.query(constraint);
    }
    
    // Create indexes
    for (const index of indexes) {
      await targetClient.query(index);
    }
    
    logger.info(`Successfully migrated schema for table: ${tableName}`);
  } catch (error) {
    logger.error(`Error migrating schema for table ${tableName}: ${error.message}`);
    throw error;
  }
}

/**
 * Migrate data for a single table
 */
async function migrateTableData(sourceClient, targetClient, tableName, batchSize = 1000) {
  try {
    // Get column names
    const columnsQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const columnsResult = await sourceClient.query(columnsQuery, [tableName]);
    const columns = columnsResult.rows.map(row => row.column_name);
    
    if (columns.length === 0) {
      logger.warn(`No columns found for table: ${tableName}`);
      return;
    }
    
    // Get row count
    const countQuery = `SELECT COUNT(*) FROM ${tableName};`;
    const countResult = await sourceClient.query(countQuery);
    const totalRows = parseInt(countResult.rows[0].count, 10);
    
    logger.info(`Migrating ${totalRows} rows for table: ${tableName}`);
    
    // Migrate in batches
    const columnsList = columns.join(', ');
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    
    // Begin transaction
    await targetClient.query('BEGIN');
    
    for (let offset = 0; offset < totalRows; offset += batchSize) {
      const selectQuery = `
        SELECT ${columnsList}
        FROM ${tableName}
        LIMIT ${batchSize} OFFSET ${offset};
      `;
      
      const dataResult = await sourceClient.query(selectQuery);
      
      for (const row of dataResult.rows) {
        const values = columns.map(col => row[col]);
        const insertQuery = `
          INSERT INTO ${tableName} (${columnsList})
          VALUES (${placeholders});
        `;
        
        await targetClient.query(insertQuery, values);
      }
      
      logger.info(`Migrated batch for table ${tableName}: ${offset + dataResult.rowCount}/${totalRows}`);
    }
    
    // Commit transaction
    await targetClient.query('COMMIT');
    
    logger.info(`Successfully migrated data for table: ${tableName}`);
  } catch (error) {
    // Rollback transaction on error
    await targetClient.query('ROLLBACK');
    logger.error(`Error migrating data for table ${tableName}: ${error.message}`);
    throw error;
  }
}

/**
 * Migrate sequences
 */
async function migrateSequences(sourceClient, targetClient) {
  try {
    logger.info('Migrating sequences...');
    
    const query = `
      SELECT sequence_name
      FROM information_schema.sequences
      WHERE sequence_schema = 'public';
    `;
    
    const result = await sourceClient.query(query);
    
    for (const row of result.rows) {
      const sequenceName = row.sequence_name;
      
      // Get current value
      const valueQuery = `SELECT last_value FROM ${sequenceName};`;
      const valueResult = await sourceClient.query(valueQuery);
      const lastValue = valueResult.rows[0].last_value;
      
      // Set sequence value in target
      const setValueQuery = `SELECT setval('${sequenceName}', ${lastValue}, true);`;
      await targetClient.query(setValueQuery);
      
      logger.info(`Migrated sequence: ${sequenceName} (value: ${lastValue})`);
    }
    
    logger.info('Successfully migrated all sequences');
  } catch (error) {
    logger.error(`Error migrating sequences: ${error.message}`);
    throw error;
  }
}

/**
 * Migrate schema for all tables
 */
async function migrateSchema(sourceClient, targetClient) {
  try {
    logger.info('Starting schema migration...');
    
    // Get list of tables
    const tables = await getTableList(sourceClient);
    
    // Migrate each table schema
    for (const tableName of tables) {
      await migrateTableSchema(sourceClient, targetClient, tableName);
    }
    
    logger.info('Schema migration completed successfully');
  } catch (error) {
    logger.error(`Schema migration failed: ${error.message}`);
    throw error;
  }
}

/**
 * Migrate data for all tables
 */
async function migrateData(sourceClient, targetClient) {
  try {
    logger.info('Starting data migration...');
    
    // Get list of tables
    const tables = await getTableList(sourceClient);
    
    // Migrate each table's data
    for (const tableName of tables) {
      await migrateTableData(sourceClient, targetClient, tableName);
    }
    
    // Migrate sequences
    await migrateSequences(sourceClient, targetClient);
    
    logger.info('Data migration completed successfully');
  } catch (error) {
    logger.error(`Data migration failed: ${error.message}`);
    throw error;
  }
}

/**
 * Cleanup database connections
 */
async function cleanup() {
  logger.info('Cleaning up database connections...');
  
  if (sourceMainClient) {
    await sourceMainClient.end();
  }
  
  if (sourcePhiClient) {
    await sourcePhiClient.end();
  }
  
  if (targetMainClient) {
    await targetMainClient.end();
  }
  
  if (targetPhiClient) {
    await targetPhiClient.end();
  }
  
  logger.info('Cleanup completed');
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    logger.info('Starting database migration to AWS...');
    
    // Connect to all databases
    await connectToDatabases();
    
    // Migrate main database
    if (!options.dataOnly) {
      logger.info('Migrating main database schema...');
      await migrateSchema(sourceMainClient, targetMainClient);
    }
    
    if (!options.schemaOnly) {
      logger.info('Migrating main database data...');
      await migrateData(sourceMainClient, targetMainClient);
    }
    
    // Migrate PHI database
    if (!options.dataOnly) {
      logger.info('Migrating PHI database schema...');
      await migrateSchema(sourcePhiClient, targetPhiClient);
    }
    
    if (!options.schemaOnly) {
      logger.info('Migrating PHI database data...');
      await migrateData(sourcePhiClient, targetPhiClient);
    }
    
    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error(`Migration failed: ${error.message}`);
  } finally {
    await cleanup();
  }
}

// Run migration
migrate().catch(error => {
  logger.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});