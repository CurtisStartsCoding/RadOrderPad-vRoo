/**
 * Script to check what files were modified around 33 minutes ago
 */
require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get database connection details from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = 'radorder_main'; // Use the main database
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Create a connection pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});

async function run() {
  let client;
  
  try {
    console.log('Connecting to database...');
    client = await pool.connect();
    console.log('Connected to database');
    
    // Check for prompt template changes around 33 minutes ago
    console.log('\nChecking for prompt template changes around 33 minutes ago...');
    const promptResult = await client.query(`
      SELECT id, name, type, version, active, created_at, updated_at
      FROM prompt_templates
      WHERE updated_at > NOW() - INTERVAL '40 minutes'
      ORDER BY updated_at DESC;
    `);
    
    if (promptResult.rows.length === 0) {
      console.log('No prompt template changes found in the last 40 minutes.');
    } else {
      console.log('Prompt template changes in the last 40 minutes:');
      promptResult.rows.forEach(template => {
        console.log(`ID: ${template.id}, Name: ${template.name}, Type: ${template.type}, Version: ${template.version}, Active: ${template.active}, Updated: ${template.updated_at}`);
      });
    }
    
    // Check for git changes around 33 minutes ago
    console.log('\nChecking for git changes around 33 minutes ago...');
    try {
      const gitLog = execSync('git log --since="40 minutes ago" --pretty=format:"%h - %an, %ar : %s"').toString();
      if (gitLog.trim() === '') {
        console.log('No git commits found in the last 40 minutes.');
      } else {
        console.log('Git commits in the last 40 minutes:');
        console.log(gitLog);
      }
    } catch (error) {
      console.log('Error checking git log:', error.message);
    }
    
    // Check for file modifications around 33 minutes ago
    console.log('\nChecking for file modifications around 33 minutes ago...');
    try {
      // Get the current time
      const now = new Date();
      // Calculate the time 33 minutes ago
      const timeAgo = new Date(now.getTime() - 40 * 60 * 1000);
      
      // Function to recursively check files in a directory
      function checkFilesInDirectory(dir) {
        const files = fs.readdirSync(dir);
        const recentFiles = [];
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            // Recursively check subdirectories
            recentFiles.push(...checkFilesInDirectory(filePath));
          } else if (stats.isFile()) {
            // Check if the file was modified in the last 40 minutes
            if (stats.mtime > timeAgo) {
              recentFiles.push({
                path: filePath,
                mtime: stats.mtime
              });
            }
          }
        }
        
        return recentFiles;
      }
      
      const recentFiles = checkFilesInDirectory('.');
      
      if (recentFiles.length === 0) {
        console.log('No file modifications found in the last 40 minutes.');
      } else {
        console.log('File modifications in the last 40 minutes:');
        // Sort by modification time (most recent first)
        recentFiles.sort((a, b) => b.mtime - a.mtime);
        recentFiles.forEach(file => {
          console.log(`${file.path} - Modified: ${file.mtime}`);
        });
      }
    } catch (error) {
      console.log('Error checking file modifications:', error.message);
    }
    
    // Check for changes in the PHI database
    console.log('\nChecking for changes in the PHI database...');
    try {
      // Create a new connection to the PHI database
      const phiPool = new Pool({
        host: DB_HOST,
        port: DB_PORT,
        database: 'radorder_phi',
        user: DB_USER,
        password: DB_PASSWORD
      });
      
      const phiClient = await phiPool.connect();
      
      // Check for validation attempts around 33 minutes ago
      const validationResult = await phiClient.query(`
        SELECT id, order_id, created_at
        FROM validation_attempts
        WHERE created_at > NOW() - INTERVAL '40 minutes'
        ORDER BY created_at DESC
        LIMIT 10;
      `);
      
      if (validationResult.rows.length === 0) {
        console.log('No validation attempts found in the last 40 minutes.');
      } else {
        console.log('Validation attempts in the last 40 minutes:');
        validationResult.rows.forEach(attempt => {
          console.log(`ID: ${attempt.id}, Order ID: ${attempt.order_id}, Created: ${attempt.created_at}`);
        });
      }
      
      // Check for llm validation logs around 33 minutes ago
      const logsResult = await phiClient.query(`
        SELECT id, created_at
        FROM llm_validation_logs
        WHERE created_at > NOW() - INTERVAL '40 minutes'
        ORDER BY created_at DESC
        LIMIT 10;
      `);
      
      if (logsResult.rows.length === 0) {
        console.log('No llm validation logs found in the last 40 minutes.');
      } else {
        console.log('LLM validation logs in the last 40 minutes:');
        logsResult.rows.forEach(log => {
          console.log(`ID: ${log.id}, Created: ${log.created_at}`);
        });
      }
      
      phiClient.release();
      await phiPool.end();
    } catch (error) {
      console.log('Error checking PHI database:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (client) {
      client.release();
    }
    // Close the pool
    await pool.end();
  }
}

// Run the function
run().catch(err => {
  console.error('Unhandled error:', err);
});