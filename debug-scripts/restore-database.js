/**
 * Script to restore database from backup
 */
require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Backup file path
const backupFilePath = path.resolve(__dirname, 'radorder_main_backup_20250415.sql');

// Construct the psql command
const command = `PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -f "${backupFilePath}"`;

console.log('Restoring database from backup...');
console.log(`Database: ${DB_NAME}`);
console.log(`Host: ${DB_HOST}:${DB_PORT}`);
console.log(`User: ${DB_USER}`);
console.log(`Backup file: ${backupFilePath}`);
console.log('\nExecuting command...');

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`stderr: ${stderr}`);
  }
  
  console.log(`stdout: ${stdout}`);
  console.log('Database restore completed successfully.');
  
  console.log('\nNow running the comprehensive workflow tests...');
  
  // Run the comprehensive workflow tests
  exec('run-comprehensive-workflow-tests.bat', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error running tests: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Test stderr: ${stderr}`);
    }
    
    console.log(`Test stdout: ${stdout}`);
    console.log('Comprehensive workflow tests completed.');
  });
});