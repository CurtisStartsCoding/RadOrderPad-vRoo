/**
 * Master script to populate Redis with all data from PostgreSQL using batch operations
 * This script runs all the individual batch scripts in sequence
 */
import { spawn } from 'child_process';
import path from 'path';

// List of scripts to run in sequence
const scripts = [
  'populate-redis-cpt-batch.js',
  'populate-redis-icd10-batch.js',
  'populate-redis-mappings-batch.js',
  'populate-redis-markdown-batch.js'
];

// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n========== Running ${scriptPath} ==========\n`);
    
    const process = spawn('node', [scriptPath], { 
      stdio: 'inherit',
      shell: true
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`\n========== ${scriptPath} completed successfully ==========\n`);
        resolve();
      } else {
        console.error(`\n========== ${scriptPath} failed with code ${code} ==========\n`);
        reject(new Error(`Script ${scriptPath} failed with code ${code}`));
      }
    });
    
    process.on('error', (err) => {
      console.error(`\n========== Error running ${scriptPath}: ${err.message} ==========\n`);
      reject(err);
    });
  });
}

// Run all scripts in sequence
async function runAllScripts() {
  console.log('Starting Redis population with all data types...');
  console.log(`Will run ${scripts.length} scripts in sequence: ${scripts.join(', ')}`);
  
  const startTime = new Date();
  
  try {
    for (const script of scripts) {
      const scriptPath = path.join(__dirname, script);
      await runScript(scriptPath);
    }
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    console.log('\n========== All Redis population scripts completed successfully ==========');
    console.log(`Total time: ${duration.toFixed(2)} seconds`);
    console.log('Redis is now fully populated with all data types!');
  } catch (error) {
    console.error(`Error running scripts: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
runAllScripts();