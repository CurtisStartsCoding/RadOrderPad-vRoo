// This script runs before the application starts in Vercel
// It creates the logs directory if it doesn't exist

const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
try {
  if (!fs.existsSync('logs')) {
    console.log('Creating logs directory...');
    fs.mkdirSync('logs');
    console.log('Logs directory created successfully.');
  } else {
    console.log('Logs directory already exists.');
  }
} catch (error) {
  console.error('Error creating logs directory:', error);
}

// Create empty log files if they don't exist
try {
  const errorLogPath = path.join('logs', 'error.log');
  const allLogPath = path.join('logs', 'all.log');
  
  if (!fs.existsSync(errorLogPath)) {
    console.log('Creating error.log file...');
    fs.writeFileSync(errorLogPath, '');
    console.log('error.log file created successfully.');
  }
  
  if (!fs.existsSync(allLogPath)) {
    console.log('Creating all.log file...');
    fs.writeFileSync(allLogPath, '');
    console.log('all.log file created successfully.');
  }
} catch (error) {
  console.error('Error creating log files:', error);
}

console.log('Vercel setup completed.');