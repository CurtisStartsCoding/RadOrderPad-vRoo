// Script to update Vercel environment variables for database connection
// This script modifies the database connection string to handle self-signed certificates

const { exec } = require('child_process');
require('dotenv').config({ path: '../.env.production' });

// Get the current database connection strings
const mainDbUrl = process.env.MAIN_DATABASE_URL;
const phiDbUrl = process.env.PHI_DATABASE_URL;

// Modify the connection strings to disable SSL verification
const updatedMainDbUrl = mainDbUrl.replace('?sslmode=require', '?sslmode=no-verify');
const updatedPhiDbUrl = phiDbUrl.replace('?sslmode=require', '?sslmode=no-verify');

console.log('Current MAIN_DATABASE_URL (masked):', mainDbUrl.replace(/:[^:]*@/, ':****@'));
console.log('Updated MAIN_DATABASE_URL (masked):', updatedMainDbUrl.replace(/:[^:]*@/, ':****@'));
console.log('Current PHI_DATABASE_URL (masked):', phiDbUrl.replace(/:[^:]*@/, ':****@'));
console.log('Updated PHI_DATABASE_URL (masked):', updatedPhiDbUrl.replace(/:[^:]*@/, ':****@'));

// Function to update Vercel environment variable
function updateVercelEnv(name, value) {
  return new Promise((resolve, reject) => {
    // Remove existing variable
    exec(`vercel env rm ${name} -y`, (error, stdout, stderr) => {
      if (error) {
        console.warn(`Warning: Could not remove existing ${name}:`, stderr);
      }
      
      // Add new variable
      const command = `vercel env add ${name} production "${value}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error updating ${name}:`, stderr);
          reject(error);
          return;
        }
        console.log(`Successfully updated ${name}`);
        resolve();
      });
    });
  });
}

// Update both database URLs
async function updateDatabaseUrls() {
  try {
    console.log('Updating MAIN_DATABASE_URL...');
    await updateVercelEnv('MAIN_DATABASE_URL', updatedMainDbUrl);
    
    console.log('Updating PHI_DATABASE_URL...');
    await updateVercelEnv('PHI_DATABASE_URL', updatedPhiDbUrl);
    
    console.log('Environment variables updated successfully!');
    console.log('Next steps:');
    console.log('1. Redeploy your application with: vercel --prod');
    console.log('2. Test the login endpoint again');
  } catch (error) {
    console.error('Failed to update environment variables:', error);
  }
}

// Ask for confirmation before proceeding
console.log('\nThis script will update your Vercel environment variables to fix SSL certificate issues.');
console.log('Press Ctrl+C to cancel or any key to continue...');

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', () => {
  process.stdin.setRawMode(false);
  process.stdin.pause();
  updateDatabaseUrls();
});